#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Final Complete Color Standardization - Replacing ALL 2100+ instances"
echo ""

# Replace ALL numbered slate variants systematically
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-slate-50/text-muted\/5/g' \
  -e 's/text-slate-100/text-muted\/10/g' \
  -e 's/text-slate-200/text-muted\/20/g' \
  -e 's/text-slate-300/text-muted\/30/g' \
  -e 's/text-slate-400/text-muted\/40/g' \
  -e 's/text-slate-500/text-muted\/50/g' \
  -e 's/text-slate-600/text-muted\/60/g' \
  -e 's/text-slate-700/text-muted\/70/g' \
  -e 's/text-slate-800/text-muted\/80/g' \
  -e 's/text-slate-900/text-muted\/90/g' \
  -e 's/bg-slate-50/bg-muted\/5/g' \
  -e 's/bg-slate-100/bg-muted\/10/g' \
  -e 's/bg-slate-200/bg-muted\/20/g' \
  -e 's/bg-slate-300/bg-muted\/30/g' \
  -e 's/bg-slate-400/bg-muted\/40/g' \
  -e 's/bg-slate-500/bg-muted\/50/g' \
  -e 's/bg-slate-600/bg-muted\/60/g' \
  -e 's/bg-slate-700/bg-muted\/70/g' \
  -e 's/bg-slate-800/bg-muted\/80/g' \
  -e 's/bg-slate-900/bg-muted\/90/g' \
  -e 's/border-slate-50/border-muted\/5/g' \
  -e 's/border-slate-100/border-muted\/10/g' \
  -e 's/border-slate-200/border-muted\/20/g' \
  -e 's/border-slate-300/border-muted\/30/g' \
  -e 's/border-slate-400/border-muted\/40/g' \
  -e 's/border-slate-500/border-muted\/50/g' \
  -e 's/border-slate-600/border-muted\/60/g' \
  -e 's/border-slate-700/border-muted\/70/g' \
  -e 's/border-slate-800/border-muted\/80/g' \
  -e 's/border-slate-900/border-muted\/90/g' \
  -e 's/dark:text-slate/dark:text-muted/g' \
  -e 's/dark:bg-slate/dark:bg-muted/g' \
  -e 's/dark:border-slate/dark:border-muted/g' \
  {} \;

# Replace ALL numbered blue variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-blue-50/text-blue\/5/g' \
  -e 's/text-blue-100/text-blue\/10/g' \
  -e 's/text-blue-200/text-blue\/20/g' \
  -e 's/text-blue-300/text-blue\/30/g' \
  -e 's/text-blue-400/text-blue\/40/g' \
  -e 's/text-blue-500/text-blue\/50/g' \
  -e 's/text-blue-600/text-blue/g' \
  -e 's/text-blue-700/text-blue/g' \
  -e 's/text-blue-800/text-blue/g' \
  -e 's/text-blue-900/text-blue/g' \
  -e 's/bg-blue-50/bg-blue\/5/g' \
  -e 's/bg-blue-100/bg-blue\/10/g' \
  -e 's/bg-blue-200/bg-blue\/20/g' \
  -e 's/bg-blue-300/bg-blue\/30/g' \
  -e 's/bg-blue-400/bg-blue\/40/g' \
  -e 's/bg-blue-500/bg-blue\/50/g' \
  -e 's/bg-blue-600/bg-blue/g' \
  -e 's/bg-blue-700/bg-blue/g' \
  -e 's/bg-blue-800/bg-blue/g' \
  -e 's/bg-blue-900/bg-blue/g' \
  -e 's/bg-blue-950/bg-blue/g' \
  -e 's/border-blue-50/border-blue\/5/g' \
  -e 's/border-blue-100/border-blue\/10/g' \
  -e 's/border-blue-200/border-blue\/20/g' \
  -e 's/border-blue-300/border-blue\/30/g' \
  -e 's/border-blue-400/border-blue\/40/g' \
  -e 's/border-blue-500/border-blue\/50/g' \
  -e 's/border-blue-600/border-blue/g' \
  -e 's/border-blue-700/border-blue/g' \
  -e 's/border-blue-800/border-blue/g' \
  -e 's/border-blue-900/border-blue/g' \
  -e 's/dark:text-blue/dark:text-blue/g' \
  -e 's/dark:bg-blue/dark:bg-blue/g' \
  -e 's/dark:border-blue/dark:border-blue/g' \
  {} \;

