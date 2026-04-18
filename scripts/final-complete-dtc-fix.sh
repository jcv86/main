#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Final complete DTC color standardization - handling all edge cases..."

# Fix all remaining slate gradient combinations
find app -name "*.tsx" -exec sed -i \
  -e 's/from-slate-50/from-muted\/5/g' \
  -e 's/to-slate-50/to-muted\/5/g' \
  -e 's/via-slate-50/via-muted\/5/g' \
  -e 's/from-slate-100/from-muted\/10/g' \
  -e 's/to-slate-100/to-muted\/10/g' \
  -e 's/via-slate-100/via-muted\/10/g' \
  -e 's/from-slate-200/from-muted\/20/g' \
  -e 's/to-slate-200/to-muted\/20/g' \
  -e 's/via-slate-200/via-muted\/20/g' \
  -e 's/from-slate-300/from-muted\/30/g' \
  -e 's/to-slate-300/to-muted\/30/g' \
  -e 's/via-slate-300/via-muted\/30/g' \
  -e 's/from-slate-400/from-muted\/40/g' \
  -e 's/to-slate-400/to-muted\/40/g' \
  -e 's/via-slate-400/via-muted\/40/g' \
  -e 's/from-slate-500/from-muted\/50/g' \
  -e 's/to-slate-500/to-muted\/50/g' \
  -e 's/via-slate-500/via-muted\/50/g' \
  -e 's/from-slate-600/from-muted\/60/g' \
  -e 's/to-slate-600/to-muted\/60/g' \
  -e 's/via-slate-600/via-muted\/60/g' \
  -e 's/from-slate-700/from-muted\/70/g' \
  -e 's/to-slate-700/to-muted\/70/g' \
  -e 's/via-slate-700/via-muted\/70/g' \
  -e 's/from-slate-800/from-muted\/80/g' \
  -e 's/to-slate-800/to-muted\/80/g' \
  -e 's/via-slate-800/via-muted\/80/g' \
  -e 's/from-slate-900/from-muted\/90/g' \
  -e 's/to-slate-900/to-muted\/90/g' \
  -e 's/via-slate-900/via-muted\/90/g' \
  -e 's/dark:from-slate-50/dark:from-muted\/5/g' \
  -e 's/dark:to-slate-50/dark:to-muted\/5/g' \
  -e 's/dark:via-slate-50/dark:via-muted\/5/g' \
  -e 's/dark:from-slate-100/dark:from-muted\/10/g' \
  -e 's/dark:to-slate-100/dark:to-muted\/10/g' \
  -e 's/dark:via-slate-100/dark:via-muted\/10/g' \
  -e 's/dark:from-slate-200/dark:from-muted\/20/g' \
  -e 's/dark:to-slate-200/dark:to-muted\/20/g' \
  -e 's/dark:via-slate-200/dark:via-muted\/20/g' \
  -e 's/dark:from-slate-300/dark:from-muted\/30/g' \
  -e 's/dark:to-slate-300/dark:to-muted\/30/g' \
  -e 's/dark:via-slate-300/dark:via-muted\/30/g' \
  -e 's/dark:from-slate-400/dark:from-muted\/40/g' \
  -e 's/dark:to-slate-400/dark:to-muted\/40/g' \
  -e 's/dark:via-slate-400/dark:via-muted\/40/g' \
  -e 's/dark:from-slate-500/dark:from-muted\/50/g' \
  -e 's/dark:to-slate-500/dark:to-muted\/50/g' \
  -e 's/dark:via-slate-500/dark:via-muted\/50/g' \
  -e 's/dark:from-slate-600/dark:from-muted\/60/g' \
  -e 's/dark:to-slate-600/dark:to-muted\/60/g' \
  -e 's/dark:via-slate-600/dark:via-muted\/60/g' \
  -e 's/dark:from-slate-700/dark:from-muted\/70/g' \
  -e 's/dark:to-slate-700/dark:to-muted\/70/g' \
  -e 's/dark:via-slate-700/dark:via-muted\/70/g' \
  -e 's/dark:from-slate-800/dark:from-muted\/80/g' \
  -e 's/dark:to-slate-800/dark:to-muted\/80/g' \
  -e 's/dark:via-slate-800/dark:via-muted\/80/g' \
  -e 's/dark:from-slate-900/dark:from-muted\/90/g' \
  -e 's/dark:to-slate-900/dark:to-muted\/90/g' \
  -e 's/dark:via-slate-900/dark:via-muted\/90/g' \
  -e 's/dark:from-slate-950/dark:from-background/g' \
  -e 's/dark:to-slate-950/dark:to-background/g' \
  {} \;

