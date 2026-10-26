import { readFile } from 'node:fs/promises'
import { auditSuppliedRecords } from './src/audit.ts'

const [, , filename, declared] = process.argv
if (!filename) {
  console.error('Usage: node audit.ts supplied-records.json [winner-tag|none]')
  process.exit(2)
}

try {
  const bundle = JSON.parse(await readFile(filename, 'utf8')) as unknown
  const declaredWinner = declared === undefined ? undefined : declared === 'none' ? null : declared
  const result = await auditSuppliedRecords(bundle, declaredWinner)
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Audit failed.')
  process.exit(1)
}
