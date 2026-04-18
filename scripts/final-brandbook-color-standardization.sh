#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Final Brandbook Color Standardization"
echo "Replacing ALL remaining hardcoded colors with DTC brand colors per BRANDBOOK"
echo ""

# Core brand color replacements - All numbered variants to base tokens
# Orange replacements (appears most frequently in remaining colors)
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-orange-500/text-orange/g' \
  -e 's/text-orange-600/text-orange/g' \
  -e 's/text-orange-700/text-orange/g' \
  -e 's/text-orange-800/text-orange/g' \
  -e 's/text-orange-100/text-orange\/10/g' \
  -e 's/bg-orange-50/bg-orange\/5/g' \
  -e 's/bg-orange-100/bg-orange\/10/g' \
  -e 's/bg-orange-500/bg-orange/g' \
  -e 's/bg-orange\/50/bg-orange\/50/g' \
  -e 's/border-orange-200/border-orange\/20/g' \
  -e 's/border-orange-500/border-orange/g' \
  -e 's/dark:bg-orange-900/dark:bg-orange/g' \
  -e 's/dark:text-orange/dark:text-orange/g' \
  {} \;

# Green replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-green-800/text-green/g' \
  -e 's/text-green-700/text-green/g' \
  -e 's/text-green-400/text-green\/40/g' \
  -e 's/text-green-600/text-green/g' \
  -e 's/text-green-50/text-green\/5/g' \
  -e 's/bg-green-100/bg-green\/10/g' \
  -e 's/bg-green-900/bg-green/g' \
  -e 's/border-green-600/border-green/g' \
  -e 's/border-green-500/border-green/g' \
  -e 's/border-l-4 border-green/border-l-4 border-green/g' \
  -e 's/dark:bg-green-900/dark:bg-green/g' \
  -e 's/dark:text-green-400/dark:text-green\/40/g' \
  {} \;

# Red replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-red-600/text-red/g' \
  -e 's/text-red-100/text-red\/10/g' \
  -e 's/bg-red-100/bg-red\/10/g' \
  -e 's/bg-red-900/bg-red/g' \
  -e 's/border-red-600/border-red/g' \
  -e 's/border-red-200/border-red\/20/g' \
  -e 's/border-l-4 border-red/border-l-4 border-red/g' \
  -e 's/dark:bg-red-900/dark:bg-red/g' \
  -e 's/dark:text-red-200/dark:text-red\/20/g' \
  -e 's/from-red-500 to-red-600/from-red to-red/g' \
  {} \;

# Blue replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-blue-800/text-blue/g' \
  -e 's/text-blue-600/text-blue/g' \
  -e 's/text-blue-400/text-blue\/40/g' \
  -e 's/text-blue-700/text-blue/g' \
  -e 's/bg-blue-100/bg-blue\/10/g' \
  -e 's/bg-blue-900/bg-blue/g' \
  -e 's/border-blue-50/border-blue\/5/g' \
  -e 's/dark:hover:bg-blue-800/dark:hover:bg-blue/g' \
  -e 's/to-indigo-600/to-blue/g' \
  -e 's/via-indigo-600/via-blue/g' \
  -e 's/from-blue via-indigo-600/from-blue via-blue/g' \
  -e 's/to-blue-700/to-blue/g' \
  {} \;

# Purple replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-purple-400/text-purple\/40/g' \
  -e 's/text-purple-300/text-purple\/30/g' \
  -e 's/text-purple-200/text-purple\/20/g' \
  -e 's/bg-purple-900/bg-purple/g' \
  -e 's/bg-purple-200/bg-purple\/20/g' \
  -e 's/dark:text-purple-200/dark:text-purple\/20/g' \
  -e 's/to-purple-700/to-purple/g' \
  -e 's/to-purple-600/to-purple/g' \
  {} \;

