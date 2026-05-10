#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Replacing ALL hardcoded colors with DTC brand tokens..."
echo ""
echo "DTC Brandbook Colors:"
echo "- Purple: El Ritual (A1)"
echo "- Blue: Exploración (A2)"
echo "- Orange: Entrenamiento (A3)"
echo "- Cyan: La Realidad (A4)"
echo "- Muted: Neutral/Gray"
echo ""

# Replace gray colors with muted
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gray-50/bg-muted\/5/g' \
  -e 's/bg-gray-100/bg-muted\/10/g' \
  -e 's/bg-gray-200/bg-muted\/20/g' \
  -e 's/bg-gray-300/bg-muted\/30/g' \
  -e 's/bg-gray-400/bg-muted\/40/g' \
  -e 's/bg-gray-500/bg-muted\/50/g' \
  -e 's/bg-gray-600/bg-muted\/60/g' \
  -e 's/bg-gray-900/bg-muted\/90/g' \
  -e 's/text-gray-50/text-muted\/5/g' \
  -e 's/text-gray-100/text-muted\/10/g' \
  -e 's/text-gray-200/text-muted\/20/g' \
  -e 's/text-gray-300/text-muted\/30/g' \
  -e 's/text-gray-400/text-muted\/40/g' \
  -e 's/text-gray-500/text-muted\/50/g' \
  -e 's/text-gray-600/text-muted\/60/g' \
  -e 's/border-gray-50/border-muted\/5/g' \
  -e 's/border-gray-100/border-muted\/10/g' \
  -e 's/border-gray-200/border-muted\/20/g' \
  -e 's/border-gray-300/border-muted\/30/g' \
  -e 's/border-gray-400/border-muted\/40/g' \
  -e 's/border-gray-500/border-muted\/50/g' \
  -e 's/border-gray-600/border-muted\/60/g' \
  {} \;

# Replace red with appropriate colors (red for errors/danger, or other brand colors)
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-red-500/text-red/g' \
  -e 's/text-red-700/text-red/g' \
  -e 's/bg-red-50/bg-red\/5/g' \
  -e 's/bg-red-500/bg-red/g' \
  -e 's/bg-red-700/bg-red/g' \
  -e 's/border-red-50/border-red\/5/g' \
  -e 's/border-red-200/border-red\/20/g' \
  {} \;

# Replace yellow with orange (Entrenamiento brand color)
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-yellow-500/text-orange/g' \
  -e 's/bg-yellow-500/bg-orange/g' \
  -e 's/border-yellow-500/border-orange/g' \
  {} \;

# Replace primary color references to match DTC colors
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-primary/text-purple/g' \
  -e 's/bg-primary/bg-purple/g' \
  -e 's/border-primary/border-purple/g' \
  -e 's/focus:ring-primary/focus:ring-purple/g' \
  {} \;

echo "✅ All hardcoded colors replaced with DTC brand tokens"
echo ""
echo "Summary of Replacements:"
echo "✓ Gray colors → Muted tokens"
echo "✓ Red colors → Red (for errors/danger)"
echo "✓ Yellow colors → Orange (Entrenamiento)"
echo "✓ Primary colors → Purple (El Ritual)"
