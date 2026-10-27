# Veil Vault — submission draft

Status: final copy ready 2026-10-27. Replace bracketed placeholders only with
verified information. First claims review complete 2026-10-26; final review
complete 2026-10-27 against the published video.

## Entry

- **Title:** Veil Vault
- **Track:** ZECATHON 2026 — Wildcard
- **One line:** A one-round shielded bluffing game prototype where four runners
  hide their vault choice, commit to it without revealing it, and reveal only
  after the doors close.
- **Public URL:** https://veil-vault-game.vercel.app/
- **Repository:** https://github.com/Daveboss123/veil-vault
- **Video:** https://youtu.be/nqfkH0BOMe0

## Short description

Veil Vault is a one-round bluffing game for four runners. Three vaults hold 3, 5
and 8 relics. Each runner secretly chooses one. A vault pays only when exactly
one runner claims it; two or more claims trigger the alarm and score nothing.
The highest lone claim wins.

The playable browser version uses the same commit-then-reveal pattern as the
testnet protocol, with domain-separated preimages. The sealed phase shows a public
commitment QR and lets the player save a practice receipt that must be kept
private; the receipt is not encrypted. A separate judge-facing testnet appendix,
linked from “Why Zcash,” creates a public round file, receipts that must be kept
private, and ZIP-321 wallet requests for a fixed 0.001 TAZ shielded payment. The
wallet — not the site — reviews, signs and sends anything; the site never receives
keys or a signed transaction. A supplied-record checker then checks the anchor,
timing windows, fixed payments, commitments, reveals, collisions and winner from a
public JSON bundle.

The project is built around a narrow application-level privacy boundary: no
accounts, analytics, cookies, browser-storage APIs, remote fonts, media CDNs,
wallet relay or mainnet flow. Production CSP sets `connect-src 'none'`. The
submission video is hosted on YouTube as an external link; the site does not embed
it or load YouTube assets.

## What is playable now

- Full practice round against three simulated rivals with documented tendencies.
- Mission briefing, rival intel, sealed commitments, browser-verified reveals and
  results.
- Sealed phase with a public commitment QR and a practice-receipt download that
  must be kept private.
- Runner's Field Guide and Fair Play pages in the game's lore and tone.
- Locally hosted display/UI fonts and procedural ambient audio and sound effects.
- Judge-facing testnet appendix with local QR codes, not part of the player flow.
- Offline supplied-record checker and a clearly labelled fabricated sample.

## What is deliberately not claimed

- The testnet lab is a judge appendix, not a played round.
- No transaction has been signed, broadcast, mined or confirmed by this project.
- Practice mode is a simulation, not chain evidence.
- Receipts are not encrypted; anyone holding one can read the move.
- Shielded transactions do not remove network, timing, wallet-server or
  outside-information risks.
- The supplied-record checker proves internal consistency, not completeness or
  independent chain truth.
- Player uniqueness, sybil resistance and collusion resistance are unsolved.
- The video is a narrated practice and lab walkthrough, not proof of a live round.

## Video outline (2:58)

**Hosting:** YouTube, as an external link only. The site does not embed the video
or load YouTube scripts. The video description and narration must carry the same
qualifiers as this document.

**0:00–0:15 — Cold open.** Veyr, the ledger city; privacy as evidence of guilt.

**0:15–0:30 — The Veil.** Commit the choice before the final bell; reveal only
when no one can change course.

**0:30–0:49 — Rules.** Four runners, three vaults, 3/5/8 relics; a shared door
wakes the alarm; the highest lone claim wins.

**0:49–1:02 — Practice chamber.** No wallet, account, payment or transaction;
same-origin only.

**1:02–1:15 — Briefing.** Three relics burn; rivals have already sealed; the
house cannot react.

**1:15–1:32 — Choose.** Copper, Moon, Sun Crown; read the tendencies and pick.

**1:32–1:51 — Seal.** Choice + salt → SHA-256 commitment; public commitments,
private inputs; the receipt is withheld.

**1:51–2:10 — Reveal.** Every runner reveals; the browser checks each reveal
against its commitment; a forged winner is rejected. Browser-side verification,
not on-chain verification.

**2:10–2:29 — Zcash rail.** The testnet lab prepares shielded wallet requests;
the wallet signs; the site never sees keys. The lab is a judge appendix.