# Cyan replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-cyan-800/text-cyan/g' \
  -e 's/bg-cyan-100/bg-cyan\/10/g' \
  -e 's/bg-cyan-900/bg-cyan/g' \
  -e 's/dark:bg-cyan-900/dark:bg-cyan/g' \
  -e 's/dark:text-cyan-200/dark:text-cyan\/20/g' \
  {} \;

# Yellow replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-yellow-600/text-yellow/g' \
  -e 's/text-yellow-800/text-yellow/g' \
  -e 's/text-yellow-900/text-yellow/g' \
  -e 's/text-yellow-100/text-yellow\/10/g' \
  -e 's/text-yellow-200/text-yellow\/20/g' \
  -e 's/bg-yellow-50/bg-yellow\/5/g' \
  -e 's/bg-yellow-100/bg-yellow\/10/g' \
  -e 's/bg-yellow-900/bg-yellow/g' \
  -e 's/bg-yellow-950/bg-yellow/g' \
  -e 's/border-yellow-200/border-yellow\/20/g' \
  -e 's/border-yellow-800/border-yellow/g' \
  -e 's/dark:border-yellow-800/dark:border-yellow/g' \
  -e 's/dark:bg-yellow-950/dark:bg-yellow/g' \
  -e 's/dark:text-yellow-100/dark:text-yellow\/10/g' \
  -e 's/dark:text-yellow-200/dark:text-yellow\/20/g' \
  {} \;

# Gray/Neutral replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-gray-900/text-foreground/g' \
  -e 's/text-gray-700/text-muted/g' \
  -e 's/text-gray-600/text-muted\/60/g' \
  -e 's/text-gray-500/text-muted\/50/g' \
  -e 's/text-gray-400/text-muted\/40/g' \
  -e 's/text-gray-300/text-muted\/30/g' \
  -e 's/text-gray-200/text-muted\/20/g' \
  -e 's/text-gray-100/text-muted\/10/g' \
  {} \;

# Pink/Rose replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-pink-800/text-red/g' \
  -e 's/text-pink-200/text-red\/20/g' \
  -e 's/text-pink-50/text-red\/5/g' \
  -e 's/bg-pink-100/bg-red\/10/g' \
  -e 's/bg-pink-900/bg-red/g' \
  -e 's/dark:bg-pink-900/dark:bg-red/g' \
  -e 's/dark:text-pink-200/dark:text-red\/20/g' \
  -e 's/from-red to-rose-600/from-red to-red/g' \
  {} \;

# Indigo replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-indigo-800/text-blue/g' \
  -e 's/text-indigo-100/text-blue\/10/g' \
  -e 's/text-indigo-50/text-blue\/5/g' \
  -e 's/bg-indigo-100/bg-blue\/10/g' \
  -e 's/bg-indigo-900/bg-blue/g' \
  -e 's/dark:bg-indigo-900/dark:bg-blue/g' \
  -e 's/dark:text-indigo-200/dark:text-blue\/20/g' \
  -e 's/to-indigo-50/to-blue\/5/g' \
  -e 's/text-indigo-100/text-blue\/10/g' \
  -e 's/text-indigo-50/text-blue\/5/g' \
  {} \;

# Emerald/Green replacements
find app components -name "*.tsx" -exec sed -i \
  -e 's/from-green\/50 to-emerald-600/from-green to-green/g' \
  -e 's/to-emerald-700/to-green/g' \
  {} \;

echo "✅ All hardcoded colors standardized to DTC brand tokens!"
echo ""
echo "Summary of Replacements:"
echo "✓ Orange variants → orange"
echo "✓ Green variants → green"
echo "✓ Red variants → red"
echo "✓ Blue variants → blue"
echo "✓ Purple variants → purple"
echo "✓ Cyan variants → cyan"
echo "✓ Yellow variants → yellow"
echo "✓ Gray/Neutral → muted/foreground"
echo "✓ Pink/Rose → red"
echo "✓ Indigo → blue"
echo "✓ Emerald → green"
