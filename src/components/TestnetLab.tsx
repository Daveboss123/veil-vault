import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { auditSuppliedRecords } from '../audit.ts'
import type { AuditResult } from '../audit.ts'
import { downloadJson } from '../download.ts'
import { VAULTS } from '../game.ts'
import type { VaultId } from '../game.ts'
import { anchorRequest, commitmentRequest, createTestnetMove, createTestnetRound, encodeMemo, revealRequest, validateManifest, validateTestnetReceipt } from '../testnet.ts'
import type { TestnetMoveReceipt, TestnetRoundManifest } from '../testnet.ts'
import { Ornament } from './Ornament.tsx'
import { QrCode } from './QrCode.tsx'
import { VaultEmblem } from './VaultEmblem.tsx'
import '../testnet.css'

async function readJsonFile(event: ChangeEvent<HTMLInputElement>): Promise<unknown> {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file || file.size > 100_000) throw new Error('Choose a JSON file smaller than 100 KB.')
  return JSON.parse(await file.text()) as unknown
}

function copyText(value: string): void {
  void navigator.clipboard?.writeText(value)
}

export function TestnetLab({ onPlay }: { onPlay: () => void }) {
  const [mode, setMode] = useState<'intro' | 'organizer' | 'runner'>('intro')
  const [manifest, setManifest] = useState<TestnetRoundManifest | null>(null)
  const [receipt, setReceipt] = useState<TestnetMoveReceipt | null>(null)
  const [receiptSaved, setReceiptSaved] = useState(false)
  const [vault, setVault] = useState<VaultId>('moon')
  const [height, setHeight] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [auditError, setAuditError] = useState('')

  function clearMessages() { setStatus(''); setError('') }

  async function makeRound(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); clearMessages()
    const data = new FormData(event.currentTarget)
    try {
      const next = await createTestnetRound({ address: String(data.get('address') ?? ''), title: String(data.get('title') ?? ''), startHeight: Number(data.get('startHeight')), commitDeadlineHeight: Number(data.get('commitDeadlineHeight')), revealDeadlineHeight: Number(data.get('revealDeadlineHeight')) })
      setManifest(next); setReceipt(null); setReceiptSaved(false); setStatus('Round file created in memory. Download it before sending the anchor.')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not create the round.') }
  }

  async function importRound(event: ChangeEvent<HTMLInputElement>) {
    clearMessages()
    try {
      const next = await validateManifest(await readJsonFile(event))
      setManifest(next); setReceipt(null); setReceiptSaved(false); setStatus('Round file checked. Choose one vault and seal your move.')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not read the round file.') }
  }

  async function sealMove() {
    if (!manifest) return
    clearMessages()
    try { const next = await createTestnetMove(manifest, vault); setReceipt(next); setReceiptSaved(false); setStatus('Move sealed in memory. Save the private receipt before opening the wallet request.') }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not seal this move.') }
  }

  async function importReceipt(event: ChangeEvent<HTMLInputElement>) {
    clearMessages()
    try {
      if (!manifest) throw new Error('Import the public round file first.')
      const next = await validateTestnetReceipt(await readJsonFile(event), manifest)
      setReceipt(next); setReceiptSaved(true); setVault(next.vaultId); setStatus('Private receipt checked. Keep it private; it contains your move and random secret.')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not read the private receipt.') }
  }

  async function importAudit(event: ChangeEvent<HTMLInputElement>) {
    setAudit(null); setAuditError('')
    try { setAudit(await auditSuppliedRecords(await readJsonFile(event))) }
    catch (caught) { setAuditError(caught instanceof Error ? caught.message : 'Could not check these supplied records.') }
  }

  function saveRound() {
    if (!manifest) return
    downloadJson(`veil-vault-round-${manifest.rules.roundId}.json`, manifest)
    setStatus('Public round file download started. Share this file, not a private move receipt.')
  }

  function saveReceipt() {
    if (!receipt) return
    downloadJson(`PRIVATE-veil-vault-move-${receipt.roundId}-${receipt.runnerTag}.json`, receipt)
    setReceiptSaved(true); setStatus('Private receipt download started. Anyone with this file can read and reveal your move.')
  }

  const numericHeight = Number(height)
  const revealOpen = Boolean(manifest && receipt && Number.isSafeInteger(numericHeight) && numericHeight > manifest.rules.commitDeadlineHeight && numericHeight <= manifest.rules.revealDeadlineHeight)
  const commitUri = manifest && receipt && receiptSaved ? commitmentRequest(manifest, receipt) : null
  const revealUri = manifest && receipt && revealOpen ? revealRequest(manifest, receipt) : null

  return <main className="testnet-page" id="main-content" tabIndex={-1}>
    <section className="testnet-masthead"><Ornament name="route" /><div><span>JUDGE APPENDIX / EXPERIMENTAL TESTNET LAB</span><h1>Carry a sealed move<br />through Zcash.</h1><p>The site prepares shielded testnet payment requests. Your wallet reviews, signs and sends them. Veil Vault never receives wallet keys or relays a transaction.</p><button className="testnet-game-link" onClick={onPlay}>This is the testnet machinery, not the game. Play practice <span>→</span></button></div></section>
    <div className="testnet-warning"><strong>TESTNET ONLY</strong><span>Use testnet TAZ only. Never send mainnet ZEC, and never paste a recovery phrase, spending key, full viewing key or mainnet address here.</span></div>

    {mode === 'intro' && <section className="lab-choice"><div className="lab-heading"><span>CHOOSE A ROLE</span><h2>Who are you tonight?</h2><p>An organizer creates the public round and anchor request. A runner imports that file, seals one move, and later reveals it.</p></div><div className="lab-choice-grid"><button onClick={() => setMode('organizer')}><Ornament name="bell" /><span>ORGANIZER</span><h3>Open a chamber</h3><p>Set a shielded testnet address and block-height windows, then download the round file.</p><b>Prepare round →</b></button><button onClick={() => setMode('runner')}><Ornament name="moth" /><span>RUNNER</span><h3>Carry a move</h3><p>Import a public round file, choose a vault, save your receipt, and scan wallet requests.</p><b>Join round →</b></button></div></section>}

    {mode !== 'intro' && <div className="lab-layout">
      <aside className="lab-sidebar"><button onClick={() => { setMode('intro'); clearMessages() }}>← Change role</button><span>{mode === 'organizer' ? 'ORGANIZER FLOW' : 'RUNNER FLOW'}</span><ol>{mode === 'organizer' ? <><li className="active">Set round</li><li>Save public file</li><li>Send anchor</li></> : <><li className={!manifest ? 'active' : ''}>Import round</li><li className={manifest && !receipt ? 'active' : ''}>Seal move</li><li className={receipt ? 'active' : ''}>Pay & reveal</li></>}</ol><p>Everything stays in memory until you explicitly download a file or copy a wallet request.</p></aside>
      <section className="lab-workspace">
        {mode === 'organizer' && <>
          <div className="lab-section-title"><span>01 / ROUND RULES</span><h2>Fix the chamber before anyone moves.</h2><p>The address must be shielded testnet Sapling or a checksum-valid Unified Address containing only supported shielded receivers.</p></div>
          <form className="round-form" onSubmit={makeRound}>
            <label className="wide">Dedicated shielded testnet address<input name="address" required spellCheck="false" autoComplete="off" placeholder="ztestsapling1…, utest1… or zutest1…" /></label>
            <label className="wide">Round title<input name="title" required maxLength={64} defaultValue="Night 19: The Three Relics" /></label>
            <label>Start height<input name="startHeight" required inputMode="numeric" pattern="[0-9]+" /></label>
            <label>Commit deadline<input name="commitDeadlineHeight" required inputMode="numeric" pattern="[0-9]+" /></label>
            <label>Reveal deadline<input name="revealDeadlineHeight" required inputMode="numeric" pattern="[0-9]+" /></label>
            <button className="button button-acid" type="submit">Create public round <span>→</span></button>
          </form>
          {manifest && <div className="round-output">
            <div className="output-summary"><span>ROUND READY IN MEMORY</span><h3>{manifest.rules.title}</h3><dl><div><dt>Round</dt><dd>{manifest.rules.roundId}</dd></div><div><dt>Rules fingerprint</dt><dd>{manifest.rulesHash}</dd></div><div><dt>Selection</dt><dd>{manifest.rules.startHeight}–{manifest.rules.commitDeadlineHeight}</dd></div><div><dt>Reveal</dt><dd>{manifest.rules.commitDeadlineHeight + 1}–{manifest.rules.revealDeadlineHeight}</dd></div></dl><button className="button button-ghost" onClick={saveRound}>Download public round file</button></div>
            <div className="request-card"><QrCode value={anchorRequest(manifest)} label="Round anchor · 0.001 TAZ" /><button onClick={() => copyText(anchorRequest(manifest))}>Copy wallet request</button><details><summary>Technical memo</summary><code>{encodeMemo({ kind: 'anchor', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash })}</code></details><p>Send before the start height. The transaction fee is separate. This browser does not know whether the wallet sent or mined it.</p></div>
          </div>}
        </>}

        {mode === 'runner' && <>
          <div className="lab-section-title"><span>01 / PUBLIC ROUND</span><h2>Check the rules you were given.</h2><p>Import only the public round JSON. Never choose a recovery phrase, wallet database, viewing key or unrelated private file.</p></div>
          <label className="file-key">Import public round file<input type="file" accept="application/json,.json" onChange={importRound} /></label>
          {manifest && <div className="imported-round"><span>ROUND CHECKED</span><h3>{manifest.rules.title}</h3><p>Selection through block {manifest.rules.commitDeadlineHeight}. Reveal through block {manifest.rules.revealDeadlineHeight}. Fixed protocol payment: 0.001 TAZ plus wallet fee.</p><code>{manifest.rulesHash}</code></div>}
          {manifest && <div className="runner-seal"><div className="lab-section-title"><span>02 / PRIVATE CHOICE</span><h2>Choose once, then save the key.</h2></div><div className="lab-vaults">{VAULTS.map((item) => <button type="button" className={vault === item.id ? 'selected' : ''} onClick={() => setVault(item.id)} aria-pressed={vault === item.id} key={item.id}><VaultEmblem id={item.id} /><strong>{item.name}</strong><span>{item.value} relics</span></button>)}</div><button className="button button-acid" onClick={sealMove}>Seal this testnet move <span>→</span></button></div>}
          {receipt && <div className="private-receipt"><span>PRIVATE RECEIPT IN MEMORY</span><h3>{VAULTS.find((item) => item.id === receipt.vaultId)?.name}</h3><p>This file contains the vault and random secret. Save it before paying. Do not publish or send it to the organizer.</p><button className="button button-ghost" onClick={saveReceipt}>{receiptSaved ? 'Download receipt again' : 'Save private receipt'}</button></div>}
          {commitUri && <div className="request-stage"><div className="lab-section-title"><span>03 / SHIELDED COMMITMENT</span><h2>Ask your wallet to carry the sealed move.</h2><p>Confirm the destination, fixed 0.001 TAZ amount and memo in your wallet. Use a shielded source. Veil Vault never sees the signed transaction.</p></div><div className="request-card"><QrCode value={commitUri} label="Sealed move · 0.001 TAZ" /><button onClick={() => copyText(commitUri)}>Copy wallet request</button><details><summary>Technical memo</summary><code>{encodeMemo({ kind: 'commit', roundId: manifest!.rules.roundId, rulesHash: manifest!.rulesHash, commitment: receipt!.commitment })}</code></details></div></div>}
          {manifest && <div className="reveal-stage"><div className="lab-section-title"><span>04 / RETURN AFTER SELECTION</span><h2>Reveal only when the window opens.</h2><p>Import the saved private receipt if this page was refreshed. The height entered here is guidance only; mined block heights decide validity.</p></div><label className="file-key private-file">Import private receipt<input type="file" accept="application/json,.json" onChange={importReceipt} /></label><label className="height-field">Current testnet height<input value={height} onChange={(event) => setHeight(event.target.value)} inputMode="numeric" placeholder={`${manifest.rules.commitDeadlineHeight + 1}–${manifest.rules.revealDeadlineHeight}`} /></label>{height && !revealOpen && <p className="window-note">Reveal request locked. Enter a whole height after {manifest.rules.commitDeadlineHeight} and no later than {manifest.rules.revealDeadlineHeight}.</p>}{revealUri && <div className="request-card reveal-card"><QrCode value={revealUri} label="Move reveal · 0.001 TAZ" /><button onClick={() => copyText(revealUri)}>Copy reveal request</button><details><summary>Technical memo</summary><code>{encodeMemo({ kind: 'reveal', roundId: manifest.rules.roundId, rulesHash: manifest.rulesHash, runnerTag: receipt!.runnerTag, vaultId: receipt!.vaultId, salt: receipt!.salt })}</code></details><p>Revealing intentionally discloses the one-round tag, chosen vault and random secret to the round recipient.</p></div>}</div>}
        </>}
        {(status || error) && <div className={`lab-message ${error ? 'error' : ''}`} role="status">{error || status}</div>}
      </section>
    </div>}

    <section className="audit-lab">
      <div className="audit-lab-copy"><span>SUPPLIED-RECORD CHECKER</span><h2>Recompute the chamber.</h2><p>Import a complete public record bundle to check its anchor, windows, fixed payments, commitments, reveals, collisions and winner. This checks the file you supply; it cannot prove the file includes everything on chain.</p><label className="file-key">Import supplied records<input type="file" accept="application/json,.json" onChange={importAudit} /></label>{auditError && <p className="audit-error" role="alert">{auditError}</p>}</div>
      <div className="audit-result">
        {audit ? <><span>SUPPLIED RECORDS PASSED FILE CHECKS</span><h3>{audit.outcome.winnerId ? `Runner ${audit.outcome.winnerId.slice(0, 8)}… wins.` : 'No runner wins.'}</h3><dl><div><dt>Commitments</dt><dd>{audit.acceptedCommitments}</dd></div><div><dt>Reveals</dt><dd>{audit.acceptedReveals}</dd></div><div><dt>Unopened</dt><dd>{audit.unopenedCommitments}</dd></div><div><dt>Rejected records</dt><dd>{audit.rejected.length}</dd></div></dl><p>Source: supplied JSON, not independent chain retrieval. A consistent file can still omit chain activity.</p></> : <><Ornament name="seal" /><span>NO RECORD FILE LOADED</span><p>The result will appear here without uploading the file or sending it anywhere.</p></>}
      </div>
    </section>

    <section className="testnet-boundaries"><span>WHAT THIS LAB DOES NOT DO</span><div><p>It does not sign, broadcast, monitor, scan or confirm a transaction.</p><p>It does not prove membership, stop multiple entries, prevent collusion or guarantee network anonymity.</p><p>A QR code is a wallet request, not evidence that anything reached the chain.</p></div></section>
  </main>
}
