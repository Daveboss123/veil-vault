import { useEffect, useState } from 'react'
import { chooseRivalVault, commitMove, declaredWinnerIsValid, randomHex, resolveRound, VAULTS, verifyReveal } from './game.ts'
import type { GameOutcome, MoveReceipt, Vault, VaultId } from './game.ts'
import { Ornament } from './components/Ornament.tsx'
import { TestnetLab } from './components/TestnetLab.tsx'
import { playGameSound, setAmbientMusic } from './sound.ts'
import './App.css'

type Screen = 'home' | 'game' | 'guide' | 'fairness' | 'testnet'
type Phase = 'briefing' | 'choose' | 'sealed' | 'result'

interface Runner {
  id: string
  name: string
  mark: string
  receipt: MoveReceipt
}

const rivals = [
  { id: 'fox', name: 'Fox', mark: 'F', tell: 'Treats the richest door like a personal dare.' },
  { id: 'moth', name: 'Moth', mark: 'M', tell: 'Looks for value in whatever the crowd neglects.' },
  { id: 'rook', name: 'Rook', mark: 'R', tell: 'Trusts the corridors and alarms he remembers.' },
] as const

const playerNames: Record<string, string> = { you: 'You', fox: 'Fox', moth: 'Moth', rook: 'Rook' }

const runnerLore = [
  { id: 'you', name: 'The Unnamed', title: 'A mask without a ledger', text: 'New to the chamber. No known route, no old tells, and nothing to lose but a name.' },
  { id: 'fox', name: 'Fox', title: 'Courier of the lower roofs', text: 'Fast, theatrical, and fond of making the obvious door feel too obvious.' },
  { id: 'moth', name: 'Moth', title: 'Keeper of erased histories', text: 'Studies what crowds ignore. The smallest light is often enough to change her path.' },
  { id: 'rook', name: 'Rook', title: 'The Bell Court’s exile', text: 'Built half the city’s alarms before vanishing into the streets beneath them.' },
]

const runnerArt: Record<string, string> = {
  you: '/art/characters/the-unnamed.webp',
  fox: '/art/characters/fox.webp',
  moth: '/art/characters/moth.webp',
  rook: '/art/characters/rook.webp',
}

function Mark({ id, children }: { id: string; children?: string }) {
  const label = children ?? playerNames[id]?.slice(0, 1)
  return <span className={`runner-mark mark-${id}`} aria-hidden="true" title={label}>
    <svg viewBox="0 0 32 32" focusable="false">
      {id === 'fox' && <><path d="M5 6l8 4h6l8-4-3 11c0 7-4 10-8 10S8 24 8 17L5 6z" /><path className="glyph-cut" d="M11 17l5 4 5-4-2 7h-6z" /></>}
      {id === 'moth' && <><path d="M15 9C9 3 3 8 5 16c1 5 6 7 10 5V9zm2 0c6-6 12-1 10 7-1 5-6 7-10 5V9z" /><path d="M14 8h4v17h-4zM14 8L9 3m9 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" /></>}
      {id === 'rook' && <><path d="M7 9h14l6 6-6 3v8H9V15L7 9z" /><path className="glyph-cut" d="M20 14h6l-5 3z" /></>}
      {id === 'you' && <><path d="M5 25c1-10 4-19 11-19s10 9 11 19H5z" /><path className="glyph-cut" d="M10 15c1-4 3-6 6-6s5 2 6 6l-6 6-6-6z" /></>}
    </svg>
  </span>
}

function RunnerPortrait({ id }: { id: string }) {
  const name = runnerLore.find((runner) => runner.id === id)?.name ?? 'Masked runner'
  return <img className={`runner-portrait portrait-${id}`} src={runnerArt[id]} alt={`${name}, a masked Night Runner`} width="900" height="1125" decoding="async" />
}

function RunnerThumb({ id }: { id: string }) {
  const name = runnerLore.find((runner) => runner.id === id)?.name ?? playerNames[id] ?? 'Runner'
  return <span className={`runner-thumb thumb-${id}`}><img src={runnerArt[id]} alt="" width="900" height="1125" /><span>{name}</span></span>
}

function Logo() {
  return <span className="logo"><span className="logo-door"><i /></span><span>VEIL VAULT</span></span>
}

function VaultDoor({ vault, small = false }: { vault: Vault; small?: boolean }) {
  return <div className={`vault-door vault-${vault.id} ${small ? 'vault-small' : ''}`} aria-hidden="true">
    <span className="door-rays" /><span className="door-number">{vault.value}</span><span className="door-key" />
  </div>
}

