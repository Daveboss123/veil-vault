import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { auditSuppliedRecords } from '../src/audit.ts'

// This is a fabricated demonstration file, not a record of a live transaction.
const samplePath = 'docs/examples/supplied-records-SAMPLE.json'

test('the public sample bundle stays internally consistent', async () => {
  const bundle = JSON.parse(await readFile(samplePath, 'utf8')) as Record<string, unknown>
  const result = await auditSuppliedRecords(bundle)
  assert.equal(result.acceptedCommitments, 4)
  assert.equal(result.acceptedReveals, 4)
  assert.equal(result.unopenedCommitments, 0)
  assert.equal(result.rejected.length, 0)
  assert.equal(result.outcome.winnerId, '00b14f39ac806af0')
  assert.equal(result.outcome.scores['00b14f39ac806af0'], 5)
  assert.equal(result.outcome.vaults.find((vault) => vault.vault.id === 'crown')?.status, 'alarm')
})

test('the checker rejects ambiguous or mislabelled sample records', async () => {
  const bundle = JSON.parse(await readFile(samplePath, 'utf8')) as Record<string, unknown>
  const wrongAnchor = structuredClone(bundle)
  ;(wrongAnchor.manifest as Record<string, unknown>).anchorTxid = '0'.repeat(64)
  await assert.rejects(auditSuppliedRecords(wrongAnchor), /Manifest anchor/)

  const duplicate = structuredClone(bundle)
  const records = duplicate.records as unknown[]
  records.push(structuredClone(records[0]))
  await assert.rejects(auditSuppliedRecords(duplicate), /duplicate transaction ID/)

  const aboveTip = structuredClone(bundle)
  ;(aboveTip.records as Record<string, unknown>[])[1].height = 126
  await assert.rejects(auditSuppliedRecords(aboveTip), /above its declared tip/)
})
