import type { VaultId } from '../game.ts'
import './VaultEmblem.css'

export function VaultEmblem({ id }: { id: VaultId }) {
  return <span className={`vault-emblem emblem-${id}`} aria-hidden="true">
    <svg viewBox="0 0 64 64" focusable="false">
      <circle className="emblem-disc" cx="32" cy="32" r="30" />
      <circle className="emblem-ring" cx="32" cy="32" r="29" />
      <circle className="emblem-ring-inner" cx="32" cy="32" r="24" />
      <path className="emblem-tick" d="M32 1v4M32 59v4M1 32h4M59 32h4" />
      {id === 'copper' && <g className="emblem-art">
        <ellipse className="e-dark" cx="32" cy="43" rx="16" ry="6.5" />
        <path className="e-base" d="M16 36c0-3.6 7.2-6.5 16-6.5s16 2.9 16 6.5v7c0 3.6-7.2 6.5-16 6.5s-16-2.9-16-6.5z" />
        <ellipse className="e-light" cx="32" cy="36" rx="16" ry="6.5" />
        <path className="e-dark" d="M21 29c0-2.8 4.9-5 11-5s11 2.2 11 5v5c0 2.8-4.9 5-11 5s-11-2.2-11-5z" />
        <ellipse className="e-light" cx="32" cy="29" rx="11" ry="5" />
        <path className="e-line" d="M32 25.5l3 3.5-3 3.5-3-3.5z" />
      </g>}
      {id === 'moon' && <g className="emblem-art">
        <path className="e-base" d="M32 7l14 10 4 19-9 16-9 5-9-5-9-16 4-19z" />
        <path className="e-light" d="M32 7l14 10-9 9-5-19zM32 7L18 17l9 9 5-19z" />
        <path className="e-dark" d="M32 26l9-9 5 19-9 16-5-26zM32 26l-9-9-5 19 9 16 5-26z" />
        <path className="e-line-soft" d="M32 7v45M18 17l14 9 14-9M23 42l9-16 9 16" />
        <path className="e-light" d="M39 25a8 8 0 1 0 0 15 10 10 0 0 1 0-15z" />
      </g>}
      {id === 'crown' && <g className="emblem-art">
        <circle className="e-dark" cx="32" cy="30" r="14" />
        <path className="e-line-light" d="M32 5v4M8 17l3 3M56 17l-3 3M6 32h4M54 32h4" />
        <path className="e-base" d="M13 45l4-24 10 9 5-15 5 15 10-9 4 24z" />
        <path className="e-light" d="M16 45h32v7H16z" />
        <path className="e-line" d="M21 45l3-17 8 7 8-7 3 17" />
        <circle className="e-line" cx="32" cy="32" r="2.5" />
      </g>}
    </svg>
  </span>
}
