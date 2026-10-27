# Veil Vault claims review

Last reviewed: 2026-10-27, final pass against the published video.

Status: first and final passes complete. The video is published at
https://youtu.be/nqfkH0BOMe0 as an external link.

## Purpose

This review checks every public description of Veil Vault against the evidence in
the repository, the deployed site and the release checklist. It is not a security
audit or a code review. Its job is to catch claims that are true only in a design
document, claims that need a qualifier, and claims that have no evidence yet.

The review covers:

- `README.md`
- `docs/SUBMISSION-DRAFT.md`
- `docs/RELEASE-CHECKLIST.md`
- `docs/PROTOCOL.md`
- `docs/examples/README.md`
- `index.html` metadata
- player-facing copy in `src/App.tsx`
- judge-facing copy in `src/components/TestnetLab.tsx`
- the planned YouTube title, description and narration

## Verdict

The current site can honestly claim:

- a playable browser practice game with real SHA-256 commitments, browser-side
  reveal verification and scoring;
- a testnet lab that prepares ZIP-321 wallet requests and validates shielded
  testnet addresses, without signing or broadcasting;
- an offline checker for the internal consistency of a supplied record bundle;
- application-level privacy hardening: no accounts, analytics, cookies,
  browser-storage APIs, remote fonts, media CDNs, wallet relay or mainnet flow;
- a public production deployment with CSP `connect-src 'none'` and the documented
  security headers.

The current site must not claim:

- a live testnet round was completed;
- any transaction was signed, broadcast, mined or confirmed by this project;
- the game is anonymous, untraceable or metadata-free;
- player uniqueness, sybil resistance or collusion resistance is solved;
- the supplied-record checker proves completeness or independent chain truth;
- the project is production-ready, audited or trustless;
- browser-side verification is on-chain verification.

## Claim matrix

| Claim | Where | Evidence | Status |
| --- | --- | --- | --- |
| Browser practice round with salted commitments, reveal checks, scoring and forged-winner rejection. | README, App, tests | `tests/game.test.ts`; deployed practice flow | Supported |
| Testnet lab prepares ZIP-321 anchor, commitment and reveal requests for 0.001 TAZ and validates shielded testnet addresses. | TestnetLab, `docs/PROTOCOL.md`, tests | `tests/testnet.test.ts`; UI copy | Supported for request preparation only |
| Supplied-record checker checks the anchor, timing, fixed payments, commitments, reveals, collisions and winner. | `src/audit.ts`, TestnetLab, examples | `tests/audit.test.ts`; sample audit output | Supported for the supplied file |
| No accounts, analytics, cookies, browser-storage APIs or remote assets in the application. | README, App, tests | `tests/privacy.test.ts`; deployed network panel | Supported at application level |
| CSP `connect-src 'none'` and documented security headers on production. | `index.html`, `public/_headers`, `vercel.json`, README | `curl.exe -I` output; header tests | Supported |
| No live testnet round has been completed. | README, submission draft, protocol, App | No live round run | Not claimed; keep explicit |
| No transaction was signed, broadcast, mined or confirmed by this project. | README, submission draft, protocol | No live round run; sample is fabricated | Not claimed; keep explicit |
| The game is anonymous, untraceable or metadata-free. | Release checklist, protocol, App | Contradicted by documented timing, wallet-server and IP risks | Not claimed; keep explicit |
| Sybil, collusion or human-uniqueness resistance. | Protocol, App | Documented as unsolved | Not claimed; keep explicit |
| The checker proves completeness or independent chain truth. | Protocol, examples, TestnetLab | Checker is offline and supplied-data only | Not claimed; keep explicit |
| The project is production-ready, audited or trustless. | Release checklist | No audit or production claim is supported | Not claimed; keep explicit |
| The chain can prove a move arrived on time without publishing the player or their choice. | App home, “Why Zcash” | Design intention only; no live round or chain retrieval | Corrected to a design statement with a mined-height anchor |
| Shielded transfers do not publish sender identities. | App home | Too absolute; wallet servers, timing and IP can still correlate | Corrected to “sender addresses in the ordinary transparent way” |
| Practice and testnet use the same commitment logic. | Submission draft | Same commit-then-reveal pattern, but different domain-separated preimages | Corrected to “same commit-then-reveal pattern” |
| “Private” receipts are encrypted or readable only by their owner. | README, submission draft, UI | Receipts contain the secret in plaintext; anyone holding one can read the move | Clarified as keep-private, unencrypted files |
| Practice moves never leave the browser. | App home | A downloaded receipt leaves browser memory for a local file | Corrected to “stay in this browser unless you save a receipt” |
| “Anonymous move commitment” heading. | Protocol | One-round tag is pseudonymous, not proof of anonymity | Corrected to “One-round move commitment” |
| “Chain timing decides validity.” | App fair-play card | Mined heights decide protocol validity, but the checker trusts supplied records | Corrected to “Mined heights decide validity” |
| “Leave no trail.” | App hero | Absolute privacy tagline; the page itself says it does not promise invisibility | Corrected to “Keep it hidden” |
| “Nobody can read or change it.” | App rules card | Overbroad; the commitment is computationally hiding and binding | Corrected to “hides your choice and cannot be changed without breaking the hash” |
| Testnet TAZ has no real-world value. | TestnetLab warning | Not guaranteed; testnet coins should still be treated as test-only | Corrected to “Use testnet TAZ only; never send mainnet ZEC” |
| The checker “recomputes anchors.” | README, submission draft | It validates anchor records and heights; it recomputes commitments and the winner | Corrected to “checks the anchor” |
| The video is hosted on the website. | Release plan | Video will be posted on YouTube | Corrected: external YouTube link only; no embed or YouTube scripts |
| A future testnet round will use a dedicated shielded address and fixed-value transactions. | App privacy section | Design plan, not a demonstrated round | Allowed only in future tense |
| The audit sample is fabricated and is not chain evidence. | Examples README, submission draft | Explicit sample label; deterministic fabricated records | Supported and must stay explicit |

