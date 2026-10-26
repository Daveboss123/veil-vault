import assert from 'node:assert/strict'
import test from 'node:test'
import { SUPPLIED_RECORDS_FORMAT, auditSuppliedRecords } from '../src/audit.ts'
import { hashText } from '../src/game.ts'
import { FIXED_MOVE_ZATOSHIS, createTestnetMove, createTestnetRound, encodeMemo } from '../src/testnet.ts'

const address = 'ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez'

test('supplied records resolve lone vaults and collisions', async () => {
  const manifest = await createTestnetRound({ roundId: '0123456789abcdef', address, title: 'Audit test', startHeight: 100, commitDeadlineHeight: 110, revealDeadlineHeight: 120 })
  const moves = await Promise.all(['moon', 'crown', 'crown'].map((vault) => createTestnetMove(manifest, vault as 'moon' | 'crown')))
  let serial = 0
  const record = async (height: number, memo: string) => ({ txid: await hashText(`record-${serial++}`), height, recipient: address, valueZatoshis: FIXED_MOVE_ZATOSHIS, shieldedSource: true, memo })
  const records = [
    await record(99, encodeMemo({ kind: 'anchor', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash })),
    ...await Promise.all(moves.map((move, index) => record(100 + index, encodeMemo({ kind: 'commit', roundId: move.roundId, rulesHash: move.rulesHash, commitment: move.commitment })))),
    ...await Promise.all(moves.map((move, index) => record(111 + index, encodeMemo({ kind: 'reveal', roundId: move.roundId, rulesHash: move.rulesHash, runnerTag: move.runnerTag, vaultId: move.vaultId, salt: move.salt })))),
  ]
  const bundle = { format: SUPPLIED_RECORDS_FORMAT, manifest, tipHeight: 125, complete: true, records }
  const result = await auditSuppliedRecords(bundle)
  assert.equal(result.acceptedCommitments, 3)
  assert.equal(result.acceptedReveals, 3)
  assert.equal(result.outcome.winnerId, moves[0].runnerTag)
  assert.equal(result.outcome.scores[moves[0].runnerTag], 5)
  await assert.rejects(auditSuppliedRecords(bundle, moves[1].runnerTag), /Declared winner/)
})

test('supplied records reject incomplete, early, and wrong-source bundles', async () => {
  const manifest = await createTestnetRound({ roundId: '0123456789abcdef', address, title: 'Audit test', startHeight: 100, commitDeadlineHeight: 110, revealDeadlineHeight: 120 })
  await assert.rejects(auditSuppliedRecords({ format: SUPPLIED_RECORDS_FORMAT, manifest, tipHeight: 125, complete: false, records: [] }), /complete/)
  await assert.rejects(auditSuppliedRecords({ format: SUPPLIED_RECORDS_FORMAT, manifest, tipHeight: 121, complete: true, records: [] }), /too early/)
})
