import { mkdir, writeFile } from 'node:fs/promises'
import { hashText } from '../src/game.ts'
import type { VaultId } from '../src/game.ts'
import { SUPPLIED_RECORDS_FORMAT } from '../src/audit.ts'
import {
  FIXED_MOVE_ZATOSHIS,
  chainMovePreimage,
  createTestnetRound,
  encodeMemo,
} from '../src/testnet.ts'
import type { ChainRecord } from '../src/audit.ts'

const SAMPLE_ADDRESS = 'ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez'
const SAMPLE_ROUND_ID = '5a17c0de20260001'
const SAMPLE_TIP_HEIGHT = 125

const manifest = await createTestnetRound({
  roundId: SAMPLE_ROUND_ID,
  address: SAMPLE_ADDRESS,
  title: 'Sample: The Lantern Vigil',
  startHeight: 100,
  commitDeadlineHeight: 110,
  revealDeadlineHeight: 120,
})

const vaults: VaultId[] = ['crown', 'crown', 'moon', 'copper']
const moves = await Promise.all(vaults.map(async (vaultId, index) => {
  const runnerTag = (await hashText(`veil-vault-sample-tag-${index + 1}`)).slice(0, 16)
  const salt = await hashText(`veil-vault-sample-salt-${index + 1}`)
  const commitment = await hashText(chainMovePreimage(manifest.rulesHash, manifest.rules.roundId, runnerTag, vaultId, salt))
  return { runnerTag, vaultId, salt, commitment }
}))

async function record(label: string, height: number, memo: string): Promise<ChainRecord> {
  return {
    txid: await hashText(`veil-vault-sample-tx-${label}`),
    height,
    recipient: SAMPLE_ADDRESS,
    valueZatoshis: FIXED_MOVE_ZATOSHIS,
    shieldedSource: true,
    memo,
  }
}

const anchor = await record('anchor', 99, encodeMemo({
  kind: 'anchor',
  roundId: manifest.rules.roundId,
  rulesHash: manifest.rulesHash,
}))
const commits = await Promise.all(moves.map((move, index) => record(`commit-${index + 1}`, 101 + index, encodeMemo({
  kind: 'commit',
  roundId: manifest.rules.roundId,
  rulesHash: manifest.rulesHash,
  commitment: move.commitment,
}))))
const reveals = await Promise.all(moves.map((move, index) => record(`reveal-${index + 1}`, 112 + index, encodeMemo({
  kind: 'reveal',
  roundId: manifest.rules.roundId,
  rulesHash: manifest.rulesHash,
  runnerTag: move.runnerTag,
  vaultId: move.vaultId,
  salt: move.salt,
}))))

const bundle = {
  format: SUPPLIED_RECORDS_FORMAT,
  manifest: { ...manifest, anchorTxid: anchor.txid },
  tipHeight: SAMPLE_TIP_HEIGHT,
  complete: true,
  records: [anchor, ...commits, ...reveals],
}

await mkdir('docs/examples', { recursive: true })
await writeFile('docs/examples/supplied-records-SAMPLE.json', `${JSON.stringify(bundle, null, 2)}\n`)
console.log('Wrote docs/examples/supplied-records-SAMPLE.json')
console.log(`Expected winner tag: ${moves[2].runnerTag}`)