function Header({ screen, onHome, onPlay, onGuide, onFairness, onTestnet, soundOn, onSoundToggle }: { screen: Screen; onHome: () => void; onPlay: () => void; onGuide: () => void; onFairness: () => void; onTestnet: () => void; soundOn: boolean; onSoundToggle: () => void }) {
  return <header className="site-header">
    <button className="brand-button" onClick={onHome} aria-label="Veil Vault home"><Logo /></button>
    {screen === 'game' ? <><button className="sound-toggle sound-toggle-game" onClick={onSoundToggle} aria-pressed={soundOn} aria-label={`Turn audio ${soundOn ? 'off' : 'on'}`}><span>{soundOn ? '◖))' : '◖×'}</span>{soundOn ? 'Audio on' : 'Audio off'}</button><div className="practice-label"><span />Practice simulation</div><button className="button button-ghost button-small" onClick={onHome}>Exit round</button></>
      : <><nav aria-label="Main navigation"><button className={screen === 'guide' ? 'nav-current' : ''} onClick={onGuide}>How to play</button><button className={screen === 'fairness' ? 'nav-current' : ''} onClick={onFairness}>Fair play</button><button className={screen === 'testnet' ? 'nav-current' : ''} onClick={onTestnet}>Testnet lab</button>{screen === 'home' && <a href="#lore">Lore</a>}</nav><button className="sound-toggle" onClick={onSoundToggle} aria-pressed={soundOn} aria-label={`Turn audio ${soundOn ? 'off' : 'on'}`}><span>{soundOn ? '◖))' : '◖×'}</span>{soundOn ? 'Audio on' : 'Audio off'}</button><button className="button button-light button-small" onClick={onPlay}>Play practice</button></>}
  </header>
}

