import { hashText, randomHex } from './game.ts'
import type { VaultId } from './game.ts'
import { validateShieldedTestnetAddress } from './zcashAddress.ts'

export const TESTNET_ROUND_FORMAT = 'veil-vault-testnet-round-v1'
export const TESTNET_RECEIPT_FORMAT = 'veil-vault-private-move-v1'
export const FIXED_MOVE_ZATOSHIS = '100000'
export const FIXED_MOVE_ZEC = '0.001'
export const CONFIRMATION_BLOCKS = 5

export interface TestnetRoundRules {
  version: 1
  roundId: string
  network: 'test'
  address: string
  title: string
  playerLimit: 4
  startHeight: number
  commitDeadlineHeight: number
  revealDeadlineHeight: number
  submissionZatoshis: typeof FIXED_MOVE_ZATOSHIS
  scoring: 'highest-lone-vault'
}

export interface TestnetRoundManifest {
  format: typeof TESTNET_ROUND_FORMAT
  rules: TestnetRoundRules
  rulesHash: string
  anchorTxid: string | null
}

export interface TestnetMoveReceipt {
  format: typeof TESTNET_RECEIPT_FORMAT
  rulesHash: string
  roundId: string
  runnerTag: string
  vaultId: VaultId
  salt: string
  commitment: string
}

export type VeilMemo =
  | { kind: 'anchor'; roundId: string; rulesHash: string }
  | { kind: 'commit'; roundId: string; rulesHash: string; commitment: string }
  | { kind: 'reveal'; roundId: string; rulesHash: string; runnerTag: string; vaultId: VaultId; salt: string }

const vaultCode: Record<VaultId, string> = { copper: 'c', moon: 'm', crown: 's' }
const codeVault: Record<string, VaultId> = { c: 'copper', m: 'moon', s: 'crown' }

function requireHex(value: unknown, length: number, name: string): asserts value is string {
  if (typeof value !== 'string' || !new RegExp(`^[0-9a-f]{${length}}$`).test(value)) throw new Error(`${name} must be ${length} lowercase hexadecimal characters.`)
}

function requireHeight(value: unknown, name: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1 || value > 0xffffffff - CONFIRMATION_BLOCKS) throw new Error(`${name} must be a valid positive block height.`)
}

export function validateTestnetRules(value: unknown): TestnetRoundRules {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Round rules must be an object.')
  const rules = value as Record<string, unknown>
  const expected = ['version', 'roundId', 'network', 'address', 'title', 'playerLimit', 'startHeight', 'commitDeadlineHeight', 'revealDeadlineHeight', 'submissionZatoshis', 'scoring']
  if (Object.keys(rules).some((key) => !expected.includes(key))) throw new Error('Round rules contain unsupported fields. Do not include identities or wallet secrets.')
  if (rules.version !== 1 || rules.network !== 'test' || rules.playerLimit !== 4 || rules.submissionZatoshis !== FIXED_MOVE_ZATOSHIS || rules.scoring !== 'highest-lone-vault') throw new Error('Round uses unsupported network, size, amount, or scoring rules.')
  requireHex(rules.roundId, 16, 'Round ID')
  if (typeof rules.address !== 'string') throw new Error('Round address is missing.')
  validateShieldedTestnetAddress(rules.address)
  // oxlint-disable-next-line no-control-regex -- Public round titles must reject controls.
  if (typeof rules.title !== 'string' || rules.title.trim() !== rules.title || rules.title.length < 1 || rules.title.length > 64 || /[\u0000-\u001f\u007f]/u.test(rules.title)) throw new Error('Round title must be 1–64 characters without controls.')
  requireHeight(rules.startHeight, 'Start height'); requireHeight(rules.commitDeadlineHeight, 'Commit deadline'); requireHeight(rules.revealDeadlineHeight, 'Reveal deadline')
  if (rules.startHeight >= rules.commitDeadlineHeight || rules.commitDeadlineHeight >= rules.revealDeadlineHeight || rules.revealDeadlineHeight - rules.startHeight > 5000) throw new Error('Use increasing heights within a maximum 5,000-block round window.')
  return rules as unknown as TestnetRoundRules
}

