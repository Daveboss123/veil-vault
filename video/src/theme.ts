export const COLORS = {
  bg: '#0a110c',
  bgDeep: '#060b08',
  panel: '#0f1a12',
  panelRaised: '#142117',
  panelSoft: '#111d15',
  ink: '#f2efe2',
  inkSoft: '#d8d6c8',
  inkDim: '#9aa79c',
  inkMute: '#647168',
  inkFaint: '#3d4b41',
  lime: '#d9ff67',
  limeSoft: '#b9dc53',
  limeDeep: '#7e9c2c',
  copper: '#d18a67',
  copperDeep: '#a65d40',
  moon: '#bdcfda',
  moonDeep: '#5f7182',
  crown: '#f1cf6c',
  crownDeep: '#a37d2f',
  alarm: '#ff8064',
  alarmDeep: '#8f2f20',
  amber: '#e5b567',
  cream: '#e7e4d8',
  line: 'rgba(242,239,226,0.16)',
  lineSoft: 'rgba(242,239,226,0.08)',
  lineLime: 'rgba(217,255,103,0.26)',
  black: '#000000',
} as const

export const FONT = {
  display: '"Jacquard24", "Times New Roman", serif',
  pixel: '"Silkscreen", "Courier New", monospace',
  body: '"Silkscreen", "Courier New", monospace',
} as const

export const VAULTS = {
  copper: {
    id: 'copper',
    name: 'Copper Cache',
    short: 'Copper',
    value: 3,
    line: 'Modest prize. Quiet corridor.',
    accent: COLORS.copper,
    deep: COLORS.copperDeep,
  },
  moon: {
    id: 'moon',
    name: 'Moon Archive',
    short: 'Moon',
    value: 5,
    line: 'Worth the risk. Two entrances.',
    accent: COLORS.moon,
    deep: COLORS.moonDeep,
  },
  crown: {
    id: 'crown',
    name: 'Sun Crown',
    short: 'Sun Crown',
    value: 8,
    line: 'The great prize. Everyone sees it.',
    accent: COLORS.crown,
    deep: COLORS.crownDeep,
  },
} as const

export type VaultKey = keyof typeof VAULTS

export const CHAPTERS = [
  { id: 'cold-open', label: 'COLD OPEN' },
  { id: 'problem', label: 'THE VEIL' },
  { id: 'rules', label: 'THE RULES' },
  { id: 'chamber', label: 'PRACTICE CHAMBER' },
  { id: 'briefing', label: 'BRIEFING' },
  { id: 'choose', label: 'CHOOSE' },
  { id: 'seal', label: 'SEAL' },
  { id: 'reveal', label: 'REVEAL' },
  { id: 'zcash', label: 'ZCASH RAIL' },
  { id: 'honesty', label: 'HONESTY' },
  { id: 'cta', label: 'PLAY' },
] as const

export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const value = clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
