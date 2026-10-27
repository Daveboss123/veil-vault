# Veil Vault demo video

Remotion source for the ZECATHON 2026 Wildcard demo.

## Output

- `1920 × 1080`, 30 fps, 2:58
- 5,331 frames / 177.70 seconds
- 11 scenes: cold open, The Veil, rules, practice chamber, briefing, choose,
  seal, reveal, Zcash rail, honesty ledger, call to action
- Mixed narration, soundtrack and UI sound effects in
  `public/audio/soundtrack.mp3`

## Render

From this directory (requires Node 20+, `ffmpeg` and `ffprobe` on `PATH`):

```powershell
npm.cmd install

# Regenerate narration and timing (downloads the Kokoro model on first run)
npm.cmd run voiceover

# Rebuild the mixed soundtrack from voice, music and SFX
npm.cmd run audio

# Render the final MP4
npm.cmd run render
```

Render the YouTube thumbnail:

```powershell
npm.cmd run still
ffmpeg -i out/thumbnail-1080.png -vf scale=1280:720 -q:v 2 out/thumbnail.jpg
```

Preview the composition:

```powershell
npm.cmd run dev
```

Type-check the source:

```powershell
npm.cmd run typecheck
```

Narration uses Kokoro `af_heart` at speed `0.85`. The generator preserves each
scene's existing duration unless the new voice track needs more room, so the
timeline in `src/timeline.json` is authoritative.

## Source map

- `src/timeline.json` — authoritative scene timing and narration text
- `src/voice-manifest.json` — generated narration segment durations
- `src/Video.tsx` — master composition, scene sequencing and global audio
- `src/scenes/` — 11 scene components
- `src/components/` — browser frame, emblems, chrome, panels, stamps and camera
- `src/lib/anim.ts` — springs, ramps, hashes and camera interpolation
- `public/shots/` — captured practice and testnet screenshots
- `public/fonts/` — self-hosted Spectral, Manrope and IBM Plex Mono
- `public/grain/` — generated film-grain overlays
- `public/cta-qr.png` — QR code for the canonical URL

## Claims guardrails

The video is a narrated practice and testnet-lab walkthrough. It must keep these
statements visible or audible:

- “Browser practice, not chain evidence.”
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

- Spectral, Manrope and IBM Plex Mono: SIL Open Font License 1.1,
  self-hosted.
- Character art: generated with Gemini/Nano Banana, processed locally; see
  `../docs/GENERATED-ASSETS.md`.
- Narration generated locally with Kokoro TTS (`af_heart`), then mixed with the
  procedural soundtrack.
- No remote fonts, media CDNs or analytics are used by the video.
