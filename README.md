# Veil Vault

Veil Vault is a one-round shielded bluffing game. Four runners secretly choose
among three vaults worth 3, 5 or 8 relics. A lone runner claims a vault; two or
more runners at the same door trigger its alarm and score nothing.

Built as a separate project for the **ZECATHON 2026 Wildcard** track.

## Current state

The playable practice round runs entirely in the browser:

- the player and three simulated rivals choose a vault;
- a mission briefing and optional rival-intelligence panel explain the stakes;
- separate Runner's Field Guide and Fair Play pages explain the complete game,
  worked examples, commitments and privacy boundaries in plain language;
- the landing page always shows a first-night guide prompt without recording
  whether a visitor has seen it;
- Fox, Moth and Rook use distinct documented tendencies, while their exact moves
  remain random and committed before the player chooses;
- each move is bound to a SHA-256 commitment with a random 32-byte salt;
- every reveal is checked against its commitment before scoring;
- the winner is recomputed from the verified reveals;
- a deliberately forged winner is rejected.
- locally bundled Jacquard 24 and Silkscreen fonts provide the indie-game UI;
- optional procedural sound effects and an ambient score use Web Audio and make
  no network requests;
- original vector runner glyphs and the Veyr lore are bundled in the app.
- generated character artwork is locally optimized, metadata-free in production,
  and documented in `docs/GENERATED-ASSETS.md`.
- original SVG ornaments provide Bell Court seals, route marks, keys, moths,
  crowns and ward symbols throughout the interface.

The testnet lab now implements strict round files, private receipts, ZIP-321
anchor/commit/reveal requests, local QR codes and shielded testnet address
validation. A supplied-record checker recomputes anchors, timing, commitments,
reveals, collisions and winners, but cannot detect records omitted from the file.
The lab does not sign, broadcast, independently scan or confirm transactions.
Practice is not chain evidence, and a complete live testnet round has not been
demonstrated.

## Run locally

Use Node 24 or newer. On Windows:

```powershell
npm.cmd install
npm.cmd run dev
```

Verification:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Check a supplied public record bundle offline:

```powershell
npm.cmd run audit -- supplied-records.json
```

Optionally append an announced one-round winner tag, or `none`, to require that
declaration to match. This is supplied-data checking, not independent chain
retrieval.

## Privacy boundaries

- Practice choices and secrets are held in React memory and disappear on refresh.
- The site has no accounts, analytics, remote fonts, wallet relay or mainnet flow.
- Fonts, character vectors and audio are local; no media CDN is contacted.
- Production CSP sets `connect-src 'none'`; automated privacy tests reject
  network-client or browser-storage APIs in application source.
- A future testnet game will intentionally reveal moves after the selection phase.
- Shielded transactions do not eliminate network, timing, wallet-server or
  outside-information risks.
- Never enter a wallet recovery phrase or spending key into this app.

## Game commitment

The exact commitment preimage is a UTF-8 encoded JSON array:

```text
["VEIL-VAULT-MOVE-v1", roundId, playerId, vaultId, salt]
```

`salt` is 32 cryptographically random bytes and the commitment is SHA-256 of the
preimage. This hides a three-option move only because the salt is unpredictable.

## Licence

Application code is MIT licensed. See `LICENSE`.

Jacquard 24 and Silkscreen are redistributed under the SIL Open Font License
1.1. Their licence texts are included in `public/fonts/`.

Runtime libraries are React, QRCode and `@noble/hashes`. Generated character
art provenance is recorded in `docs/GENERATED-ASSETS.md`; protocol details and
privacy limits are in `docs/PROTOCOL.md`.
