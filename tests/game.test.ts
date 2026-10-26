import assert from 'node:assert/strict'
import test from 'node:test'
import { chooseRivalVault, commitMove, declaredWinnerIsValid, movePreimage, resolveRound, verifyReveal } from '../src/game.ts'

const roundId = '0123456789abcdef'
const salt = '11'.repeat(32)

test('commitments are deterministic and valid reveals verify', async () => {
  const first = await commitMove(roundId, 'you', 'moon', salt)
  const second = await commitMove(roundId, 'you', 'moon', salt)
  assert.equal(first.commitment, second.commitment)
  assert.equal(await verifyReveal(roundId, first), true)
})

test('a changed vault or salt fails verification', async () => {
  const receipt = await commitMove(roundId, 'you', 'moon', salt)
  assert.equal(await verifyReveal(roundId, { ...receipt, vaultId: 'crown' }), false)
  assert.equal(await verifyReveal(roundId, { ...receipt, salt: '22'.repeat(32) }), false)
})

test('the highest lone claim wins while collisions score zero', () => {
  const outcome = resolveRound([
    { playerId: 'you', vaultId: 'moon' },
    { playerId: 'fox', vaultId: 'crown' },
    { playerId: 'moth', vaultId: 'crown' },
    { playerId: 'rook', vaultId: 'copper' },
  ])
  assert.deepEqual(outcome.scores, { you: 5, fox: 0, moth: 0, rook: 3 })
  assert.equal(outcome.winnerId, 'you')
  assert.equal(outcome.vaults.find((item) => item.vault.id === 'crown')?.status, 'alarm')
})

test('a round can end without a winner', () => {
  const outcome = resolveRound([
    { playerId: 'you', vaultId: 'moon' },
    { playerId: 'fox', vaultId: 'moon' },
    { playerId: 'moth', vaultId: 'crown' },
    { playerId: 'rook', vaultId: 'crown' },
  ])
  assert.equal(outcome.winnerId, null)
  assert.equal(Object.values(outcome.scores).every((score) => score === 0), true)
})

test('duplicate player reveals are rejected', () => {
  assert.throws(() => resolveRound([{ playerId: 'fox', vaultId: 'moon' }, { playerId: 'fox', vaultId: 'copper' }]), /only once/)
})

test('a forged winner is rejected', () => {
  const outcome = resolveRound([{ playerId: 'you', vaultId: 'copper' }, { playerId: 'fox', vaultId: 'moon' }])
  assert.equal(outcome.winnerId, 'fox')
  assert.equal(declaredWinnerIsValid(outcome, 'you'), false)
  assert.equal(declaredWinnerIsValid(outcome, 'fox'), true)
})

test('preimage validation rejects weak salts and malformed rounds', () => {
  assert.throws(() => movePreimage('bad', 'you', 'moon', salt), /Round ID/)
  assert.throws(() => movePreimage(roundId, 'you', 'moon', 'abcd'), /32 random bytes/)
})

test('rival tendencies match their dossier clues', () => {
  assert.equal(chooseRivalVault('fox', 0.9), 'crown')
  assert.equal(chooseRivalVault('fox', 0.3), 'moon')
  assert.equal(chooseRivalVault('moth', 0.2), 'copper')
  assert.equal(chooseRivalVault('moth', 0.7), 'moon')
  assert.equal(chooseRivalVault('rook', 0.5), 'moon')
  assert.equal(chooseRivalVault('rook', 0.9), 'crown')
  assert.throws(() => chooseRivalVault('fox', 1), /less than one/)
})