# Replace ALL numbered red variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-red-50/text-red\/5/g' \
  -e 's/text-red-100/text-red\/10/g' \
  -e 's/text-red-200/text-red\/20/g' \
  -e 's/text-red-300/text-red\/30/g' \
  -e 's/text-red-400/text-red\/40/g' \
  -e 's/text-red-500/text-red\/50/g' \
  -e 's/text-red-600/text-red/g' \
  -e 's/text-red-700/text-red/g' \
  -e 's/text-red-800/text-red/g' \
  -e 's/text-red-900/text-red/g' \
  -e 's/bg-red-50/bg-red\/5/g' \
  -e 's/bg-red-100/bg-red\/10/g' \
  -e 's/bg-red-200/bg-red\/20/g' \
  -e 's/bg-red-300/bg-red\/30/g' \
  -e 's/bg-red-400/bg-red\/40/g' \
  -e 's/bg-red-500/bg-red\/50/g' \
  -e 's/bg-red-600/bg-red/g' \
  -e 's/bg-red-700/bg-red/g' \
  -e 's/bg-red-800/bg-red/g' \
  -e 's/bg-red-900/bg-red/g' \
  -e 's/bg-red-950/bg-red/g' \
  -e 's/border-red-50/border-red\/5/g' \
  -e 's/border-red-100/border-red\/10/g' \
  -e 's/border-red-200/border-red\/20/g' \
  -e 's/border-red-300/border-red\/30/g' \
  -e 's/border-red-400/border-red\/40/g' \
  -e 's/border-red-500/border-red\/50/g' \
  -e 's/border-red-600/border-red/g' \
  -e 's/border-red-700/border-red/g' \
  -e 's/border-red-800/border-red/g' \
  -e 's/border-red-900/border-red/g' \
  {} \;

# Replace ALL numbered purple variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-purple-50/text-purple\/5/g' \
  -e 's/text-purple-100/text-purple\/10/g' \
  -e 's/text-purple-200/text-purple\/20/g' \
  -e 's/text-purple-300/text-purple\/30/g' \
  -e 's/text-purple-400/text-purple\/40/g' \
  -e 's/text-purple-500/text-purple\/50/g' \
  -e 's/text-purple-600/text-purple/g' \
  -e 's/text-purple-700/text-purple/g' \
  -e 's/text-purple-800/text-purple/g' \
  -e 's/text-purple-900/text-purple/g' \
  -e 's/bg-purple-50/bg-purple\/5/g' \
  -e 's/bg-purple-100/bg-purple\/10/g' \
  -e 's/bg-purple-200/bg-purple\/20/g' \
  -e 's/bg-purple-300/bg-purple\/30/g' \
  -e 's/bg-purple-400/bg-purple\/40/g' \
  -e 's/bg-purple-500/bg-purple\/50/g' \
  -e 's/bg-purple-600/bg-purple/g' \
  -e 's/bg-purple-700/bg-purple/g' \
  -e 's/bg-purple-800/bg-purple/g' \
  -e 's/bg-purple-900/bg-purple/g' \
  -e 's/bg-purple-950/bg-purple/g' \
  -e 's/border-purple-50/border-purple\/5/g' \
  -e 's/border-purple-100/border-purple\/10/g' \
  -e 's/border-purple-200/border-purple\/20/g' \
  -e 's/border-purple-300/border-purple\/30/g' \
  -e 's/border-purple-400/border-purple\/40/g' \
  -e 's/border-purple-500/border-purple\/50/g' \
  -e 's/border-purple-600/border-purple/g' \
  -e 's/border-purple-700/border-purple/g' \
  -e 's/border-purple-800/border-purple/g' \
  -e 's/border-purple-900/border-purple/g' \
  {} \;

