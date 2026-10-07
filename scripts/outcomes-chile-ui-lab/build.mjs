import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

export const repository = process.cwd()
export const labOrigin = 'http://127.0.0.1:3147'
export const labUrl = labOrigin + '/despega/resultados-laborales'
export const requireApp = createRequire(join(repository, 'package.json'))
const requireTools = process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
  ? createRequire(join(resolve(process.env.DTC_OUTCOMES_UI_TOOLS_ROOT), 'package.json')) : requireApp

export function loadTool(name) {
  for (const loader of [requireTools, requireApp]) {
    try { return loader(name) } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error }
  }
  if (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) {
    const runtime = createRequire(join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '..', 'package.json'))
    return runtime(name)
  }
  throw new Error(`Install the laboratory tool ${name} outside the application and set DTC_OUTCOMES_UI_TOOLS_ROOT.`)
}

function hash(path) { return createHash('sha256').update(readFileSync(join(repository, path))).digest('hex') }

function localFonts() {
  const root = join(repository, '.next/static')
  const cssRoot = join(root, 'css')
  const files = new Map()
  const faces = new Set()
  if (existsSync(cssRoot)) {
    for (const path of readdirSync(cssRoot, { recursive: true }).filter((path) => String(path).endsWith('.css'))) {
      const css = readFileSync(join(cssRoot, String(path)), 'utf8')
      for (const match of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
        const face = match[0]
        if (!/font-family\s*:[^;]*Montserrat/.test(face)) continue
        const source = /url\(["']?(\/_next\/static\/media\/[\w.-]+\.woff2)["']?\)/.exec(face)?.[1]
        if (!source) continue
        const asset = join(repository, '.next', source.slice('/_next/'.length))
        if (!existsSync(asset)) continue
        files.set(source, readFileSync(asset))
        faces.add(face.replace(/font-family\s*:[^;]+;/, 'font-family:Montserrat;'))
      }
    }
  }
  return { files, css: [...faces].join('\n'), mode: files.size ? 'Montserrat-from-local-Next-build' : 'Arial-system-fallback' }
}

export async function buildUi() {
  const requireTsx = createRequire(requireApp.resolve('tsx/package.json'))
  const esbuild = requireTsx('esbuild')
  const postcss = requireApp('postcss')
  const loadConfig = requireApp('tailwindcss/loadConfig')
  const config = loadConfig(join(repository, 'tailwind.config.ts'))
  config.content = [
    join(repository, 'components/**/*.{js,ts,jsx,tsx,mdx}'),
    join(repository, 'app/**/*.{js,ts,jsx,tsx,mdx}'),
    join(repository, 'scripts/outcomes-chile-ui-lab/browser-entry.tsx'),
  ]
  const styles = []
  // Preserve the root layout's stylesheet order, including its final DTC tokens.
  for (const path of ['app/globals.css', 'app/design-system.css']) {
    const source = readFileSync(join(repository, path), 'utf8')
      .replace(/^@import\s+url\(['"]?https?:\/\/[^)]+\);\s*$/gm, '')
    const css = await postcss([
      requireApp('tailwindcss/nesting')(),
      requireApp('tailwindcss')(config),
      requireApp('autoprefixer')(),
    ]).process(source, { from: join(repository, path) })
    styles.push(css.css)
  }
  const fonts = localFonts()
  const bundle = await esbuild.build({
    absWorkingDir: repository,
    entryPoints: ['scripts/outcomes-chile-ui-lab/browser-entry.tsx'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    jsx: 'automatic',
    tsconfig: join(repository, 'tsconfig.json'),
    define: { 'process.env.NODE_ENV': '"development"', 'process.env': '{}' },
    sourcemap: 'inline',
    logLevel: 'silent',
    plugins: [{
      name: 'no-server-dependencies-in-ui-laboratory',
      setup(build) {
        build.onResolve({ filter: /^(server-only|next\/headers|@\/lib\/supabase\/server)$/ }, (args) => ({
          errors: [{ text: `Client experience imported server boundary: ${args.path}` }],
        }))
      },
    }],
  })
  assert.equal(bundle.outputFiles.length, 1)
  return {
    javascript: bundle.outputFiles[0].text,
    css: [...styles, fonts.css].join('\n'),
    fontFiles: fonts.files,
    fontMode: fonts.mode,
    html: `<!doctype html><html lang="es" class="dark" style="--font-montserrat:${fonts.files.size ? 'Montserrat' : 'Arial'};--font-lora:Georgia"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DTC · laboratorio sintético de resultados laborales</title><link rel="stylesheet" href="/lab.css"></head><body><div id="root"></div><script src="/lab.js"></script></body></html>`,
    sourceHashes: Object.fromEntries([
      ...readdirSync(join(repository, 'components/outcomes-chile')).filter((path) => /\.(ts|tsx)$/.test(path)).map((path) => `components/outcomes-chile/${path}`),
      'app/globals.css', 'app/design-system.css', 'tailwind.config.ts', 'lib/outcomes-chile/impact.ts', 'lib/outcomes-chile/workspace.ts',
    ].map((path) => [path, hash(path)])),
    versions: { esbuild: esbuild.version, react: requireApp('react/package.json').version },
  }
}
