# Veil Vault demo video

Remotion source for the ZECATHON 2026 Wildcard demo.

## Output

- `1920 × 1080`, 30 fps, 174.03 s (5,221 frames)
- 11 scenes: cold open, The Veil, rules, practice chamber, briefing, choose,
  seal, reveal, Zcash rail, honesty ledger, call to action
- Mixed narration, soundtrack and UI sound effects in
  `public/audio/soundtrack.mp3`

## Render

From this directory:

```powershell
npm.cmd install
npx.cmd remotion render VeilVaultDemo out/veil-vault-demo.mp4 `
  --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=4
```

Preview the composition:

```powershell
npx.cmd remotion studio
```

Type-check the source:

```powershell
npx.cmd tsc --noEmit
```

## Source map

- `src/timeline.json` — authoritative scene timing and narration text
- `src/voice-manifest.json` — generated narration segment durations
- `src/Video.tsx` — master composition, scene sequencing and global audio
- `src/scenes/` — 11 scene components
- `src/components/` — browser frame, emblems, chrome, panels, stamps and camera
- `src/lib/anim.ts` — springs, ramps, hashes and camera interpolation
- `public/shots/` — captured practice and testnet screenshots
- `public/fonts/` — self-hosted Jacquard 24 and Silkscreen
- `public/grain/` — generated film-grain overlays
- `public/cta-qr.png` — QR code for the canonical URL

## Claims guardrails

The video is a narrated practice and testnet-lab walkthrough. It must keep these
statements visible or audible:

- “Browser practice, not chain evidence.”
- “No live testnet round has been run.”
- “The wallet signs; the site never sees keys.”
- “The audit sample is fabricated.”
- “Browser-side verification, not on-chain verification.”

It must not show the captured private receipt, keys, balances, funded or mainnet
addresses, or a wallet signing or sending a transaction.

The `seal` scene deliberately crops `sealed-tall.png` above the private-receipt
panel (bottom of the camera focus ≤ 880 px). The committed screenshot has that
panel redacted, so the repository does not carry the captured receipt. The
separate choice/salt/hash explainer uses synthetic illustrative values, not the
captured receipt. Keep that crop, redaction and distinction in place.

## Assets and licences

- Jacquard 24 and Silkscreen: SIL Open Font License 1.1, self-hosted.
- Character art: generated with Gemini/Nano Banana, processed locally; see
  `../docs/GENERATED-ASSETS.md`.
- Narration generated with `msedge-tts` (`en-US-ChristopherNeural`), then mixed
  locally with the procedural soundtrack.
- No remote fonts, media CDNs or analytics are used by the video.
