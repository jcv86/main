import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import assert from "node:assert/strict"

const layout = readFileSync("app/layout.tsx", "utf8")
const globals = readFileSync("app/globals.css", "utf8")
const tokens = readFileSync("app/design-system.css", "utf8")
const button = readFileSync("components/ui/button.tsx", "utf8")
const card = readFileSync("components/ui/card.tsx", "utf8")
const input = readFileSync("components/ui/input.tsx", "utf8")

assert.match(layout, /import localFont from "next\/font\/local"/)
assert.match(layout, /const montserrat = localFont\(/)
assert.doesNotMatch(layout, /next\/font\/google/)
assert.doesNotMatch(layout, /\bLora\b/)
assert.match(layout, /import "\.\/design-system\.css"/)
assert.match(layout, /themeColor: "#080B14"/)
assert.deepEqual([...layout.matchAll(/weight: "(\d+)"/g)].map(match => match[1]), ["400", "500", "600", "700"])
assert.deepEqual([...layout.matchAll(/path: "([^\"]+\.woff2)"/g)].map(match => match[1]),
  Array(4).fill("./fonts/montserrat-latin-wght.woff2"))
assert.match(layout, /variable: "--font-montserrat"/)
assert.match(layout, /<html[^>]+montserrat\.variable/)
assert.match(layout, /<body className="font-sans">/)
assert.match(layout, /display: "swap"/)
assert.match(layout, /preload: true/)
assert.doesNotMatch(globals, /fonts\.(?:googleapis|gstatic)\.com/)
assert.doesNotMatch(globals, /font-family:\s*['"]Montserrat['"]/)
assert.doesNotMatch(globals, /\bLora\b|--font-lora/)

// Decode the actual official resource with the same decoder Next uses. A source
// assertion alone would miss a missing file, wrong family, corrupt WOFF2 or subset.
const fontBytes = readFileSync("app/fonts/montserrat-latin-wght.woff2")
assert.equal(fontBytes.subarray(0, 4).toString("ascii"), "wOF2")
assert.equal(createHash("sha256").update(fontBytes).digest("hex"),
  "06b16db7a969135d48d38c49183be7fb88d4452e2a3011957c7851941f4e4879")
const require = createRequire(import.meta.url)
const decoderModule = require("next/dist/compiled/@next/font/dist/fontkit").default
const font = (decoderModule.default || decoderModule)(fontBytes)
assert.match(font.familyName, /^Montserrat(?:\s|$)/)
for (const weight of [400, 500, 600, 700]) {
  assert.ok(font.variationAxes.wght.min <= weight && font.variationAxes.wght.max >= weight,
    `Montserrat resource does not support weight ${weight}`)
}
for (const character of "áéíóúüñÁÉÍÓÚÜÑ¿¡€—“”") {
  assert.ok(font.hasGlyphForCodePoint(character.codePointAt(0)), `Missing Spanish glyph: ${character}`)
}
const license = readFileSync("app/fonts/OFL.txt", "utf8")
assert.equal(createHash("sha256").update(license).digest("hex"),
  "8b7141c03fa4f8d44e6345d5d4931709290f0f67875e452e95ac1fd3a027802e")
assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/)
assert.match(license, /Montserrat/)

for (const token of [
  "--dtc-ink-950: #080b14",
  "--dtc-indigo-500: #5c6ff0",
  "--dtc-teal-500: #2faf9e",
  "--dtc-amber-500: #d99b32",
  "--dtc-a1: #9b7cf6",
  "--dtc-a2: #5c6ff0",
  "--dtc-a3: #e7836f",
  "--dtc-a4: #2faf9e",
]) {
  assert.ok(tokens.includes(token), `Missing canonical token: ${token}`)
}

assert.match(tokens, /prefers-reduced-motion: reduce/)
assert.match(tokens, /--purple: 233 82% 65%/)
assert.doesNotMatch(tokens, /--dtc-ink-950:\s*#000000/i)

assert.match(button, /rounded-\[12px\]/)
assert.match(button, /bg-primary/)
assert.doesNotMatch(button, /bg-purple\/80/)
assert.doesNotMatch(button, /rgb\(80,160,170\)/)

assert.match(card, /rounded-\[16px\]/)
assert.match(card, /linear-gradient/)
assert.doesNotMatch(card, /rounded-\[28px\]/)

assert.match(input, /h-11/)
assert.match(input, /rounded-\[12px\]/)
assert.match(input, /focus-visible:ring-ring\/35/)

console.log("DTC design system foundation contract passed")
