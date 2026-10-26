export type VaultId = 'copper' | 'moon' | 'crown'

export interface Vault {
  id: VaultId
  name: string
  shortName: string
  value: number
  clue: string
}

export interface MoveReceipt {
  version: 1
  roundId: string
  playerId: string
  vaultId: VaultId
  salt: string
  commitment: string
}

export interface Reveal {
  playerId: string
  vaultId: VaultId
  salt: string
  commitment: string
}

export interface VaultOutcome {
  vault: Vault
  players: string[]
  status: 'empty' | 'claimed' | 'alarm'
}

export interface GameOutcome {
  vaults: VaultOutcome[]
  scores: Record<string, number>
  winnerId: string | null
}

export const VAULTS: Vault[] = [
  { id: 'copper', name: 'Copper Cache', shortName: 'Copper', value: 3, clue: 'Modest prize. Quiet corridor.' },
  { id: 'moon', name: 'Moon Archive', shortName: 'Moon', value: 5, clue: 'Worth the risk. Two entrances.' },
  { id: 'crown', name: 'Sun Crown', shortName: 'Crown', value: 8, clue: 'The great prize. Everyone sees it.' },
]

export type RivalId = 'fox' | 'moth' | 'rook'

export function chooseRivalVault(rivalId: RivalId, roll = Math.random()): VaultId {
  if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new Error('Rival roll must be at least zero and less than one.')
  if (rivalId === 'fox') return roll < 0.18 ? 'copper' : roll < 0.48 ? 'moon' : 'crown'
  if (rivalId === 'moth') return roll < 0.48 ? 'copper' : roll < 0.83 ? 'moon' : 'crown'
  return roll < 0.2 ? 'copper' : roll < 0.7 ? 'moon' : 'crown'
}

const validVaults = new Set<VaultId>(VAULTS.map((vault) => vault.id))

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function randomHex(bytes = 16): string {
  const value = new Uint8Array(bytes)
  crypto.getRandomValues(value)
  return bytesToHex(value)
}

export function movePreimage(roundId: string, playerId: string, vaultId: VaultId, salt: string): string {
  if (!/^[a-f0-9]{16}$/.test(roundId)) throw new Error('Round ID must be 16 lowercase hexadecimal characters.')
  if (!/^[a-z0-9-]{1,24}$/.test(playerId)) throw new Error('Player ID is invalid.')
  if (!validVaults.has(vaultId)) throw new Error('Vault is invalid.')
  if (!/^[a-f0-9]{64}$/.test(salt)) throw new Error('Salt must be 32 random bytes.')
  return JSON.stringify(['VEIL-VAULT-MOVE-v1', roundId, playerId, vaultId, salt])
}

export async function hashText(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return bytesToHex(new Uint8Array(digest))
}

export async function commitMove(roundId: string, playerId: string, vaultId: VaultId, salt = randomHex(32)): Promise<MoveReceipt> {
  const commitment = await hashText(movePreimage(roundId, playerId, vaultId, salt))
  return { version: 1, roundId, playerId, vaultId, salt, commitment }
}

export async function verifyReveal(roundId: string, reveal: Reveal): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(reveal.commitment)) return false
  try {
    return await hashText(movePreimage(roundId, reveal.playerId, reveal.vaultId, reveal.salt)) === reveal.commitment
  } catch {
    return false
  }
}

export function resolveRound(reveals: Pick<Reveal, 'playerId' | 'vaultId'>[]): GameOutcome {
  if (reveals.length < 2) throw new Error('At least two reveals are needed.')
  const playerIds = new Set<string>()
  for (const reveal of reveals) {
    if (playerIds.has(reveal.playerId)) throw new Error('A player can reveal only once.')
    if (!validVaults.has(reveal.vaultId)) throw new Error('Reveal contains an invalid vault.')
    playerIds.add(reveal.playerId)
  }

  const scores: Record<string, number> = Object.fromEntries(reveals.map((reveal) => [reveal.playerId, 0]))
  const vaults = VAULTS.map((vault): VaultOutcome => {
    const players = reveals.filter((reveal) => reveal.vaultId === vault.id).map((reveal) => reveal.playerId)
    const status = players.length === 0 ? 'empty' : players.length === 1 ? 'claimed' : 'alarm'
    if (status === 'claimed') scores[players[0]] = vault.value
    return { vault, players, status }
  })
  const highest = Math.max(...Object.values(scores))
  const winnerId = highest === 0 ? null : Object.entries(scores).find(([, score]) => score === highest)?.[0] ?? null
  return { vaults, scores, winnerId }
}

export function declaredWinnerIsValid(outcome: GameOutcome, declaredWinnerId: string | null): boolean {
  return outcome.winnerId === declaredWinnerId
}