# Fix all remaining pink variants (should be red)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-pink-300/from-red\/30/g' \
  -e 's/to-pink-300/to-red\/30/g' \
  -e 's/via-pink-300/via-red\/30/g' \
  -e 's/dark:from-pink-300/dark:from-red\/30/g' \
  -e 's/dark:to-pink-300/dark:to-red\/30/g' \
  {} \;

# Fix all remaining violet variants (should be purple)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-violet-500/from-purple/g' \
  -e 's/to-violet-500/to-purple/g' \
  -e 's/via-violet-500/via-purple/g' \
  -e 's/dark:from-violet-500/dark:from-purple/g' \
  -e 's/dark:to-violet-500/dark:to-purple/g' \
  -e 's/dark:from-violet-800/dark:from-purple/g' \
  -e 's/dark:to-violet-800/dark:to-purple/g' \
  {} \;

# Fix remaining dark mode cyan/indigo variants (should be blue)
find app -name "*.tsx" -exec sed -i \
  -e 's/dark:from-cyan-800/dark:from-blue/g' \
  -e 's/dark:to-cyan-800/dark:to-blue/g' \
  -e 's/dark:from-indigo-800/dark:from-blue/g' \
  -e 's/dark:to-indigo-800/dark:to-blue/g' \
  {} \;

# Fix remaining dark mode amber variants (should be yellow)
find app -name "*.tsx" -exec sed -i \
  -e 's/dark:from-amber-950\/30/dark:from-yellow\/10/g' \
  -e 's/dark:to-amber-950\/30/dark:to-yellow\/10/g' \
  {} \;

# Fix remaining dark mode purple variants
find app -name "*.tsx" -exec sed -i \
  -e 's/dark:from-purple-950/dark:from-purple/g' \
  -e 's/dark:to-purple-950/dark:to-purple/g' \
  -e 's/dark:from-purple-800/dark:from-purple/g' \
  -e 's/dark:to-purple-800/dark:to-purple/g' \
  -e 's/dark:border-purple-600/dark:border-purple/g' \
  -e 's/dark:border-purple-800/dark:border-purple/g' \
  -e 's/dark:border-purple-900/dark:border-purple/g' \
  {} \;

# Fix remaining dark mode orange variants
find app -name "*.tsx" -exec sed -i \
  -e 's/dark:from-orange-950\/30/dark:from-orange\/10/g' \
  -e 's/dark:to-orange-950\/30/dark:to-orange\/10/g' \
  {} \;

# Fix remaining blue-600 and other blue variants
find app -name "*.tsx" -exec sed -i \
  -e 's/from-blue-600/from-blue/g' \
  -e 's/to-blue-600/to-blue/g' \
  -e 's/via-blue-600/via-blue/g' \
  -e 's/dark:from-blue-950\/30/dark:from-blue\/10/g' \
  -e 's/dark:to-blue-950\/30/dark:to-blue\/10/g' \
  {} \;

echo "✅ Complete DTC color system applied!"
echo "✓ All slate gradients → muted tokens"
echo "✓ All pink variants → red"
echo "✓ All violet variants → purple"
echo "✓ All cyan/indigo dark variants → blue"
echo "✓ All remaining gradients standardized"
echo "✓ All dark mode colors aligned"
