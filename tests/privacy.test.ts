import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(target) : [target]
  }))).flat()
}

test('application source has no network or browser-storage client', async () => {
  const files = (await filesUnder('src')).filter((file) => /\.(?:ts|tsx|css)$/.test(file))
  const source = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n')
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon', 'localStorage', 'sessionStorage', 'indexedDB', 'document.cookie']) {
    assert.equal(source.includes(forbidden), false, `Unexpected client capability: ${forbidden}`)
  }
  assert.equal(/https?:\/\//.test(source), false, 'Application source must not reference remote HTTP resources.')
})

test('production policy blocks connections and referrers', async () => {
  const html = await readFile('index.html', 'utf8')
  const headers = await readFile('public/_headers', 'utf8')
  assert.match(html, /connect-src 'none'/)
  assert.match(html, /name="referrer" content="no-referrer"/)
  assert.match(headers, /connect-src 'none'/)
  assert.match(headers, /frame-ancestors 'none'/)
  assert.match(headers, /Permissions-Policy: camera=\(\), microphone=\(\)/)
})

test('public artwork contains derivatives only', async () => {
  const publicFiles = await filesUnder('public')
  assert.equal(publicFiles.some((file) => /(?:inbox|art-source|\.png\.jpg$)/i.test(file)), false)
  const art = publicFiles.filter((file) => file.includes(`${path.sep}art${path.sep}`))
  assert.equal(art.length, 5)
  assert.equal(art.every((file) => file.endsWith('.webp')), true)
})