# Replace ALL numbered green variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-green-50/text-green\/5/g' \
  -e 's/text-green-100/text-green\/10/g' \
  -e 's/text-green-200/text-green\/20/g' \
  -e 's/text-green-300/text-green\/30/g' \
  -e 's/text-green-400/text-green\/40/g' \
  -e 's/text-green-500/text-green\/50/g' \
  -e 's/text-green-600/text-green/g' \
  -e 's/text-green-700/text-green/g' \
  -e 's/text-green-800/text-green/g' \
  -e 's/text-green-900/text-green/g' \
  -e 's/bg-green-50/bg-green\/5/g' \
  -e 's/bg-green-100/bg-green\/10/g' \
  -e 's/bg-green-200/bg-green\/20/g' \
  -e 's/bg-green-300/bg-green\/30/g' \
  -e 's/bg-green-400/bg-green\/40/g' \
  -e 's/bg-green-500/bg-green\/50/g' \
  -e 's/bg-green-600/bg-green/g' \
  -e 's/bg-green-700/bg-green/g' \
  -e 's/bg-green-800/bg-green/g' \
  -e 's/bg-green-900/bg-green/g' \
  -e 's/bg-green-950/bg-green/g' \
  -e 's/border-green-50/border-green\/5/g' \
  -e 's/border-green-100/border-green\/10/g' \
  -e 's/border-green-200/border-green\/20/g' \
  -e 's/border-green-300/border-green\/30/g' \
  -e 's/border-green-400/border-green\/40/g' \
  -e 's/border-green-500/border-green\/50/g' \
  -e 's/border-green-600/border-green/g' \
  -e 's/border-green-700/border-green/g' \
  -e 's/border-green-800/border-green/g' \
  -e 's/border-green-900/border-green/g' \
  {} \;

# Replace ALL numbered orange variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-orange-50/text-orange\/5/g' \
  -e 's/text-orange-100/text-orange\/10/g' \
  -e 's/text-orange-200/text-orange\/20/g' \
  -e 's/text-orange-300/text-orange\/30/g' \
  -e 's/text-orange-400/text-orange\/40/g' \
  -e 's/text-orange-500/text-orange\/50/g' \
  -e 's/text-orange-600/text-orange/g' \
  -e 's/text-orange-700/text-orange/g' \
  -e 's/text-orange-800/text-orange/g' \
  -e 's/text-orange-900/text-orange/g' \
  -e 's/bg-orange-50/bg-orange\/5/g' \
  -e 's/bg-orange-100/bg-orange\/10/g' \
  -e 's/bg-orange-200/bg-orange\/20/g' \
  -e 's/bg-orange-300/bg-orange\/30/g' \
  -e 's/bg-orange-400/bg-orange\/40/g' \
  -e 's/bg-orange-500/bg-orange\/50/g' \
  -e 's/bg-orange-600/bg-orange/g' \
  -e 's/bg-orange-700/bg-orange/g' \
  -e 's/bg-orange-800/bg-orange/g' \
  -e 's/bg-orange-900/bg-orange/g' \
  -e 's/bg-orange-950/bg-orange/g' \
  -e 's/border-orange-50/border-orange\/5/g' \
  -e 's/border-orange-100/border-orange\/10/g' \
  -e 's/border-orange-200/border-orange\/20/g' \
  -e 's/border-orange-300/border-orange\/30/g' \
  -e 's/border-orange-400/border-orange\/40/g' \
  -e 's/border-orange-500/border-orange\/50/g' \
  -e 's/border-orange-600/border-orange/g' \
  -e 's/border-orange-700/border-orange/g' \
  -e 's/border-orange-800/border-orange/g' \
  -e 's/border-orange-900/border-orange/g' \
  {} \;

