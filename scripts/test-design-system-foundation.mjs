import { readFileSync } from "node:fs"
import assert from "node:assert/strict"

const layout = readFileSync("app/layout.tsx", "utf8")
const tokens = readFileSync("app/design-system.css", "utf8")
const button = readFileSync("components/ui/button.tsx", "utf8")
const card = readFileSync("components/ui/card.tsx", "utf8")
const input = readFileSync("components/ui/input.tsx", "utf8")

assert.match(layout, /import \{ Montserrat \} from "next\/font\/google"/)
assert.doesNotMatch(layout, /\bLora\b/)
assert.match(layout, /import "\.\/design-system\.css"/)
assert.match(layout, /themeColor: "#080B14"/)
assert.match(layout, /weight: \["400", "500", "600", "700"\]/)

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
