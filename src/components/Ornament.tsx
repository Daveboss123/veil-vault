export type OrnamentName = 'bell' | 'moth' | 'key' | 'route' | 'seal' | 'crown'

export function Ornament({ name, className = '' }: { name: OrnamentName; className?: string }) {
  return <svg className={`ornament ornament-${name} ${className}`} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
    {name === 'bell' && <>
      <path d="M48 111h64l-11-17V67c0-17-9-30-21-30S59 50 59 67v27l-11 17zM70 122c2 8 6 12 10 12s8-4 10-12" />
      <path className="ornament-faint" d="M36 101c-11-10-16-22-16-37m104 37c11-10 16-22 16-37M49 41L35 27m76 14 14-14" />
    </>}
    {name === 'moth' && <>
      <path d="M76 57C54 27 25 35 27 67c2 29 23 45 49 34V57zm8 0c22-30 51-22 49 10-2 29-23 45-49 34V57zM76 54h8v67h-8z" />
      <path className="ornament-faint" d="M75 50L58 28m27 22 17-22M42 55l24 27-26 5m78-32-24 27 26 5" />
    </>}
    {name === 'key' && <>
      <circle cx="55" cy="61" r="25" /><circle className="ornament-cut" cx="55" cy="61" r="10" />
      <path d="M73 79l56 56m-23-33 12-12m-1 23 12-12" />
      <path className="ornament-faint" d="M30 31L18 19m67 15 12-12M28 92 16 104" />
    </>}
    {name === 'route' && <>
      <circle cx="31" cy="119" r="11" /><circle cx="81" cy="72" r="13" /><circle cx="132" cy="35" r="9" />
      <path d="M39 111c19-24 26-27 34-31m19-17c12-13 19-17 31-23" />
      <path className="ornament-faint" d="M24 88c24-8 40-8 58 1 18 9 35 8 56-3M45 137c20-17 38-22 56-15" />
    </>}
    {name === 'seal' && <>
      <path d="M80 19l42 24 12 47-31 38H57L26 90l12-47 42-24z" />
      <path d="M80 43l24 14 7 27-18 22H67L49 84l7-27 24-14z" />
      <circle cx="80" cy="76" r="8" /><path d="M80 84v17" />
    </>}
    {name === 'crown' && <>
      <path d="M29 54l31 23 20-48 20 48 31-23-12 68H41L29 54z" />
      <path className="ornament-faint" d="M42 109h77M53 92h54M80 17V6m-55 36-9-8m119 8 9-8" />
    </>}
  </svg>
}