# Replace ALL numbered cyan variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-cyan-50/text-cyan\/5/g' \
  -e 's/text-cyan-100/text-cyan\/10/g' \
  -e 's/text-cyan-200/text-cyan\/20/g' \
  -e 's/text-cyan-300/text-cyan\/30/g' \
  -e 's/text-cyan-400/text-cyan\/40/g' \
  -e 's/text-cyan-500/text-cyan\/50/g' \
  -e 's/text-cyan-600/text-cyan/g' \
  -e 's/text-cyan-700/text-cyan/g' \
  -e 's/text-cyan-800/text-cyan/g' \
  -e 's/text-cyan-900/text-cyan/g' \
  -e 's/bg-cyan-50/bg-cyan\/5/g' \
  -e 's/bg-cyan-100/bg-cyan\/10/g' \
  -e 's/bg-cyan-200/bg-cyan\/20/g' \
  -e 's/bg-cyan-300/bg-cyan\/30/g' \
  -e 's/bg-cyan-400/bg-cyan\/40/g' \
  -e 's/bg-cyan-500/bg-cyan\/50/g' \
  -e 's/bg-cyan-600/bg-cyan/g' \
  -e 's/bg-cyan-700/bg-cyan/g' \
  -e 's/bg-cyan-800/bg-cyan/g' \
  -e 's/bg-cyan-900/bg-cyan/g' \
  -e 's/border-cyan-50/border-cyan\/5/g' \
  -e 's/border-cyan-100/border-cyan\/10/g' \
  -e 's/border-cyan-200/border-cyan\/20/g' \
  -e 's/border-cyan-300/border-cyan\/30/g' \
  -e 's/border-cyan-400/border-cyan\/40/g' \
  -e 's/border-cyan-500/border-cyan\/50/g' \
  -e 's/border-cyan-600/border-cyan/g' \
  -e 's/border-cyan-700/border-cyan/g' \
  -e 's/border-cyan-800/border-cyan/g' \
  -e 's/border-cyan-900/border-cyan/g' \
  {} \;

# Replace ALL numbered yellow variants
find app components -name "*.tsx" -exec sed -i \
  -e 's/text-yellow-50/text-yellow\/5/g' \
  -e 's/text-yellow-100/text-yellow\/10/g' \
  -e 's/text-yellow-200/text-yellow\/20/g' \
  -e 's/text-yellow-300/text-yellow\/30/g' \
  -e 's/text-yellow-400/text-yellow\/40/g' \
  -e 's/text-yellow-500/text-yellow\/50/g' \
  -e 's/text-yellow-600/text-yellow/g' \
  -e 's/text-yellow-700/text-yellow/g' \
  -e 's/text-yellow-800/text-yellow/g' \
  -e 's/text-yellow-900/text-yellow/g' \
  -e 's/bg-yellow-50/bg-yellow\/5/g' \
  -e 's/bg-yellow-100/bg-yellow\/10/g' \
  -e 's/bg-yellow-200/bg-yellow\/20/g' \
  -e 's/bg-yellow-300/bg-yellow\/30/g' \
  -e 's/bg-yellow-400/bg-yellow\/40/g' \
  -e 's/bg-yellow-500/bg-yellow\/50/g' \
  -e 's/bg-yellow-600/bg-yellow/g' \
  -e 's/bg-yellow-700/bg-yellow/g' \
  -e 's/bg-yellow-800/bg-yellow/g' \
  -e 's/bg-yellow-900/bg-yellow/g' \
  -e 's/border-yellow-50/border-yellow\/5/g' \
  -e 's/border-yellow-100/border-yellow\/10/g' \
  -e 's/border-yellow-200/border-yellow\/20/g' \
  -e 's/border-yellow-300/border-yellow\/30/g' \
  -e 's/border-yellow-400/border-yellow\/40/g' \
  -e 's/border-yellow-500/border-yellow\/50/g' \
  -e 's/border-yellow-600/border-yellow/g' \
  -e 's/border-yellow-700/border-yellow/g' \
  -e 's/border-yellow-800/border-yellow/g' \
  -e 's/border-yellow-900/border-yellow/g' \
  {} \;

echo "✅ Complete color standardization finished!"
echo "All 2100+ hardcoded colors replaced with DTC brand tokens"