export function rulesPreimage(rules: TestnetRoundRules): string {
  validateTestnetRules(rules)
  return JSON.stringify(['VEIL-VAULT-RULES-v1', rules.version, rules.roundId, rules.network, rules.address, rules.title, rules.playerLimit, rules.startHeight, rules.commitDeadlineHeight, rules.revealDeadlineHeight, rules.submissionZatoshis, rules.scoring])
}

export async function createTestnetRound(input: Omit<TestnetRoundRules, 'version' | 'roundId' | 'network' | 'playerLimit' | 'submissionZatoshis' | 'scoring'> & { roundId?: string }): Promise<TestnetRoundManifest> {
  const rules = validateTestnetRules({ version: 1, roundId: input.roundId ?? randomHex(8), network: 'test', address: input.address.trim(), title: input.title.trim(), playerLimit: 4, startHeight: input.startHeight, commitDeadlineHeight: input.commitDeadlineHeight, revealDeadlineHeight: input.revealDeadlineHeight, submissionZatoshis: FIXED_MOVE_ZATOSHIS, scoring: 'highest-lone-vault' })
  return { format: TESTNET_ROUND_FORMAT, rules, rulesHash: await hashText(rulesPreimage(rules)), anchorTxid: null }
}

export async function validateManifest(value: unknown): Promise<TestnetRoundManifest> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Round file must be an object.')
  const manifest = value as Record<string, unknown>
  if (Object.keys(manifest).some((key) => !['format', 'rules', 'rulesHash', 'anchorTxid'].includes(key)) || manifest.format !== TESTNET_ROUND_FORMAT) throw new Error('Not a Veil Vault testnet round file.')
  const rules = validateTestnetRules(manifest.rules)
  requireHex(manifest.rulesHash, 64, 'Rules hash')
  if (manifest.anchorTxid !== null) requireHex(manifest.anchorTxid, 64, 'Anchor transaction ID')
  if (await hashText(rulesPreimage(rules)) !== manifest.rulesHash) throw new Error('Round rules fingerprint does not match. The file was changed.')
  return { format: TESTNET_ROUND_FORMAT, rules, rulesHash: manifest.rulesHash, anchorTxid: manifest.anchorTxid as string | null }
}

export function chainMovePreimage(rulesHash: string, roundId: string, runnerTag: string, vaultId: VaultId, salt: string): string {
  requireHex(rulesHash, 64, 'Rules hash'); requireHex(roundId, 16, 'Round ID'); requireHex(runnerTag, 16, 'Runner tag'); requireHex(salt, 64, 'Move secret')
  if (!vaultCode[vaultId]) throw new Error('Unknown vault.')
  return JSON.stringify(['VEIL-VAULT-CHAIN-MOVE-v1', rulesHash, roundId, runnerTag, vaultId, salt])
}

export async function createTestnetMove(manifest: TestnetRoundManifest, vaultId: VaultId): Promise<TestnetMoveReceipt> {
  const checked = await validateManifest(manifest)
  const runnerTag = randomHex(8)
  const salt = randomHex(32)
  const commitment = await hashText(chainMovePreimage(checked.rulesHash, checked.rules.roundId, runnerTag, vaultId, salt))
  return { format: TESTNET_RECEIPT_FORMAT, rulesHash: checked.rulesHash, roundId: checked.rules.roundId, runnerTag, vaultId, salt, commitment }
}

export async function validateTestnetReceipt(value: unknown, manifest?: TestnetRoundManifest): Promise<TestnetMoveReceipt> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Private move receipt must be an object.')
  const receipt = value as Record<string, unknown>
  const expected = ['format', 'rulesHash', 'roundId', 'runnerTag', 'vaultId', 'salt', 'commitment']
  if (Object.keys(receipt).some((key) => !expected.includes(key)) || receipt.format !== TESTNET_RECEIPT_FORMAT) throw new Error('Not a Veil Vault private move receipt.')
  requireHex(receipt.rulesHash, 64, 'Rules hash'); requireHex(receipt.roundId, 16, 'Round ID'); requireHex(receipt.runnerTag, 16, 'Runner tag'); requireHex(receipt.salt, 64, 'Move secret'); requireHex(receipt.commitment, 64, 'Commitment')
  if (receipt.vaultId !== 'copper' && receipt.vaultId !== 'moon' && receipt.vaultId !== 'crown') throw new Error('Receipt has an invalid vault.')
  const computed = await hashText(chainMovePreimage(receipt.rulesHash, receipt.roundId, receipt.runnerTag, receipt.vaultId, receipt.salt))
  if (computed !== receipt.commitment) throw new Error('Private receipt no longer reproduces its commitment.')
  if (manifest) {
    const checked = await validateManifest(manifest)
    if (receipt.rulesHash !== checked.rulesHash || receipt.roundId !== checked.rules.roundId) throw new Error('Private receipt belongs to a different round.')
  }
  return receipt as unknown as TestnetMoveReceipt
}

