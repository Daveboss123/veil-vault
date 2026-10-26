import assert from 'node:assert/strict'
import test from 'node:test'
import { f4JumbleInverse, validateShieldedTestnetAddress } from '../src/zcashAddress.ts'
import { anchorRequest, chainMovePreimage, commitmentRequest, createTestnetMove, createTestnetRound, encodeMemo, parseMemo, revealRequest, rulesPreimage, validateManifest, validateTestnetReceipt } from '../src/testnet.ts'

const sapling = 'ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez'

function hexToBytes(hex: string): Uint8Array {
  return Uint8Array.from(hex.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16))
}

test('official testnet Sapling example is checksum validated', () => {
  assert.deepEqual(validateShieldedTestnetAddress(sapling), { address: sapling, kind: 'sapling', receiverTypes: ['sapling'] })
  assert.throws(() => validateShieldedTestnetAddress(`${sapling.slice(0, -1)}q`), /checksum/)
  assert.throws(() => validateShieldedTestnetAddress('tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU'), /shielded/)
})

test('F4Jumble inverse agrees with the official Rust example', () => {
  const jumbled = hexToBytes('861c51ee746b0313476967a3483e7e1ff77a2952a17d3ed9e0ab0f502e1179430322da9967b613545b1c36353046ca27')
  assert.equal(new TextDecoder().decode(f4JumbleInverse(jumbled)), 'The package from Alice arrives tomorrow morning.')
})

test('round rules are hashed and tampering is rejected', async () => {
  const manifest = await createTestnetRound({ roundId: '0123456789abcdef', address: sapling, title: 'Night 19', startHeight: 100, commitDeadlineHeight: 110, revealDeadlineHeight: 120 })
  assert.equal(manifest.rulesHash.length, 64)
  assert.match(rulesPreimage(manifest.rules), /VEIL-VAULT-RULES-v1/)
  assert.deepEqual(await validateManifest(manifest), manifest)
  await assert.rejects(validateManifest({ ...manifest, rules: { ...manifest.rules, title: 'Changed' } }), /fingerprint/)
})

test('private testnet receipt reproduces its commitment', async () => {
  const manifest = await createTestnetRound({ roundId: '0123456789abcdef', address: sapling, title: 'Night 19', startHeight: 100, commitDeadlineHeight: 110, revealDeadlineHeight: 120 })
  const receipt = await createTestnetMove(manifest, 'moon')
  assert.equal(receipt.runnerTag.length, 16)
  assert.equal(receipt.salt.length, 64)
  assert.equal(receipt.commitment.length, 64)
  assert.match(chainMovePreimage(receipt.rulesHash, receipt.roundId, receipt.runnerTag, receipt.vaultId, receipt.salt), /VEIL-VAULT-CHAIN-MOVE-v1/)
  assert.deepEqual(await validateTestnetReceipt(receipt, manifest), receipt)
  await assert.rejects(validateTestnetReceipt({ ...receipt, vaultId: 'crown' }, manifest), /no longer reproduces/)
})

test('protocol memos round-trip and reject extra text', () => {
  const rulesHash = '22'.repeat(32)
  const commitment = '33'.repeat(32)
  const anchor = encodeMemo({ kind: 'anchor', roundId: '0123456789abcdef', rulesHash })
  const commit = encodeMemo({ kind: 'commit', roundId: '0123456789abcdef', rulesHash, commitment })
  const reveal = encodeMemo({ kind: 'reveal', roundId: '0123456789abcdef', rulesHash, runnerTag: '44'.repeat(8), vaultId: 'crown', salt: '55'.repeat(32) })
  assert.deepEqual(parseMemo(anchor), { kind: 'anchor', roundId: '0123456789abcdef', rulesHash })
  assert.deepEqual(parseMemo(commit), { kind: 'commit', roundId: '0123456789abcdef', rulesHash, commitment })
  assert.equal(parseMemo(reveal).kind, 'reveal')
  assert.throws(() => parseMemo(`${commit} extra`), /supported/)
})

test('ZIP-321 requests use fixed testnet amount and unpadded base64url memos', async () => {
  const manifest = await createTestnetRound({ roundId: '0123456789abcdef', address: sapling, title: 'Night 19', startHeight: 100, commitDeadlineHeight: 110, revealDeadlineHeight: 120 })
  const receipt = await createTestnetMove(manifest, 'copper')
  for (const uri of [anchorRequest(manifest), commitmentRequest(manifest, receipt), revealRequest(manifest, receipt)]) {
    assert.match(uri, new RegExp(`^zcash:${sapling}\\?amount=0\\.001&memo=[A-Za-z0-9_-]+&message=`))
    const memo = uri.match(/[?&]memo=([^&]+)/)?.[1] ?? ''
    assert.equal(memo.includes('='), false)
    assert.equal(memo.includes('+'), false)
    assert.equal(memo.includes('/'), false)
  }
})
