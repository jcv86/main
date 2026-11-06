/** One version-pinned driver adjustment, confined to the disposable runner tools. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

const version = '1.56.1'
// The published playwright-core@1.56.1 package, installed with npm integrity verification.
const originalSha256 = '79a25e4eac0d0fa97dcc6eae4edce83436bcdb4bb1322731f65610adaa8e150f'
const npmIntegrity = 'sha512-hutraynyn31F+Bifme+Ps9Vq59hKuUCz7H1kDOcBs+2oGguKkWTU50bBWrtz34OUWmIwpBTWDxaRPXrIXkgvmQ=='
const original = 'this._client.send("Emulation.setFocusEmulationEnabled", { enabled: true })'
const modified = 'this._client.send("Emulation.setFocusEmulationEnabled", { enabled: process.env.DTC_NATIVE_TAB_FOCUS !== "yes" })'
const environmentFlag = { name: 'DTC_NATIVE_TAB_FOCUS', nativeValue: 'yes', defaultEnabled: true }
const hash = source => createHash('sha256').update(source).digest('hex')
const count = (source, needle) => source.split(needle).length - 1

function location() {
  assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Explicit disposable browser lab opt-in required')
  assert.ok(process.env.RUNNER_TEMP && process.env.A1_TOOLS_ROOT, 'Runner temporary storage and isolated browser tools are required')
  const temporary = realpathSync(resolve(process.env.RUNNER_TEMP))
  const toolsRoot = realpathSync(resolve(process.env.A1_TOOLS_ROOT))
  assert.ok(toolsRoot.startsWith(temporary + sep), 'The adapter may only change isolated tools inside RUNNER_TEMP')
  const requireTools = createRequire(join(toolsRoot, 'package.json'))
  const packagePaths = ['playwright', 'playwright-core'].map(name => realpathSync(requireTools.resolve(`${name}/package.json`)))
  for (const file of packagePaths) {
    assert.ok(file.startsWith(toolsRoot + sep), 'Shared or global Playwright installations are forbidden')
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).version, version, 'Only the exact pinned Playwright version may be adjusted')
  }
  const adapterFile = realpathSync(join(dirname(packagePaths[1]), 'lib/server/chromium/crPage.js'))
  assert.ok(adapterFile.startsWith(toolsRoot + sep), 'The Chromium adapter must be inside the isolated tools')
  assert.ok(lstatSync(adapterFile).isFile() && lstatSync(adapterFile).nlink === 1, 'The isolated adapter must be an ordinary, unshared file')
  const lock = JSON.parse(readFileSync(join(toolsRoot, 'package-lock.json'), 'utf8'))
  const core = lock.packages?.[relative(toolsRoot, dirname(packagePaths[1])).split(sep).join('/')]
  assert.equal(core?.version, version)
  assert.equal(core?.integrity, npmIntegrity, 'The package lock must identify the pinned npm distribution')
  const evidenceDirectory = join(temporary, 'dtc-a2-swarm-evidence')
  if (existsSync(evidenceDirectory)) assert.equal(realpathSync(evidenceDirectory), evidenceDirectory, 'Evidence cannot follow an external symlink')
  if (process.env.A1_LAB_ROOT) {
    const requested = resolve(process.env.A1_LAB_ROOT)
    const labRoot = existsSync(requested) ? realpathSync(requested) : requested
    assert.ok(evidenceDirectory !== labRoot && !evidenceDirectory.startsWith(labRoot + sep), 'Driver evidence must remain outside the application lab')
  }
  return { adapterFile, evidenceDirectory, manifestFile: join(evidenceDirectory, 'native-tab-focus-adapter.json'),
    adapter: relative(toolsRoot, adapterFile).split(sep).join('/') }
}

function validateModified(source) {
  assert.equal(count(source, original), 0)
  assert.equal(count(source, modified), 1, 'Exactly one original-session focus override must be conditional')
  assert.equal(count(source, 'Emulation.setFocusEmulationEnabled'), 1)
  assert.equal(hash(source.replace(modified, original)), originalSha256, 'Reversing the single expression must recover the exact published adapter')
}

/** Read-only guard used before launching each native-focus browser process. */
export function assertNativeTabFocusAdapter() {
  assert.equal(process.env.DTC_NATIVE_TAB_FOCUS, 'yes', 'Native tab focus must be explicitly enabled for this browser phase')
  const files = location()
  const source = readFileSync(files.adapterFile, 'utf8')
  validateModified(source)
  const manifest = JSON.parse(readFileSync(files.manifestFile, 'utf8'))
  assert.equal(manifest.suite, 'native-tab-focus-adapter')
  assert.equal(manifest.version, 1)
  assert.equal(manifest.status, 'PASS')
  assert.equal(manifest.playwrightVersion, version)
  assert.equal(manifest.playwrightCoreVersion, version)
  assert.equal(manifest.adapter, files.adapter)
  assert.equal(manifest.npmIntegrity, npmIntegrity)
  assert.equal(manifest.originalSha256, originalSha256)
  assert.equal(manifest.modifiedSha256, hash(source))
  assert.equal(manifest.replacements, 1)
  assert.deepEqual(manifest.environmentFlag, environmentFlag)
  assert.equal(manifest.sourceCommit, process.env.A1_SOURCE_COMMIT || null)
  return manifest
}

function prepare() {
  const files = location()
  const source = readFileSync(files.adapterFile, 'utf8')
  assert.equal(hash(source), originalSha256, 'Refuse to modify an unexpected or already modified Chromium adapter')
  assert.equal(count(source, original), 1)
  assert.equal(count(source, 'Emulation.setFocusEmulationEnabled'), 1)
  const result = source.replace(original, modified)
  validateModified(result)
  writeFileSync(files.adapterFile, result)
  assert.equal(hash(readFileSync(files.adapterFile)), hash(result))
  const manifest = { suite: 'native-tab-focus-adapter', version: 1, status: 'PASS',
    sourceCommit: process.env.A1_SOURCE_COMMIT || null, preparedAt: new Date().toISOString(),
    scope: 'disposable-runner-tools-only', playwrightVersion: version, playwrightCoreVersion: version,
    adapter: files.adapter, npmIntegrity, originalSha256, modifiedSha256: hash(result),
    replacements: 1, environmentFlag }
  mkdirSync(files.evidenceDirectory, { recursive: true })
  writeFileSync(files.manifestFile, JSON.stringify(manifest, null, 2) + '\n')
  console.log(JSON.stringify({ suite: manifest.suite, status: 'PASS', playwrightVersion: version,
    replacements: 1, originalSha256, modifiedSha256: manifest.modifiedSha256, evidence: 'native-tab-focus-adapter.json' }))
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) prepare()