function Home({ onPlay, onGuide }: { onPlay: () => void; onGuide: () => void }) {
  return <main>
    <aside className="new-runner-callout" aria-label="New player guide">
      <div><Ornament name="seal" /><span>FIRST NIGHT IN VEYR?</span></div><p>The chamber makes more sense when you know what wakes an alarm. Read the two-minute field guide before you choose a door.</p><button onClick={onGuide}>Open the field guide <span>→</span></button>
    </aside>
    <section className="hero-section">
      <div className="hero-copy">
        <Ornament name="key" className="hero-ornament" />
        <div className="eyebrow"><span>01</span> A SHIELDED BLUFFING GAME</div>
        <h1>Choose a vault.<br /><em>Leave no trail.</em></h1>
        <p className="hero-lede">Four runners. Three vaults. Enter alone and the relic is yours. Choose the same door as a rival and the alarm takes everything.</p>
        <div className="hero-actions"><button className="button button-acid" onClick={onPlay}>Enter the practice vault <span>↗</span></button><a className="text-link" href="#rules">Learn the rules <span>↓</span></a></div>
        <p className="safe-note"><span>✓</span> No wallet, account or payment needed for practice.</p>
      </div>
      <div className="hero-scene" aria-label="Three illustrated vaults worth three, five and eight relics">
        <div className="moon-orbit"><span /></div>
        <div className="scene-label label-top">THE CHAMBER / 00:47</div>
        <div className="scene-vaults">{VAULTS.map((vault) => <div className="scene-vault" key={vault.id}><VaultDoor vault={vault} /><span>{vault.shortName}</span></div>)}</div>
        <div className="runner-trail"><Mark id="fox">F</Mark><i /><Mark id="moth">M</Mark><i /><Mark id="rook">R</Mark></div>
        <div className="scene-label label-bottom">MOVES HIDDEN UNTIL THE VEIL LIFTS</div>
      </div>
    </section>

    <section className="proof-strip" aria-label="Game summary">
      <div><strong>4</strong><span>runners</span></div><i /><div><strong>3</strong><span>vaults</span></div><i /><div><strong>1</strong><span>secret choice</span></div><i /><div className="proof-private"><strong>?</strong><span>nothing revealed early</span></div>
    </section>

    <section className="lore-section" id="lore">
      <Ornament name="bell" className="lore-ornament lore-bell" />
      <Ornament name="moth" className="lore-ornament lore-moth" />
      <div className="lore-opening">
        <span className="eyebrow eyebrow-dark"><b>THE RECORD OF VEYR / FRAGMENT 09</b></span>
        <h2>The city remembers<br />every footstep.</h2>
        <div className="lore-copy"><p>Above the river, the Bell Court writes every purchase, passage, and promise into ledgers anyone can inspect. Privacy became evidence of guilt. A closed door became a confession.</p><p>Then the Night Runners found the Veil: bind a choice without naming it. Commit before the final bell. Reveal only when no one can change course.</p></div>
      </div>
      <div className="city-map" aria-label="Map of Veyr and its three vault districts">
        <span className="map-caption map-caption-top">CITY OF VEYR / CURFEW MAP</span><span className="map-caption map-caption-bottom">THE BELL COURT SEES ROUTES, NOT INTENT</span>
        <div className="map-river" /><div className="map-ring ring-one" /><div className="map-ring ring-two" />
        <div className="map-vault map-copper"><i>3</i><span>OLD MINT</span></div><div className="map-vault map-moon"><i>5</i><span>ARCHIVE</span></div><div className="map-vault map-crown"><i>8</i><span>HIGH COURT</span></div>
        <div className="map-bell"><span>THE<br />BELL</span></div>
      </div>
      <div className="lore-stakes"><span>TONIGHT’S DECREE</span><p>At the thirteenth bell, the Court will burn three forbidden relics: a mint seal, an erased atlas, and the Sun Crown. Four masks have one chance to take them first.</p><strong>One runner at a door escapes. Two wake the city.</strong></div>
      <figure className="cast-sheet">
        <img src="/art/characters/cast-sheet.webp" alt="The Unnamed, Fox, Moth and Rook standing together" width="1600" height="900" decoding="async" />
        <figcaption><span>KNOWN NIGHT RUNNERS / BELL COURT FILE 04</span><strong>Four masks. Three doors. No trusted names.</strong></figcaption>
      </figure>
      <div className="cast-heading"><span className="eyebrow eyebrow-dark"><b>THE FOUR MASKS</b></span><h3>No names enter the chamber.</h3></div>
      <div className="runner-cast">{runnerLore.map((runner, index) => <article key={runner.id}><span className="dossier-number">0{index + 1}</span><RunnerPortrait id={runner.id} /><div className="runner-card-copy"><span>{runner.title}</span><h3>{runner.name}</h3><p>{runner.text}</p></div></article>)}</div>
    </section>

    <section className="rules-section" id="rules">
      <Ornament name="moth" className="rules-ornament" />
      <div className="section-heading"><span className="eyebrow"><b>02</b> HOW TO PLAY</span><h2>One choice.<br />No safe answer.</h2></div>
      <div className="rule-grid">
        <article><span className="rule-number">01</span><div className="mini-scene doors-mini">{VAULTS.map((vault) => <VaultDoor vault={vault} small key={vault.id} />)}</div><h3>Read the room</h3><p>The Copper Cache is worth 3. The Moon Archive holds 5. The Sun Crown is worth 8—and draws the bold.</p></article>
        <article><span className="rule-number">02</span><div className="mini-scene seal-mini"><span className="sealed-gem">◆</span><span className="hash-lines">82A1<br />F09C<br />••••</span></div><h3>Seal your move</h3><p>Your choice is mixed with a random secret and locked into a commitment. Nobody can read or change it.</p></article>
        <article><span className="rule-number">03</span><div className="mini-scene collision-mini"><Mark id="fox">F</Mark><span className="alarm-lines">×</span><Mark id="rook">R</Mark></div><h3>Avoid the alarm</h3><p>Alone at a vault? Claim its relics. Meet another runner there? The alarm fires and both leave empty-handed.</p></article>
      </div>
    </section>

    <section className="zcash-section" id="zcash">
      <Ornament name="route" className="zcash-ornament" />
      <div className="zcash-copy"><span className="eyebrow eyebrow-dark"><b>03</b> WHY ZCASH</span><h2>A private move should stay private.</h2><p>In testnet mode, a shielded transaction carries each commitment. The chain can prove a move arrived on time without publishing the player or their choice.</p><ul><li><span>✓</span> Salted commitments hide the chosen vault</li><li><span>✓</span> Shielded transfers do not publish sender identities</li><li><span>✓</span> Reveals let anyone recompute the result</li></ul><p className="build-note">The testnet lab now builds wallet requests and private receipts. A complete live round and independent chain audit have not yet been demonstrated.</p></div>
      <div className="spectator-card">
        <div className="spectator-head"><span>SPECTATOR VIEW</span><span className="live-dot">SELECTION OPEN</span></div>
        <p>Four moves arrived. Their choices are unreadable.</p>
        {['7cf2…91aa', '201e…4bd0', 'b8a4…183f', '55d1…e912'].map((hash, index) => <div className="arrival" key={hash}><span>{String(index + 1).padStart(2, '0')}</span><i className="closed-eye">—</i><code>{hash}</code><b>SEALED</b></div>)}
        <div className="spectator-foot"><span>VISIBLE</span> arrival order · commitment <span>HIDDEN</span> player · vault · secret</div>
      </div>
    </section>

    <section className="privacy-section" id="privacy">
      <Ornament name="seal" className="privacy-ornament" />
      <span className="eyebrow"><b>04</b> PRIVACY, PLAINLY</span><div className="privacy-layout"><h2>The game hides choices.<br />It does not promise invisibility.</h2><div><p>Practice moves never leave this browser. A future testnet round will use a dedicated shielded address and fixed-value transactions. Revealed moves become public after the round.</p><p>Network timing, wallet servers and outside information can still reveal clues. Veil Vault will use no accounts, analytics, transaction relay or mainnet funds.</p></div></div>
    </section>

    <section className="final-cta"><Ornament name="crown" className="cta-ornament" /><div><span>THE CHAMBER IS OPEN</span><h2>Which door looks empty?</h2></div><button className="button button-acid" onClick={onPlay}>Play a practice round <span>↗</span></button></section>
  </main>
}

function PageMasthead({ code, eyebrow, title, introduction, ornament }: { code: string; eyebrow: string; title: string; introduction: string; ornament: 'key' | 'seal' }) {
  return <section className="manual-masthead"><Ornament name={ornament} className="manual-masthead-ornament" /><div><span className="page-code">{code}</span><span className="eyebrow eyebrow-dark">{eyebrow}</span><h1>{title}</h1><p>{introduction}</p></div></section>
}

