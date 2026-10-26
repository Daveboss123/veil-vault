import { VAULTS, hashText } from './game.ts'
import type { GameOutcome, VaultId } from './game.ts'
import { CONFIRMATION_BLOCKS, FIXED_MOVE_ZATOSHIS, chainMovePreimage, parseMemo, validateManifest } from './testnet.ts'
import type { TestnetRoundManifest } from './testnet.ts'

export const SUPPLIED_RECORDS_FORMAT = 'veil-vault-supplied-records-v1'

export interface ChainRecord {
  txid: string
  height: number
  recipient: string
  valueZatoshis: string
  shieldedSource: boolean
  memo: string
}

export interface SuppliedRecords {
  format: typeof SUPPLIED_RECORDS_FORMAT
  manifest: TestnetRoundManifest
  tipHeight: number
  complete: boolean
  records: ChainRecord[]
}

export interface RejectedRecord { txid: string; reason: string }

export interface AuditResult {
  source: 'supplied-records'
  rulesHash: string
  anchorTxid: string
  acceptedCommitments: number
  acceptedReveals: number
  unopenedCommitments: number
  rejected: RejectedRecord[]
  outcome: GameOutcome
}

function isHex(value: unknown, length: number): value is string {
  return typeof value === 'string' && new RegExp(`^[0-9a-f]{${length}}$`).test(value)
}

function validateRecord(value: unknown): ChainRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Chain record must be an object.')
  const record = value as Record<string, unknown>
  const expected = ['txid', 'height', 'recipient', 'valueZatoshis', 'shieldedSource', 'memo']
  if (Object.keys(record).some((key) => !expected.includes(key))) throw new Error('Chain record contains unsupported fields. Identity fields are not allowed.')
  if (!isHex(record.txid, 64) || typeof record.height !== 'number' || !Number.isSafeInteger(record.height) || record.height < 1 || typeof record.recipient !== 'string' || typeof record.valueZatoshis !== 'string' || typeof record.shieldedSource !== 'boolean' || typeof record.memo !== 'string') throw new Error('Chain record has invalid fields.')
  return record as unknown as ChainRecord
}

function outcomeFor(reveals: { playerId: string; vaultId: VaultId }[]): GameOutcome {
  const scores: Record<string, number> = Object.fromEntries(reveals.map((reveal) => [reveal.playerId, 0]))
  const vaults = VAULTS.map((vault) => {
    const players = reveals.filter((reveal) => reveal.vaultId === vault.id).map((reveal) => reveal.playerId)
    const status = players.length === 0 ? 'empty' as const : players.length === 1 ? 'claimed' as const : 'alarm' as const
    if (status === 'claimed') scores[players[0]] = vault.value
    return { vault, players, status }
  })
  const highest = Math.max(0, ...Object.values(scores))
  const winnerId = highest === 0 ? null : Object.entries(scores).find(([, score]) => score === highest)?.[0] ?? null
  return { vaults, scores, winnerId }
}

export async function auditSuppliedRecords(value: unknown, declaredWinner?: string | null): Promise<AuditResult> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Supplied record bundle must be an object.')
  const bundle = value as Record<string, unknown>
  if (Object.keys(bundle).some((key) => !['format', 'manifest', 'tipHeight', 'complete', 'records'].includes(key)) || bundle.format !== SUPPLIED_RECORDS_FORMAT || bundle.complete !== true || !Array.isArray(bundle.records) || typeof bundle.tipHeight !== 'number' || !Number.isSafeInteger(bundle.tipHeight)) throw new Error('Not a complete Veil Vault supplied-record bundle.')
  const manifest = await validateManifest(bundle.manifest)
  if (bundle.tipHeight < manifest.rules.revealDeadlineHeight + CONFIRMATION_BLOCKS) throw new Error('Bundle tip is too early for the final confirmation check.')
  const records = bundle.records.map(validateRecord).sort((left, right) => left.height - right.height || left.txid.localeCompare(right.txid))
  const rejected: RejectedRecord[] = []
  const anchors: ChainRecord[] = []
  const commits = new Map<string, ChainRecord>()
  const reveals: { record: ChainRecord; runnerTag: string; vaultId: VaultId; commitment: string }[] = []

  for (const record of records) {
    if (record.recipient !== manifest.rules.address || record.valueZatoshis !== FIXED_MOVE_ZATOSHIS || !record.shieldedSource) { rejected.push({ txid: record.txid, reason: 'Wrong recipient, value, or non-shielded source.' }); continue }
    let memo
    try { memo = parseMemo(record.memo) } catch { rejected.push({ txid: record.txid, reason: 'Malformed protocol memo.' }); continue }
    if (memo.roundId !== manifest.rules.roundId || memo.rulesHash !== manifest.rulesHash) { rejected.push({ txid: record.txid, reason: 'Different round or rules fingerprint.' }); continue }
    if (memo.kind === 'anchor') {
      if (record.height >= manifest.rules.startHeight) rejected.push({ txid: record.txid, reason: 'Anchor was not mined before the start height.' })
      else anchors.push(record)
    } else if (memo.kind === 'commit') {
      if (record.height < manifest.rules.startHeight || record.height > manifest.rules.commitDeadlineHeight) rejected.push({ txid: record.txid, reason: 'Commitment was outside the selection window.' })
      else if (!commits.has(memo.commitment)) commits.set(memo.commitment, record)
    } else {
      if (record.height <= manifest.rules.commitDeadlineHeight || record.height > manifest.rules.revealDeadlineHeight) { rejected.push({ txid: record.txid, reason: 'Reveal was outside the reveal window.' }); continue }
      const commitment = await hashText(chainMovePreimage(manifest.rulesHash, manifest.rules.roundId, memo.runnerTag, memo.vaultId, memo.salt))
      if (!commits.has(commitment)) rejected.push({ txid: record.txid, reason: 'Reveal has no matching on-time commitment.' })
      else reveals.push({ record, runnerTag: memo.runnerTag, vaultId: memo.vaultId, commitment })
    }
  }

  if (anchors.length === 0) throw new Error('No valid pre-start anchor was supplied.')
  if (commits.size > manifest.rules.playerLimit) throw new Error('Round has more distinct commitments than its player limit.')
  const byTag = new Map<string, { record: ChainRecord; runnerTag: string; vaultId: VaultId; commitment: string }>()
  const usedCommitments = new Set<string>()
  for (const reveal of reveals) {
    const existing = byTag.get(reveal.runnerTag)
    if (existing && existing.commitment !== reveal.commitment) throw new Error('One runner tag revealed multiple distinct commitments.')
    if (!existing && !usedCommitments.has(reveal.commitment)) { byTag.set(reveal.runnerTag, reveal); usedCommitments.add(reveal.commitment) }
  }
  const accepted = [...byTag.values()]
  const outcome = outcomeFor(accepted.map((reveal) => ({ playerId: reveal.runnerTag, vaultId: reveal.vaultId })))
  if (declaredWinner !== undefined && outcome.winnerId !== declaredWinner) throw new Error('Declared winner does not match the verified supplied records.')
  return { source: 'supplied-records', rulesHash: manifest.rulesHash, anchorTxid: anchors[0].txid, acceptedCommitments: commits.size, acceptedReveals: accepted.length, unopenedCommitments: commits.size - accepted.length, rejected, outcome }
}
