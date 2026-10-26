# Veil Vault testnet protocol

Veil Vault is a testnet game prototype. It prepares wallet payment requests and
checks records; it does not custody funds, sign transactions, establish human
identity or guarantee network anonymity.

## Fixed rules

- Four-player maximum.
- Vault scores are Copper 3, Moon 5 and Crown 8.
- A vault scores only when exactly one valid runner reveals it.
- The highest non-zero lone-vault score wins. If every occupied vault collides,
  there is no winner.
- Every protocol payment requests exactly 100,000 zatoshis / 0.001 TAZ, plus the
  wallet fee.
- Testnet only. Mainnet and transparent recipients are refused.

Round rules bind the network, shielded address, title, player limit, block
windows, fixed payment and scoring rule. Their exact UTF-8 SHA-256 preimage is:

```text
["VEIL-VAULT-RULES-v1",version,roundId,network,address,title,playerLimit,startHeight,commitDeadlineHeight,revealDeadlineHeight,submissionZatoshis,scoring]
```

## Anonymous move commitment

Each private receipt creates a fresh random 8-byte runner tag and random 32-byte
secret. The tag exists for one round and is not a name or account.

```text
["VEIL-VAULT-CHAIN-MOVE-v1",rulesHash,roundId,runnerTag,vaultId,salt]
```

The commitment is SHA-256 of that JSON array. The random secret is essential:
without it, anyone could guess all three possible vaults.

## Memo formats

All fields are lowercase hexadecimal except the one-character vault code.

```text
VV1A <16-hex round ID> <64-hex rules hash>
VV1C <16-hex round ID> <64-hex rules hash> <64-hex commitment>
VV1R <16-hex round ID> <64-hex rules hash> <16-hex runner tag> <c|m|s> <64-hex secret>
```

`c`, `m` and `s` mean Copper Cache, Moon Archive and Sun Crown. Every memo fits
well within the 512-byte shielded memo field.

The app encodes these memos in ZIP-321 payment requests using unpadded base64url.
The QR code is only a request. The wallet remains responsible for reviewing,
signing, sending and paying its fee.

## Windows

- The organizer sends an anchor memo before `startHeight`.
- Commitments are accepted from `startHeight` through
  `commitDeadlineHeight`, inclusive.
- Reveals are accepted after the commitment deadline through
  `revealDeadlineHeight`, inclusive.
- A final result should wait until at least five blocks after the reveal
  deadline. Five blocks are a heuristic, not irreversible finality.

The browser's manually entered height only controls guidance and QR visibility.
The mined transaction heights decide protocol validity.

## Address policy

The browser accepts:

- checksum-valid testnet Sapling addresses beginning `ztestsapling1`;
- checksum-valid ZIP-316 Revision 0 testnet Unified Addresses beginning
  `utest1` only if full F4Jumble parsing finds known shielded receivers and no
  transparent or unsupported items;
- checksum-valid Revision 2 shielded-only Unified Addresses beginning
  `zutest1`, with the same conservative item restrictions.

Mainnet, transparent, mixed transparent Unified Addresses, unknown receiver
types and unsupported metadata are rejected rather than guessed.

## Private and public files

- The round manifest is public and contains no wallet key.
- The private move receipt contains the runner tag, vault and random secret.
  Anyone holding it can read and reveal the move. Never publish it.
- Neither file proves a transaction was sent or mined.
- Never import a recovery phrase, spending key, full viewing key, wallet
  database or unrelated personal file.

## Supplied-record checking

`npm.cmd run audit -- <bundle.json> [winner-tag|none]` checks a public bundle
without a network connection. It requires:

- a complete bundle with a valid manifest fingerprint;
- a declared tip at least five blocks after the reveal deadline, with no record
  above that tip;
- unique transaction IDs, the exact round recipient, fixed 100,000-zatoshi value
  and a shielded source;
- well-formed memos for the same round and rules fingerprint;
- an anchor mined before the start height, commitments inside the selection
  window and reveals inside the reveal window;
- no more distinct commitments than the player limit;
- every reveal recomputing to an on-time commitment;
- an optional announced winner tag that matches the recomputed outcome.

Passing means the supplied file is internally consistent. It does not prove the
file is complete or that any transaction exists on chain. Independent chain
retrieval is a separate, stronger claim.

## Remaining limits

- One runner can create multiple tags; human uniqueness is not proven.
- An uninvited transaction can deny service if the protocol treats excess
  commitments as invalidating the round.
- Collusion and out-of-band coordination remain possible.
- Reveals intentionally disclose all played vaults after selection.
- Wallet servers, IP addresses, transaction timing and outside information can
  provide identifying clues.
- A supplied JSON record can be internally consistent while omitting chain
  activity. Independent chain retrieval is a separate, stronger claim.