function Guide({ onPlay, onFairness }: { onPlay: () => void; onFairness: () => void }) {
  return <main className="manual-page">
    <PageMasthead code="FIELD MANUAL / 01" eyebrow="FOR NEW NIGHT RUNNERS" title="How to survive the chamber." introduction="Veil Vault is a short bluffing game about choosing the valuable door nobody else chooses. You never need to understand cryptography to play." ornament="key" />

    <nav className="manual-jump" aria-label="On this page"><span>ON THIS PAGE</span><button onClick={() => document.getElementById('one-minute')?.scrollIntoView({ behavior: 'smooth' })}>The game in one minute</button><button onClick={() => document.getElementById('round-flow')?.scrollIntoView({ behavior: 'smooth' })}>Round flow</button><button onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}>Examples</button><button onClick={() => document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth' })}>Words used in the chamber</button></nav>

    <section className="manual-section one-minute" id="one-minute">
      <div className="manual-section-heading"><span>01</span><div><p>THE GAME IN ONE MINUTE</p><h2>Pick one door.<br />Hope you are alone.</h2></div></div>
      <div className="manual-prose"><p>Four runners are chasing three relics. Every runner chooses exactly one vault, but nobody sees the others’ choices until all moves are locked.</p><p>If you are the only runner at your vault, you claim its relics. If another runner chose the same vault, its alarm wakes and everybody at that door scores zero.</p><p>The runner with the most relics wins. Because each vault has a different value, there can be only one winner.</p></div>
      <div className="guide-vaults">{VAULTS.map((vault) => <article key={vault.id}><VaultDoor vault={vault} /><div><span>{vault.value} RELICS</span><h3>{vault.name}</h3><p>{vault.id === 'copper' ? 'The smallest reward. Often ignored, never truly safe.' : vault.id === 'moon' ? 'The middle reward. A tempting compromise.' : 'The greatest reward. It attracts bold runners.'}</p></div></article>)}</div>
    </section>

    <section className="manual-section" id="round-flow">
      <div className="manual-section-heading"><span>02</span><div><p>ONE COMPLETE ROUND</p><h2>From curfew<br />to escape.</h2></div></div>
      <ol className="flow-timeline">
        <li><i>01</i><div><span>THE RIVALS LOCK FIRST</span><h3>Fox, Moth and Rook seal their moves.</h3><p>The practice game creates their hidden choices before you enter the chamber. It cannot wait to see your choice and then counter it.</p></div></li>
        <li><i>02</i><div><span>READ THE INTEL</span><h3>Look for tendencies, not promises.</h3><p>Fox likes the richest prize. Moth notices neglected doors. Rook trusts familiar corridors. Their behavior is weighted, not fixed, so every round can still surprise you.</p></div></li>
        <li><i>03</i><div><span>CHOOSE ONE VAULT</span><h3>Balance reward against attention.</h3><p>Copper is worth 3, Moon is worth 5, and Crown is worth 8. The richest vault wins only if its runner arrives alone.</p></div></li>
        <li><i>04</i><div><span>SEAL YOUR MOVE</span><h3>Your choice becomes a locked commitment.</h3><p>The game combines your chosen vault with a long random secret. The public commitment does not reveal the vault, but it prevents you from changing it later.</p></div></li>
        <li><i>05</i><div><span>LIFT THE VEIL</span><h3>Every move is checked and revealed.</h3><p>The browser verifies that each reveal matches its earlier commitment. Only valid reveals enter the result.</p></div></li>
        <li><i>06</i><div><span>RESOLVE THE CHAMBER</span><h3>Lone runners score. Collisions wake alarms.</h3><p>The browser calculates every score and winner from the verified moves. You can deliberately announce a false winner and watch the checker reject it.</p></div></li>
      </ol>
    </section>

    <section className="manual-section example-section" id="examples">
      <div className="manual-section-heading"><span>03</span><div><p>READING A RESULT</p><h2>Three rounds,<br />three lessons.</h2></div></div>
      <div className="example-grid">
        <article><span className="example-tag">LONE CROWN</span><div className="example-doors"><div><b>COPPER</b><span>You</span></div><div><b>MOON</b><span>Moth + Rook</span></div><div><b>CROWN</b><span>Fox</span></div></div><h3>Fox wins 8.</h3><p>You safely claim 3, but Fox is alone at the Crown and scores more. A safe door is not automatically the winning door.</p></article>
        <article><span className="example-tag">CROWN ALARM</span><div className="example-doors"><div><b>COPPER</b><span>Empty</span></div><div><b>MOON</b><span>You</span></div><div><b>CROWN</b><span>Fox + Moth + Rook</span></div></div><h3>You win 5.</h3><p>Three runners chase the greatest prize and cancel one another. Your lone Moon claim becomes the highest valid score.</p></article>
        <article><span className="example-tag">NO ESCAPE</span><div className="example-doors"><div><b>COPPER</b><span>You + Moth</span></div><div><b>MOON</b><span>Fox + Rook</span></div><div><b>CROWN</b><span>Empty</span></div></div><h3>Nobody wins.</h3><p>Every occupied vault has a collision. All four runners score zero, so the round ends without a winner.</p></article>
      </div>
    </section>

    <section className="manual-section glossary-section" id="terms">
      <div className="manual-section-heading"><span>04</span><div><p>CHAMBER WORDS</p><h2>No hidden jargon.</h2></div></div>
      <dl className="glossary"><div><dt>Move</dt><dd>The one vault a runner chooses.</dd></div><div><dt>Commitment</dt><dd>A locked fingerprint of a move and its random secret. It hides the move and binds the runner to it.</dd></div><div><dt>Random secret</dt><dd>A long unpredictable value that stops anyone from guessing a three-option move from its commitment.</dd></div><div><dt>Reveal</dt><dd>The chosen vault and random secret shown after selection closes.</dd></div><div><dt>Collision</dt><dd>Two or more runners choosing the same vault. Everyone there scores zero.</dd></div><div><dt>Receipt</dt><dd>The private information needed to reveal your move. Anyone holding it can read the choice.</dd></div></dl>
    </section>

    <section className="manual-next"><div><span>NEXT RECORD</span><h2>Why can the result be trusted?</h2><p>The fair-play page explains the lock, the receipt, and exactly what privacy does—and does not—mean.</p></div><button className="button button-ghost" onClick={onFairness}>Read fair play <span>→</span></button><button className="button button-acid" onClick={onPlay}>Enter practice <span>↗</span></button></section>
  </main>
}

