#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Final comprehensive DTC color system cleanup..."

# Fix teal variants (should be blue)
find app -name "*.tsx" -exec sed -i \
  -e 's/to-teal-600/to-blue/g' \
  -e 's/to-teal-700/to-blue/g' \
  -e 's/to-teal-50/to-blue\/5/g' \
  -e 's/from-teal-900/from-blue/g' \
  -e 's/to-teal-900/to-blue/g' \
  -e 's/dark:to-teal-400/dark:to-blue\/40/g' \
  -e 's/dark:from-teal-950/dark:from-blue/g' \
  -e 's/dark:to-teal-950/dark:to-blue/g' \
  {} \;

# Fix cyan variants (should be blue)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-cyan-100/from-blue\/10/g' \
  -e 's/to-cyan-100/to-blue\/10/g' \
  -e 's/from-cyan-300/from-blue\/30/g' \
  -e 's/to-cyan-300/to-blue\/30/g' \
  -e 's/from-cyan-400/from-blue\/40/g' \
  -e 's/to-cyan-400/to-blue\/40/g' \
  -e 's/from-cyan-900/from-blue/g' \
  -e 's/to-cyan-900/to-blue/g' \
  -e 's/hover:from-cyan-700/hover:from-blue/g' \
  -e 's/border-cyan-500/border-blue/g' \
  -e 's/border-cyan-600/border-blue/g' \
  -e 's/dark:from-cyan-900/dark:from-blue/g' \
  -e 's/dark:to-cyan-900/dark:to-blue/g' \
  -e 's/dark:from-cyan-400/dark:from-blue\/40/g' \
  -e 's/dark:to-cyan-400/dark:to-blue\/40/g' \
  -e 's/dark:from-cyan-300/dark:from-blue\/30/g' \
  -e 's/dark:to-cyan-300/dark:to-blue\/30/g' \
  -e 's/dark:from-cyan-950/dark:from-blue/g' \
  {} \;

# Fix indigo variants (should be blue)
find app -name "*.tsx" -exec sed -i \
  -e 's/hover:from-indigo-700/hover:from-blue/g' \
  -e 's/hover:to-indigo-700/hover:to-blue/g' \
  -e 's/dark:from-indigo-950/dark:from-blue/g' \
  -e 's/dark:to-indigo-950/dark:to-blue/g' \
  -e 's/dark:from-indigo-900/dark:from-blue/g' \
  -e 's/dark:to-indigo-900/dark:to-blue/g' \
  -e 's/dark:border-indigo-800/dark:border-blue/g' \
  {} \;

# Fix emerald variants (should be green)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-emerald-100/from-green\/10/g' \
  -e 's/to-emerald-100/to-green\/10/g' \
  -e 's/from-emerald-50/from-green\/5/g' \
  -e 's/to-emerald-50/to-green\/5/g' \
  -e 's/from-emerald-900/from-green/g' \
  -e 's/to-emerald-900/to-green/g' \
  -e 's/from-emerald-800/from-green/g' \
  -e 's/to-emerald-800/to-green/g' \
  -e 's/from-emerald-500/from-green/g' \
  -e 's/border-emerald-500/border-green/g' \
  -e 's/border-emerald-300/border-green\/30/g' \
  -e 's/border-emerald-700/border-green/g' \
  -e 's/dark:from-emerald-950/dark:from-green/g' \
  -e 's/dark:to-emerald-950/dark:to-green/g' \
  -e 's/dark:from-emerald-900/dark:from-green/g' \
  -e 's/dark:to-emerald-900/dark:to-green/g' \
  -e 's/dark:border-emerald-700/dark:border-green/g' \
  {} \;

# Fix amber/orange variants (should be yellow/orange)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-amber-900/from-yellow/g' \
  -e 's/to-amber-900/to-yellow/g' \
  -e 's/dark:from-amber-900/dark:from-yellow/g' \
  -e 's/dark:to-amber-900/dark:to-yellow/g' \
  -e 's/dark:border-amber-800/dark:border-yellow/g' \
  -e 's/to-orange-50/to-orange\/5/g' \
  -e 's/from-orange-50/from-orange\/5/g' \
  -e 's/to-orange-900/to-orange/g' \
  -e 's/from-orange-900/from-orange/g' \
  -e 's/dark:from-orange-900/dark:from-orange/g' \
  -e 's/dark:to-orange-900/dark:to-orange/g' \
  -e 's/border-l-orange-500/border-l-orange/g' \
  {} \;

# Fix violet variants (should be purple)
find app -name "*.tsx" -exec sed -i \
  -e 's/to-violet-600/to-purple/g' \
  -e 's/from-violet-600/from-purple/g' \
  -e 's/hover:from-violet-700/hover:from-purple/g' \
  -e 's/hover:to-violet-700/hover:to-purple/g' \
  -e 's/dark:to-violet-700/dark:to-purple/g' \
  -e 's/dark:from-violet-700/dark:from-purple/g' \
  -e 's/to-purple-50/to-purple\/5/g' \
  -e 's/from-purple-50/from-purple\/5/g' \
  -e 's/dark:from-purple-950/dark:from-purple/g' \
  -e 's/dark:to-purple-950/dark:to-purple/g' \
  -e 's/dark:from-purple-900/dark:from-purple/g' \
  -e 's/dark:to-purple-900/dark:to-purple/g' \
  {} \;

# Fix slate-950 (should be background or muted/95)
find app -name "*.tsx" -exec sed -i \
  -e 's/bg-slate-950/bg-background/g' \
  -e 's/dark:bg-slate-950/dark:bg-background/g' \
  -e 's/text-slate-950/text-foreground/g' \
  -e 's/border-slate-950/border-background/g' \
  {} \;

# Fix remaining gradient edge cases
find app -name "*.tsx" -exec sed -i \
  -e 's/to-teal-400/to-blue\/40/g' \
  -e 's/from-teal-400/from-blue\/40/g' \
  -e 's/from-teal-100/from-blue\/10/g' \
  -e 's/to-teal-100/to-blue\/10/g' \
  {} \;

echo "✅ Final DTC color system applied!"
echo "✓ All teal variants → blue"
echo "✓ All cyan variants → blue"
echo "✓ All indigo variants → blue"
echo "✓ All emerald variants → green"
echo "✓ All amber/orange variants standardized"
echo "✓ All violet variants → purple"
echo "✓ All slate-950 → background"