## Corrections applied in this pass

- `README.md`: added “prototype,” clarified that receipts are unencrypted and
  keep-private, changed “recomputes anchors” to “checks the anchor,” marked
  reveal verification as browser-side, added the YouTube external-link note and
  linked this review.
- `docs/SUBMISSION-DRAFT.md`: added the prototype qualifier, changed the
  commitment comparison to the shared commit-then-reveal pattern, clarified
  unencrypted receipts, changed the checker wording, added the application-level
  privacy qualifier, added YouTube hosting and video claims guardrails, and added
  the final-review status.
- `docs/PROTOCOL.md`: renamed “Anonymous move commitment” to “One-round move
  commitment.”
- `docs/RELEASE-CHECKLIST.md`: split claims review into first and final passes,
  linked this document, and tightened the safe-claim wording.
- `src/App.tsx`: replaced “Leave no trail” with “Keep it hidden,” replaced the
  absolute “Nobody can read or change it,” softened the chain/sender claims,
  corrected “practice moves never leave this browser,” changed “Chain timing” to
  “Mined heights,” and clarified keep-private receipts.
- `src/components/TestnetLab.tsx`: replaced “no real-world value” with “Use
  testnet TAZ only; never send mainnet ZEC.”
- `index.html`: described the project as a prototype with a browser practice
  round.

## Video and YouTube guardrails

Required on screen or in narration:

- “Browser practice, not chain evidence.”
- “The wallet signs; the site never sees keys.”
- “The audit sample is fabricated.”
- “Browser-side verification, not on-chain verification.”

Do not say or imply:

- anonymous, untraceable, metadata-free, trustless, production-ready or audited;
- a live round was completed;
- a transaction was sent, mined or confirmed;
- the checker proves completeness or independent chain truth.

Do not show:

- private receipt contents, secrets or downloaded receipt files;
- wallet balances, recovery phrases, spending keys or viewing keys;
- a mainnet address, a funded wallet address, or a testnet address you do not
  want public;
- a wallet signing or sending a transaction;
- the testnet lab as if it were a live round.

YouTube publishing rules:

- The video is an external link. Do not embed it in the site. The site’s
  `connect-src 'none'` policy and no-remote-media claim must stay true.
- The YouTube title and description must use the same qualifiers as the video.
- If the description mentions the audit sample, it must say the sample is
  fabricated.
- If the video shows the testnet lab, it must say the lab prepares requests and
  does not send them.
- YouTube itself is a third-party service. Viewing the video is subject to
  YouTube’s policies; this does not change the site’s privacy boundary.

## Final pass checklist

Run this after the YouTube upload and final copy are in place.

- [x] Read the final YouTube title, description and chapters. Auto-captions were
  not reviewed.
- [x] Confirm every required qualifier appears in the video or description.
- [x] Confirm no forbidden phrase appears in the video or description.
- [x] Confirm no receipt contents, secrets, keys, balances or real addresses are
  visible.
- [x] Confirm the testnet lab is not presented as a live round.
- [x] Confirm the audit sample is labelled fabricated wherever it appears.
- [x] Add the YouTube URL to `docs/SUBMISSION-DRAFT.md`.
- [x] Re-read the final submission copy against the claim matrix.
- [x] Confirm the canonical URL is `https://veil-vault-game.vercel.app/` in the
  README, submission draft, release checklist, `package.json` and GitHub homepage.
- [x] Confirm the site does not embed YouTube or load YouTube scripts.
- [x] Run `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build` and the sample
  audit.
- [x] Re-check the deployed headers and a practice round.
- [x] Record the final sign-off below.

## Sign-off

| Pass | Date | Result |
| --- | --- | --- |
| First pass, before video | 2026-10-26 | Complete; corrections applied |
| Final pass, after YouTube upload | 2026-10-27 | Complete; video, description and chapters verified |

Platform follow-ups, not claims blockers: the published video still uses the
upload-default title and an auto-generated thumbnail. Apply the title and
`video/out/thumbnail.jpg` from `docs/SUBMISSION-DRAFT.md` when convenient.