function FairPlay({ onPlay, onGuide }: { onPlay: () => void; onGuide: () => void }) {
  return <main className="manual-page fairness-page">
    <PageMasthead code="FIELD MANUAL / 02" eyebrow="FAIR PLAY & THE VEIL" title="A locked move, not a promise." introduction="Veil Vault does not ask you to trust an announced winner. It gives everyone a way to check that moves stayed hidden, stayed unchanged, and produced the stated result." ornament="seal" />

    <section className="manual-section fairness-story">
      <div className="manual-section-heading"><span>01</span><div><p>THE SIMPLE VERSION</p><h2>Write it. Lock it.<br />Open it later.</h2></div></div>
      <div className="fairness-diagram"><div><Ornament name="key" /><span>YOUR PRIVATE MOVE</span><strong>Moon Archive + random secret</strong><small>Only you can read this.</small></div><i>→</i><div><Ornament name="seal" /><span>THE COMMITMENT</span><strong>8a91…f2c0</strong><small>Safe to show while selection is open.</small></div><i>→</i><div><Ornament name="bell" /><span>THE REVEAL</span><strong>Move and secret checked</strong><small>A mismatch is rejected.</small></div></div>
      <div className="manual-prose two-column"><p>A commitment behaves like sealing a written choice inside a tamper-evident envelope. People can see that an envelope exists without reading what is inside it.</p><p>After selection closes, the move and random secret are revealed. The game recreates the commitment. If even one character changed, it no longer matches.</p></div>
    </section>

    <section className="manual-section truth-table-section">
      <div className="manual-section-heading"><span>02</span><div><p>WHAT THE CHECK PROVES</p><h2>Useful guarantees.<br />Honest limits.</h2></div></div>
      <div className="truth-columns"><div><span className="truth-yes">THE CHECK CAN SHOW</span><ul><li>A reveal matches an earlier commitment.</li><li>The runner did not switch vaults after committing.</li><li>Every accepted move uses a valid vault.</li><li>Collisions and scores were calculated correctly.</li><li>The announced winner matches the verified moves.</li></ul></div><div><span className="truth-no">THE CHECK CANNOT SHOW</span><ul><li>That a human is using only one identity.</li><li>That nobody coordinated outside the game.</li><li>That a fabricated supplied record contains every real transaction.</li><li>That network timing cannot reveal clues.</li><li>That practice mode used the Zcash chain—it does not.</li></ul></div></div>
    </section>

    <section className="manual-section mode-section">
      <div className="manual-section-heading"><span>03</span><div><p>KNOW WHICH WORLD YOU ARE IN</p><h2>Practice is not testnet.</h2></div></div>
      <div className="mode-cards"><article><span>AVAILABLE NOW</span><h3>Browser practice</h3><p>Your move, simulated rivals, commitments and results exist only in this browser’s memory. Refreshing clears the round. No transaction is sent.</p><ul><li>No wallet</li><li>No payment</li><li>No chain evidence</li><li>Real commitment and scoring logic</li></ul></article><article><span>LAB AVAILABLE · LIVE ROUND UNPROVEN</span><h3>Zcash testnet</h3><p>The lab builds shielded anchor, commitment and reveal requests with downloadable public rounds and private receipts. It does not sign, broadcast or confirm them.</p><ul><li>Testnet funds only</li><li>Wallet signs transactions</li><li>Chain timing decides validity</li><li>Must be demonstrated before claimed</li></ul></article></div>
    </section>

    <section className="manual-section privacy-truth">
      <div className="manual-section-heading"><span>04</span><div><p>PRIVACY, WITHOUT MYTHS</p><h2>The Veil hides a choice.<br />Not every trace.</h2></div></div>
      <div className="manual-prose two-column"><p>During selection, a properly salted commitment does not reveal which of the three vaults you chose. In future testnet mode, shielded transfers also avoid publishing a sender address in the ordinary transparent way.</p><p>After reveal, chosen vaults intentionally become readable. Wallet servers, transaction timing, IP addresses and outside conversations can still provide clues. Veil Vault does not promise perfect anonymity.</p></div>
      <div className="no-leak-banner"><Ornament name="moth" /><div><span>THIS APP SENDS NO GAMEPLAY DATA</span><strong>No analytics, accounts, remote fonts, wallet relay, bid API or external media. The static host can still see ordinary page requests and IP addresses.</strong></div></div>
    </section>

    <section className="manual-next"><div><span>RETURN TO MANUAL 01</span><h2>Ready to read the room?</h2><p>Review the basic round flow, or step into the browser-only practice chamber.</p></div><button className="button button-ghost" onClick={onGuide}>How to play <span>←</span></button><button className="button button-acid" onClick={onPlay}>Enter practice <span>↗</span></button></section>
  </main>
}

