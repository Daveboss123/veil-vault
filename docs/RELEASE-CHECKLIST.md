# Veil Vault release checklist

Last reviewed: 2026-10-26. Keep unchecked items unchecked until there is evidence.

## Verified in this repository

- [x] Practice round: briefing, rival intel, vault choice, sealed commitments,
  reveal checks, scoring and forged-winner rejection.
- [x] Runner's Field Guide, Fair Play page and persistent first-night prompt.
- [x] Locally hosted fonts, procedural audio and local character art.
- [x] Sealed phase exposes a public commitment QR and an explicit private
  practice-receipt download.
- [x] Testnet lab is a judge-facing appendix linked from “Why Zcash,” not part of
  the main navigation or player flow.
- [x] Browser-verified sealed QR card, private-receipt download, judge appendix
  link, clean console, same-origin requests and no cookies or browser storage.
- [x] Testnet round files, private receipts, ZIP-321 requests and local QR codes.
- [x] Shielded testnet address validation, including F4Jumble parsing for
  shielded-only Unified Addresses.
- [x] Supplied-record checker and a clearly labelled fabricated sample bundle.
- [x] Automated tests, lint and production build pass on Windows.
- [x] Production CSP sets `connect-src 'none'`; no analytics, cookies, browser
  storage, wallet relay or remote assets. `public/_headers` and `vercel.json`
  carry the same critical policy.
- [x] MIT licence and font licence files are present.
- [x] Generated-art provenance is documented.

## Required before public submission

- [x] **Eligibility:** organizers confirmed Veil Vault may be submitted under a
  separate ZECATHON account. Keep the written confirmation with the submission.
- [x] **Repository:** public at https://github.com/Daveboss123/veil-vault
  (created 2026-10-26). `art-source/inbox/*.jpg` and all `PRIVATE-*.json` files
  are confirmed ignored and untracked; no secrets, source maps or high-resolution
  originals are tracked.
- [x] **Deployment:** production build published at
  https://veil-vault-lovat.vercel.app/ (Vercel project `veil-vault`, DAVE team,
  linked to GitHub `main`). Release commit `2476c625845f1518b44d6740b9353ab39a8056cf`
  built as `dpl_D8mukboHL9y7THPCvjok3tMD6a9Y`; later docs-only commits auto-deploy
  from `main`. Deployment protection is disabled so judges can open the site
  without logging in.
- [x] **Header check:** `curl.exe -I https://veil-vault-lovat.vercel.app/` on
  2026-10-26 returned CSP with `connect-src 'none'`, `Referrer-Policy:
  no-referrer`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Permissions-Policy`, HSTS, COOP and CORP.
- [x] **Build audit:** inspected `dist/` and the deployed network panel. No source
  maps, private receipts, high-resolution art originals or unexpected requests
  are present. Browser run showed a clean console, same-origin requests only, and
  no cookies or browser storage.
- [ ] **Video:** record a two-minute demo using the outline in
  `docs/SUBMISSION-DRAFT.md`. Keep the practice/testnet distinction explicit.
- [ ] **Submission copy:** fill every placeholder in the draft, including the
  video URL. Public and repository URLs are filled.
- [ ] **Claims review:** read the final text against the policy below.

## Live testnet round — only with explicit approval

A live round has **not** been run. Do not claim one until every item below is
complete and independently checked.

- [ ] Obtain explicit user approval and a dedicated testnet wallet.
- [ ] Never ask for or handle a recovery phrase, spending key or full viewing key.
- [ ] Fund the wallet with testnet TAZ only.
- [ ] Choose current testnet heights and create the public round file.
- [ ] Send the anchor before the start height and confirm its mined height.
- [ ] Collect on-time commitments from four distinct runners.
- [ ] Send reveals only inside the reveal window.
- [ ] Wait at least five blocks after the reveal deadline.
- [ ] Export the supplied-record bundle and run `npm.cmd run audit -- <file>`.
- [ ] Independently check every transaction ID and height with a block explorer
  or a trusted Zcash node. Do not rely on the supplied JSON alone.
- [ ] Record the round ID, rules hash, address, txids, heights and audit output.
- [ ] Publish the round only if the complete evidence is available.

## Evidence record for a real round

Fill this only after a real round. Leave it blank otherwise.

| Item | Value |
| --- | --- |
| Round ID | |
| Rules hash | |
| Shielded testnet address | |
| Anchor txid / height | |
| Commitment txids / heights | |
| Reveal txids / heights | |
| Tip height at audit | |
| Audit command and result | |
| Independent explorer links | |
| Announced winner tag | |

## Claims policy

Safe to claim now:

- Veil Vault is a playable browser practice game with real commitment and scoring
  logic.
- The testnet lab prepares shielded wallet requests, private receipts and local
  QR codes.
- The supplied-record checker recomputes internal consistency without uploading
  the file.
- Privacy hardening blocks network clients, cookies, browser storage and remote
  assets in the application.

Not safe to claim without new evidence:

- A live testnet round was completed.
- Any transaction was sent, mined or confirmed.
- The game is anonymous or metadata-free.
- Player uniqueness, sybil resistance or collusion resistance is solved.
- The supplied-record checker proves completeness or independent chain truth.
- The project is production-ready or audited.

## Final commands

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run audit -- docs/examples/supplied-records-SAMPLE.json
```

The first three must pass before every release. The sample audit should report a
Moon winner with tag `00b14f39ac806af0`, four commitments, four reveals and no
rejected records.
