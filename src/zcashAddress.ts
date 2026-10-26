import { blake2b } from '@noble/hashes/blake2.js'

const BECH32_ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const BECH32_MAP = new Map(Array.from(BECH32_ALPHABET, (character, index) => [character, index]))
const GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
const textEncoder = new TextEncoder()

export interface ShieldedTestnetAddress {
  address: string
  kind: 'sapling' | 'unified-r0' | 'unified-r2'
  receiverTypes: ('sapling' | 'orchard')[]
}

function polymod(values: number[]): number {
  let check = 1
  for (const value of values) {
    const top = check >>> 25
    check = (((check & 0x1ffffff) << 5) ^ value) >>> 0
    for (let index = 0; index < 5; index += 1) if ((top >>> index) & 1) check = (check ^ GENERATORS[index]) >>> 0
  }
  return check >>> 0
}

function hrpExpand(hrp: string): number[] {
  return [...Array.from(hrp, (character) => character.charCodeAt(0) >>> 5), 0, ...Array.from(hrp, (character) => character.charCodeAt(0) & 31)]
}

function convertBits(values: number[], from: number, to: number): Uint8Array {
  let accumulator = 0
  let bits = 0
  const result: number[] = []
  const maxValue = (1 << to) - 1
  for (const value of values) {
    if (value < 0 || value >>> from !== 0) throw new Error('Address contains an invalid base32 value.')
    accumulator = (accumulator << from) | value
    bits += from
    while (bits >= to) {
      bits -= to
      result.push((accumulator >>> bits) & maxValue)
    }
  }
  if (bits >= from || ((accumulator << (to - bits)) & maxValue) !== 0) throw new Error('Address has non-zero padding.')
  return Uint8Array.from(result)
}

function decodeBech32(value: string, expectedHrp: string, bech32m: boolean): Uint8Array {
  if (value !== value.toLowerCase() || !/^[!-~]+$/.test(value)) throw new Error('Address must be lowercase printable ASCII.')
  const separator = value.lastIndexOf('1')
  if (separator < 1 || separator + 7 > value.length) throw new Error('Address has an invalid Bech32 shape.')
  const hrp = value.slice(0, separator)
  if (hrp !== expectedHrp) throw new Error(`Expected a ${expectedHrp} testnet address.`)
  const words = Array.from(value.slice(separator + 1), (character) => {
    const word = BECH32_MAP.get(character)
    if (word === undefined) throw new Error('Address contains a character outside the Bech32 alphabet.')
    return word
  })
  const constant = bech32m ? 0x2bc830a3 : 1
  if (polymod([...hrpExpand(hrp), ...words]) !== constant) throw new Error('Address checksum does not match.')
  return convertBits(words.slice(0, -6), 5, 8)
}

function personalization(prefix: string, first: number, second = 0): Uint8Array {
  const result = new Uint8Array(16)
  result.set(textEncoder.encode(prefix), 0)
  result[13] = first
  result[14] = second & 0xff
  result[15] = second >>> 8
  return result
}

function xor(target: Uint8Array, source: Uint8Array, offset = 0): void {
  const length = Math.min(source.length, target.length - offset)
  for (let index = 0; index < length; index += 1) target[offset + index] ^= source[index]
}

export function f4JumbleInverse(input: Uint8Array): Uint8Array {
  if (input.length < 38 || input.length > 4_194_368) throw new Error('Unified Address payload length is outside ZIP-316 bounds.')
  const message = input.slice()
  const leftLength = Math.min(64, Math.floor(message.length / 2))
  const left = message.subarray(0, leftLength)
  const right = message.subarray(leftLength)
  const hRound = (round: number) => xor(left, blake2b(right, { dkLen: left.length, personalization: personalization('UA_F4Jumble_H', round) }))
  const gRound = (round: number) => {
    for (let chunk = 0; chunk < Math.ceil(right.length / 64); chunk += 1) {
      xor(right, blake2b(left, { dkLen: 64, personalization: personalization('UA_F4Jumble_G', round, chunk) }), chunk * 64)
    }
  }
  hRound(1); gRound(1); hRound(0); gRound(0)
  return message
}

function readCompactSize(bytes: Uint8Array, offset: number): { value: number; next: number } {
  if (offset >= bytes.length) throw new Error('Unified Address item is truncated.')
  const first = bytes[offset]
  if (first < 253) return { value: first, next: offset + 1 }
  const count = first === 253 ? 2 : first === 254 ? 4 : 8
  if (offset + 1 + count > bytes.length) throw new Error('Unified Address CompactSize is truncated.')
  let value = 0n
  for (let index = 0; index < count; index += 1) value |= BigInt(bytes[offset + 1 + index]) << BigInt(index * 8)
  const minimum = first === 253 ? 253n : first === 254 ? 0x10000n : 0x1_0000_0000n
  if (value < minimum || value > 0x2000000n) throw new Error('Unified Address CompactSize is non-canonical or too large.')
  return { value: Number(value), next: offset + 1 + count }
}

function decodeUnified(address: string, hrp: 'utest' | 'zutest'): ShieldedTestnetAddress {
  const jumbled = decodeBech32(address, hrp, true)
  const decoded = f4JumbleInverse(jumbled)
  const padding = new Uint8Array(16)
  padding.set(textEncoder.encode(hrp))
  const bodyLength = decoded.length - padding.length
  if (bodyLength <= 0 || !padding.every((byte, index) => decoded[bodyLength + index] === byte)) throw new Error('Unified Address network padding does not match.')
  const body = decoded.subarray(0, bodyLength)
  const receiverTypes: ('sapling' | 'orchard')[] = []
  let offset = 0
  let previousType = -1
  while (offset < body.length) {
    const type = readCompactSize(body, offset); offset = type.next
    const length = readCompactSize(body, offset); offset = length.next
    if (type.value <= previousType) throw new Error('Unified Address receiver types are duplicated or out of order.')
    previousType = type.value
    if (offset + length.value > body.length) throw new Error('Unified Address receiver is truncated.')
    if (type.value !== 2 && type.value !== 3) throw new Error('Use a Unified Address containing shielded receivers only and no unsupported metadata.')
    if (length.value !== 43) throw new Error('Shielded Unified Address receiver has an invalid length.')
    receiverTypes.push(type.value === 2 ? 'sapling' : 'orchard')
    offset += length.value
  }
  if (receiverTypes.length === 0) throw new Error('Unified Address has no supported shielded receiver.')
  return { address, kind: hrp === 'utest' ? 'unified-r0' : 'unified-r2', receiverTypes }
}

export function validateShieldedTestnetAddress(input: string): ShieldedTestnetAddress {
  const address = input.trim()
  if (address.startsWith('ztestsapling1')) {
    const payload = decodeBech32(address, 'ztestsapling', false)
    if (payload.length !== 43) throw new Error('Sapling testnet address payload must be 43 bytes.')
    return { address, kind: 'sapling', receiverTypes: ['sapling'] }
  }
  if (address.startsWith('utest1')) return decodeUnified(address, 'utest')
  if (address.startsWith('zutest1')) return decodeUnified(address, 'zutest')
  throw new Error('Use a shielded Zcash testnet address beginning ztestsapling1, utest1, or zutest1. Transparent and mainnet addresses are refused.')
}