function Game({ onRestart, soundOn }: { onRestart: () => void; soundOn: boolean }) {
  const [phase, setPhase] = useState<Phase>('briefing')
  const [selected, setSelected] = useState<VaultId | null>(null)
  const [botRunners, setBotRunners] = useState<Runner[]>([])
  const [runners, setRunners] = useState<Runner[]>([])
  const [outcome, setOutcome] = useState<GameOutcome | null>(null)
  const [verified, setVerified] = useState(false)
  const [forgeryChecked, setForgeryChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [roundId, setRoundId] = useState(() => randomHex(8))

  useEffect(() => {
    let active = true
    Promise.all(rivals.map(async (rival) => ({ ...rival, receipt: await commitMove(roundId, rival.id, chooseRivalVault(rival.id)) })))
      .then((sealed) => { if (active) setBotRunners(sealed) })
    return () => { active = false }
  }, [roundId])

  async function sealMoves() {
    if (!selected || busy || botRunners.length !== rivals.length) return
    setBusy(true)
    const player = { id: 'you', name: 'You', mark: 'Y', receipt: await commitMove(roundId, 'you', selected) }
    setRunners([player, ...botRunners])
    setPhase('sealed')
    playGameSound('seal', soundOn)
    setBusy(false)
  }

  function enterChamber() {
    setPhase('choose')
    playGameSound('reveal', soundOn)
  }

  async function liftVeil() {
    if (busy) return
    setBusy(true)
    const checks = await Promise.all(runners.map((runner) => verifyReveal(roundId, runner.receipt)))
    const validRunners = runners.filter((_, index) => checks[index])
    setVerified(checks.every(Boolean))
    const nextOutcome = resolveRound(validRunners.map((runner) => runner.receipt))
    setOutcome(nextOutcome)
    setPhase('result')
    if (nextOutcome.winnerId === 'you') playGameSound('win', soundOn)
    else if (nextOutcome.vaults.some((vault) => vault.status === 'alarm')) playGameSound('alarm', soundOn)
    else playGameSound('reveal', soundOn)
    setBusy(false)
  }

  function playAgain() {
    setBotRunners([]); setRoundId(randomHex(8)); setSelected(null); setRunners([]); setOutcome(null); setVerified(false); setForgeryChecked(false); setPhase('briefing')
    onRestart()
  }

  const chosenVault = VAULTS.find((vault) => vault.id === selected)
  const winnerArt = outcome?.winnerId ? runnerArt[outcome.winnerId] : null
  const phaseLabel = phase === 'briefing' ? 'CURFEW ACTIVE' : phase === 'choose' ? 'SELECTION OPEN' : phase === 'sealed' ? 'ALL MOVES SEALED' : 'VEIL LIFTED'
  return <main className="game-main">
    <div className="game-ornaments" aria-hidden="true"><Ornament name="bell" /><Ornament name="route" /><Ornament name="seal" /></div>
    <div className="game-topline"><span>VEYR / NIGHT 19</span><span>ROUND <b>{roundId.slice(0, 4).toUpperCase()}</b></span><span>{phaseLabel}</span><span>4 RUNNERS</span></div>

    {phase === 'briefing' && <section className="game-panel briefing-panel">
      <div className="briefing-art"><img src={runnerArt.you} alt="The Unnamed waits beneath the Bell Court" width="900" height="1125" /><div className="briefing-scan" /><span>MASK 00 / RECORD ABSENT</span></div>
      <div className="briefing-copy">
        <span className="phase-count">NIGHT 19 / MISSION BRIEF</span>
        <span className="eyebrow eyebrow-dark">THE THIRTEENTH BELL</span>
        <h1>Three relics burn<br />at first light.</h1>
        <p>The Bell Court has marked a mint seal, an erased atlas and the Sun Crown for destruction. Reach one vault unseen. If another mask chooses your door, every runner there leaves empty-handed.</p>
        <div className="mission-rules"><div><span>OBJECTIVE</span><strong>Make the highest lone claim</strong></div><div><span>FAILURE</span><strong>Share a door and wake its alarm</strong></div></div>
        <div className="briefing-rivals"><span>KNOWN RIVALS</span><div>{rivals.map((rival) => <RunnerThumb id={rival.id} key={rival.id} />)}</div></div>
        <button className="button button-acid briefing-button" onClick={enterChamber}>Cross into the chamber <span>→</span></button>
        <p className="briefing-note">Their choices are already sealed. The house cannot react to yours.</p>
      </div>
    </section>}

    {phase === 'choose' && <section className="game-panel choose-panel">
      <div className="game-intro"><span className="phase-count">01 / 03</span><div><span className="eyebrow eyebrow-dark">THE THIRTEENTH BELL / MAKE YOUR MOVE</span><h1>Which vault will<br />they leave alone?</h1><p>The relics burn at dawn. Pick one door. Your three rivals already chose in secret.</p><div className={`rival-locks ${botRunners.length === rivals.length ? 'ready' : ''}`}><span>{botRunners.length === rivals.length ? '✓ Rivals locked before your choice' : 'Locking rival moves…'}</span>{botRunners.map((runner) => <code key={runner.id}>{runner.receipt.commitment.slice(0, 6)}</code>)}</div></div></div>
      <fieldset className="vault-choice"><legend className="sr-only">Choose a vault</legend>{VAULTS.map((vault) => <button type="button" className={`choice-card vault-card-${vault.id} ${selected === vault.id ? 'selected' : ''}`} onClick={() => { setSelected(vault.id); playGameSound('select', soundOn) }} aria-pressed={selected === vault.id} key={vault.id}><span className="choice-check">{selected === vault.id ? '✓' : ''}</span><VaultDoor vault={vault} /><span className="choice-value"><strong>{vault.value}</strong> relics</span><h2>{vault.name}</h2><p>{vault.clue}</p></button>)}</fieldset>
      <details className="intel-panel"><summary>Review rival intelligence <span>Three tendencies recovered</span></summary><div className="intel-grid">{rivals.map((rival) => <article key={rival.id}><RunnerThumb id={rival.id} /><div><strong>{rival.name}</strong><p>“{rival.tell}”</p></div></article>)}</div><p className="intel-warning">Intel suggests tendencies, not fixed moves. Every rival commitment was created before you entered.</p></details>
      <div className="game-action-bar"><div>{chosenVault ? <><span>Your choice</span><strong>{chosenVault.name} · {chosenVault.value} relics</strong></> : <><span>Your choice</span><strong>No vault selected</strong></>}</div><button className="button button-acid" disabled={!selected || busy || botRunners.length !== rivals.length} onClick={sealMoves}>{busy ? 'Sealing…' : botRunners.length !== rivals.length ? 'Rivals sealing…' : 'Seal my move'} <span>→</span></button></div>
    </section>}

    {phase === 'sealed' && <section className="game-panel sealed-panel">
      <div className="sealed-heading"><span className="phase-count">02 / 03</span><span className="sealed-symbol">◆</span><span className="eyebrow eyebrow-dark">THE VEIL IS CLOSED</span><h1>Four choices.<br />Nothing to see yet.</h1><p>Every runner is now bound to one vault. The commitments reveal no useful clue, but changing a move would break its hash.</p></div>
      <div className="commitment-board">{runners.map((runner, index) => <article key={runner.id}><div><span>{String(index + 1).padStart(2, '0')}</span><RunnerThumb id={runner.id} /><strong>{runner.name}</strong></div><code>{runner.receipt.commitment.slice(0, 12)}…{runner.receipt.commitment.slice(-8)}</code><b>SEALED</b></article>)}</div>
      <details className="receipt-details"><summary>Inspect your private move receipt</summary><dl><div><dt>Round</dt><dd>{roundId}</dd></div><div><dt>Commitment</dt><dd>{runners[0]?.receipt.commitment}</dd></div><div><dt>Private choice</dt><dd>{chosenVault?.name}</dd></div><div><dt>Random secret</dt><dd>{runners[0]?.receipt.salt}</dd></div></dl><p>In a real round, save this privately. Anyone holding it can read and reveal your move.</p></details>
      <div className="game-action-bar"><div><span>Spectators can see</span><strong>4 commitments · 0 choices</strong></div><button className="button button-acid" disabled={busy} onClick={liftVeil}>{busy ? 'Checking…' : 'Lift the veil'} <span>→</span></button></div>
    </section>}

    {phase === 'result' && outcome && <section className="game-panel result-panel">
      <div className="result-heading"><span className="phase-count">03 / 03</span><div className="result-copy"><span className="eyebrow eyebrow-dark">THE CHAMBER OPENS</span><h1>{outcome.winnerId ? `${playerNames[outcome.winnerId]} escaped with the relics.` : 'Every door raised an alarm.'}</h1><p>{outcome.winnerId === 'you' ? 'You read the room correctly.' : outcome.winnerId ? 'The best vault is not always the safest vault.' : 'No lone claim survived this round.'}</p></div>{winnerArt ? <div className="winner-art"><img src={winnerArt} alt={`${playerNames[outcome.winnerId ?? '']} won the round`} width="900" height="1125" /><div className="winner-seal"><span>{outcome.scores[outcome.winnerId ?? '']}</span><small>RELICS</small></div></div> : <div className="winner-seal no-winner"><span>0</span><small>CLAIMED</small></div>}</div>
      <div className="result-vaults">{outcome.vaults.map((vaultResult) => <article className={`result-vault result-${vaultResult.status}`} key={vaultResult.vault.id}><div className="result-door-wrap"><VaultDoor vault={vaultResult.vault} /><span className="result-status">{vaultResult.status === 'claimed' ? 'CLAIMED' : vaultResult.status === 'alarm' ? 'ALARM' : 'EMPTY'}</span></div><div><h2>{vaultResult.vault.name}</h2><p>{vaultResult.players.length === 0 ? 'No runner chose this door.' : vaultResult.players.map((player) => playerNames[player]).join(' + ')}</p><div className="result-marks">{vaultResult.players.map((player) => <Mark id={player} key={player} />)}</div></div><strong className="points-earned">{vaultResult.status === 'claimed' ? `+${vaultResult.vault.value}` : '0'}<small>RELICS</small></strong></article>)}</div>
      <div className="verification-card"><div className="verification-main"><span className="verification-icon">✓</span><div><span>RESULT VERIFIED IN THIS BROWSER</span><strong>{verified ? '4 of 4 reveals match their commitments' : 'A reveal failed verification'}</strong><p>The winner was recomputed from the revealed moves—not trusted from an announcement.</p></div></div><div className="forgery-test"><button onClick={() => { setForgeryChecked(true); playGameSound('reject', soundOn) }} disabled={forgeryChecked}>Try a forged winner</button>{forgeryChecked && <span className="rejected">× REJECTED — {declaredWinnerIsValid(outcome, outcome.winnerId === 'fox' ? 'moth' : 'fox') ? 'unexpected match' : 'does not match the verified moves'}</span>}</div></div>
      <div className="game-action-bar"><div><span>Round complete</span><strong>{outcome.winnerId ? `${playerNames[outcome.winnerId]} won with ${outcome.scores[outcome.winnerId]} relics` : 'No winner this time'}</strong></div><button className="button button-acid" onClick={playAgain}>Play another round <span>↻</span></button></div>
    </section>}

    <footer className="game-footer"><span>Practice simulation · no transaction was sent</span><span>Choices and secrets remain in memory and disappear on refresh</span></footer>
  </main>
}

function App() {
  function screenFromHash(): Screen { return window.location.hash === '#how-to-play' ? 'guide' : window.location.hash === '#fair-play' ? 'fairness' : window.location.hash === '#testnet' ? 'testnet' : 'home' }
  const [screen, setScreen] = useState<Screen>(() => screenFromHash())
  const [soundOn, setSoundOn] = useState(false)
  useEffect(() => {
    function followHash() { setScreen(screenFromHash()); window.scrollTo({ top: 0, behavior: 'instant' }) }
    window.addEventListener('hashchange', followHash)
    return () => window.removeEventListener('hashchange', followHash)
  }, [])
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    return () => window.cancelAnimationFrame(frame)
  }, [screen])
  function clearAnchor() { if (window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`) }
  function play() { clearAnchor(); setSoundOn(true); playGameSound('select', true); setAmbientMusic(true); setScreen('game'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function home() { clearAnchor(); setScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function openPage(next: 'guide' | 'fairness' | 'testnet') { const hash = next === 'guide' ? '#how-to-play' : next === 'fairness' ? '#fair-play' : '#testnet'; if (window.location.hash === hash) { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }) } else window.location.hash = hash }
  function toggleSound() { setSoundOn((enabled) => { const next = !enabled; if (next) playGameSound('select', true); setAmbientMusic(next); return next }) }
  return <div className="app-shell">
    <Header screen={screen} onHome={home} onPlay={play} onGuide={() => openPage('guide')} onFairness={() => openPage('fairness')} onTestnet={() => openPage('testnet')} soundOn={soundOn} onSoundToggle={toggleSound} />
    {screen === 'home' && <Home onPlay={play} onGuide={() => openPage('guide')} />}
    {screen === 'guide' && <Guide onPlay={play} onFairness={() => openPage('fairness')} />}
    {screen === 'fairness' && <FairPlay onPlay={play} onGuide={() => openPage('guide')} />}
    {screen === 'testnet' && <TestnetLab />}
    {screen === 'game' && <Game onRestart={() => undefined} soundOn={soundOn} />}
  </div>
}

export default App