export function encodeMemo(memo: VeilMemo): string {
  requireHex(memo.roundId, 16, 'Round ID'); requireHex(memo.rulesHash, 64, 'Rules hash')
  if (memo.kind === 'anchor') return `VV1A ${memo.roundId} ${memo.rulesHash}`
  if (memo.kind === 'commit') { requireHex(memo.commitment, 64, 'Commitment'); return `VV1C ${memo.roundId} ${memo.rulesHash} ${memo.commitment}` }
  requireHex(memo.runnerTag, 16, 'Runner tag'); requireHex(memo.salt, 64, 'Move secret')
  if (!vaultCode[memo.vaultId]) throw new Error('Unknown vault.')
  return `VV1R ${memo.roundId} ${memo.rulesHash} ${memo.runnerTag} ${vaultCode[memo.vaultId]} ${memo.salt}`
}

export function parseMemo(text: string): VeilMemo {
  if (text.trim() !== text) throw new Error('Memo cannot have leading or trailing whitespace.')
  const parts = text.split(' ')
  const [prefix, roundId, rulesHash] = parts
  requireHex(roundId, 16, 'Round ID'); requireHex(rulesHash, 64, 'Rules hash')
  if (prefix === 'VV1A' && parts.length === 3) return { kind: 'anchor', roundId, rulesHash }
  if (prefix === 'VV1C' && parts.length === 4) { requireHex(parts[3], 64, 'Commitment'); return { kind: 'commit', roundId, rulesHash, commitment: parts[3] } }
  if (prefix === 'VV1R' && parts.length === 6) { requireHex(parts[3], 16, 'Runner tag'); requireHex(parts[5], 64, 'Move secret'); const vaultId = codeVault[parts[4]]; if (!vaultId) throw new Error('Reveal memo has an unknown vault code.'); return { kind: 'reveal', roundId, rulesHash, runnerTag: parts[3], vaultId, salt: parts[5] } }
  throw new Error('Memo is not a supported Veil Vault protocol message.')
}

function base64Url(bytes: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = ''
  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index]
    const b = index + 1 < bytes.length ? bytes[index + 1] : 0
    const c = index + 2 < bytes.length ? bytes[index + 2] : 0
    result += alphabet[a >>> 2] + alphabet[((a & 3) << 4) | (b >>> 4)]
    if (index + 1 < bytes.length) result += alphabet[((b & 15) << 2) | (c >>> 6)]
    if (index + 2 < bytes.length) result += alphabet[c & 63]
  }
  return result
}

export function paymentRequest(address: string, memo: string, message: string): string {
  const checked = validateShieldedTestnetAddress(address)
  const memoBytes = new TextEncoder().encode(memo)
  if (memoBytes.length === 0 || memoBytes.length > 512 || memoBytes[0] >= 0xf5) throw new Error('Memo must be non-empty ZIP-302 UTF-8 within 512 bytes.')
  return `zcash:${checked.address}?amount=${FIXED_MOVE_ZEC}&memo=${base64Url(memoBytes)}&message=${encodeURIComponent(message).replace(/%20/g, '%20')}`
}

export function anchorRequest(manifest: TestnetRoundManifest): string { return paymentRequest(manifest.rules.address, encodeMemo({ kind: 'anchor', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash }), 'Veil Vault round anchor') }
export function commitmentRequest(manifest: TestnetRoundManifest, receipt: TestnetMoveReceipt): string { return paymentRequest(manifest.rules.address, encodeMemo({ kind: 'commit', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash, commitment: receipt.commitment }), 'Veil Vault sealed move') }
export function revealRequest(manifest: TestnetRoundManifest, receipt: TestnetMoveReceipt): string { return paymentRequest(manifest.rules.address, encodeMemo({ kind: 'reveal', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash, runnerTag: receipt.runnerTag, vaultId: receipt.vaultId, salt: receipt.salt }), 'Veil Vault move reveal') }
