# Veil Vault — submission draft

Status: draft. Replace bracketed placeholders only with verified information.

## Entry

- **Title:** Veil Vault
- **Track:** ZECATHON 2026 — Wildcard
- **One line:** A one-round shielded bluffing game where four runners hide their
  vault choice, commit to it privately, and reveal only after the doors close.
- **Public URL:** [PUBLIC URL]
- **Repository:** [REPOSITORY URL]
- **Video:** [VIDEO URL]

## Short description

Veil Vault is a one-round bluffing game for four runners. Three vaults hold 3, 5
and 8 relics. Each runner secretly chooses one. A vault pays only when exactly
one runner claims it; two or more claims trigger the alarm and score nothing.
The highest lone claim wins.

The playable browser version uses the same salted-commitment and reveal logic
that the testnet protocol uses. The sealed phase shows a public commitment QR and
lets the player save a private practice receipt. A separate judge-facing testnet
appendix, linked from “Why Zcash,” creates a public round file, private move
receipts, and ZIP-321 wallet requests for a fixed 0.001 TAZ shielded payment. The
wallet — not the site — reviews, signs and sends anything. A supplied-record
checker then recomputes the anchor, timing windows, fixed payments, commitments,
reveals, collisions and winner from a public JSON bundle.

The project is built around a narrow privacy boundary: no accounts, analytics,
cookies, browser storage, remote fonts, media CDNs, wallet relay or mainnet flow.
Production CSP sets `connect-src 'none'`.

## What is playable now

- Full practice round against three simulated rivals with documented tendencies.
- Mission briefing, rival intel, sealed commitments, verified reveals and results.
- Sealed phase with a public commitment QR and a private practice-receipt download.
- Runner's Field Guide and Fair Play pages in the game's lore and tone.
- Locally hosted display/UI fonts and procedural ambient audio and sound effects.
- Judge-facing testnet appendix with local QR codes, not part of the player flow.
- Offline supplied-record checker and a clearly labelled fabricated sample.

## What is deliberately not claimed

- No live testnet round has been completed.
- No transaction has been signed, broadcasted, mined or confirmed by this project.
- Practice mode is a simulation, not chain evidence.
- Shielded transactions do not remove network, timing, wallet-server or
  outside-information risks.
- The supplied-record checker proves internal consistency, not completeness or
  independent chain truth.
- Player uniqueness, sybil resistance and collusion resistance are unsolved.

## Two-minute video outline

**0:00–0:15 — Hook.** "Four runners. Three vaults. One private choice. Choose
unseen." Show the landing page and the first-night guide prompt.

**0:15–0:40 — Rules.** Open the Runner's Field Guide. Explain lone claims, alarms
and the 3/5/8 vault values with one worked example.

**0:40–1:20 — Practice round.** Play one round: read rival intel, choose a vault,
show the commitment sealing and the public-seal QR, save the private practice
receipt, reveal the rivals, and land on a result. Point out that the browser
verifies every reveal and rejects a forged winner.

**1:20–1:45 — Judge appendix.** Open the testnet appendix from “Why Zcash.” Show
the organizer round form and anchor QR, then a runner importing the public round,
sealing a move and opening the commitment QR. State clearly: “The wallet signs;
the site never sees keys or relays a transaction. No live round has been run yet.”

**1:45–1:55 — Audit and privacy.** Import
`docs/examples/supplied-records-SAMPLE.json` into the supplied-record checker and
show the Moon winner. Say: “This is a fabricated sample, not chain evidence.”
Show the privacy boundaries and the `connect-src 'none'` policy.

**1:55–2:00 — Close.** “Veil Vault: choose unseen.”

## Judge test path

1. Open the public URL.
2. Read the first-night prompt and the Runner's Field Guide.
3. Play a practice round, including the public-seal QR and private-receipt save.
4. Open the judge-facing testnet appendix from the “Why Zcash” section.
5. Import the sample supplied-record bundle from the repository into the checker.
6. Run the offline audit command if the repository is available.

## Asset and licence notes

- Application code: MIT.
- Jacquard 24 and Silkscreen: SIL Open Font License 1.1, self-hosted.
- Character art: generated with Gemini/Nano Banana, processed locally and
  documented in `docs/GENERATED-ASSETS.md`.
- Runtime libraries: React, QRCode and `@noble/hashes`.

## Submission text — short field version

> Veil Vault is a four-runner shielded bluffing game for ZECATHON 2026. Three
> vaults hold 3, 5 and 8 relics; a vault pays only when exactly one runner claims
> it, and collisions trigger an alarm. The browser practice game uses real salted
> commitments and verified reveals. A judge-facing testnet appendix builds public
> round files, private receipts and ZIP-321 requests for fixed 0.001 TAZ shielded
> payments, leaving signing and sending to the wallet. A supplied-record checker
> recomputes timing, commitments, collisions and the winner from a public bundle.
> No live testnet round has been run yet, and the project makes no claim of perfect
> anonymity. No analytics, cookies, browser storage, remote assets or wallet relay.