**2:29–2:47 — Honesty ledger.** Browser practice, not chain evidence; the audit
sample is fabricated; no accounts, analytics, cookies or browser storage.

**2:47–2:58 — Close.** Choose a vault. Keep it hidden.
veil-vault-game.vercel.app.

### Video claims guardrails

Required on screen or in narration:

- “Browser practice, not chain evidence.”
- “The wallet signs; the site never sees keys.”
- “The audit sample is fabricated.”
- “Browser-side verification, not on-chain verification.”

Do not say or imply:

- anonymous, untraceable, metadata-free, trustless, production-ready or audited
- a live round was completed
- a transaction was sent, mined or confirmed
- the checker proves completeness or independent chain truth

Do not show:

- private receipt contents, secrets or downloaded receipt files
- wallet balances, recovery phrases, spending keys or viewing keys
- a mainnet address, a funded wallet address, or a testnet address you do not
  want public
- a wallet signing or sending a transaction
- the testnet lab as if it were a live round

## YouTube upload draft

**Title:** Veil Vault — a shielded bluffing game (ZECATHON 2026 practice demo)

**Description:**

> Veil Vault is a one-round bluffing game for four runners, built as a separate
> project for ZECATHON 2026 Wildcard. Three vaults hold 3, 5 and 8 relics; a vault
> pays only when exactly one runner claims it.
>
> This video shows the browser practice round, the public-seal QR, why the
> practice receipt must stay private, browser-side reveal verification, and the
> judge-facing testnet lab. The lab prepares ZIP-321 wallet requests for the
> wallet to review and sign; the wallet signs, and the site never sees keys. The
> video shows that boundary, not a played round, and no transaction was sent,
> mined or confirmed for it. The supplied-record sample is fabricated and is not
> chain evidence.
>
> Play: https://veil-vault-game.vercel.app/
> Source: https://github.com/Daveboss123/veil-vault
> Claims review: https://github.com/Daveboss123/veil-vault/blob/main/docs/CLAIMS-REVIEW.md
>
> The site has no analytics, accounts, cookies, browser storage, remote fonts,
> wallet relay or external media. It does not embed this YouTube video.
>
> Chapters
> 0:00 Cold open
> 0:15 The Veil
> 0:30 The rules
> 0:49 Practice chamber
> 1:02 Briefing
> 1:15 Choose
> 1:32 Seal
> 1:51 Reveal
> 2:10 Zcash rail
> 2:29 Honesty ledger
> 2:47 Play

## Judge test path

1. Open https://veil-vault-game.vercel.app/.
2. Read the first-night prompt and the Runner's Field Guide.
3. Play a practice round, including the public-seal QR and the practice-receipt
   download.
4. Open the judge-facing testnet appendix from the “Why Zcash” section.
5. Import the sample supplied-record bundle from
   https://github.com/Daveboss123/veil-vault/blob/main/docs/examples/supplied-records-SAMPLE.json
   into the checker.
6. Run `npm.cmd run audit -- docs/examples/supplied-records-SAMPLE.json` from the
   repository.

## Asset and licence notes

- Application code: MIT.
- Spectral, Manrope and IBM Plex Mono: SIL Open Font License 1.1, self-hosted.
- Character art: generated with Gemini/Nano Banana, processed locally and
  documented in `docs/GENERATED-ASSETS.md`.
- Runtime libraries: React, QRCode and `@noble/hashes`.

## Submission text — short field version

> Veil Vault is a four-runner shielded bluffing game prototype for ZECATHON 2026.
> Three vaults hold 3, 5 and 8 relics; a vault pays only when exactly one runner
> claims it, and collisions trigger an alarm. The browser practice game uses real
> salted SHA-256 commitments and browser-verified reveals. A judge-facing testnet
> appendix builds public round files, receipts that must be kept private, and
> ZIP-321 requests for fixed 0.001 TAZ shielded payments, leaving signing and
> sending to the wallet. A supplied-record checker checks the anchor, timing,
> commitments, collisions and winner from a public bundle. The testnet lab is a
> supporting appendix, not a played round, and the project makes no claim of
> perfect anonymity. No analytics, cookies, browser storage, remote assets or
> wallet relay; the YouTube video is an external link, not an embed.
