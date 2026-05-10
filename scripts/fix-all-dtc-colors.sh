#!/bin/bash

# DTC MASTER COLOR SYSTEM REPLACEMENT
# Replaces ALL non-DTC colors throughout the ENTIRE app (not just /despega)

cd /vercel/share/v0-project

echo "🎨 Starting comprehensive DTC color system audit..."

# Phase 1: Replace blue variants with DTC blue
echo "▶ Phase 1: Standardizing blue colors..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-blue-50/from-blue\/5/g' \
  -e 's/from-blue-100/from-blue\/10/g' \
  -e 's/from-blue-200/from-blue\/20/g' \
  -e 's/from-blue-300/from-blue\/30/g' \
  -e 's/from-blue-400/from-blue\/40/g' \
  -e 's/from-blue-500/from-blue/g' \
  -e 's/from-blue-600/from-blue/g' \
  -e 's/from-blue-700/from-blue/g' \
  -e 's/from-blue-900/from-blue/g' \
  -e 's/via-blue-50/via-blue\/5/g' \
  -e 's/via-blue-100/via-blue\/10/g' \
  -e 's/via-blue-500/via-blue/g' \
  -e 's/via-blue-600/via-blue/g' \
  -e 's/to-blue-50/to-blue\/5/g' \
  -e 's/to-blue-100/to-blue\/10/g' \
  -e 's/to-blue-500/to-blue/g' \
  -e 's/to-blue-600/to-blue/g' \
  -e 's/text-blue-50/text-blue\/5/g' \
  -e 's/text-blue-100/text-blue\/10/g' \
  -e 's/text-blue-200/text-blue\/20/g' \
  -e 's/text-blue-300/text-blue\/30/g' \
  -e 's/text-blue-400/text-blue\/40/g' \
  -e 's/text-blue-500/text-blue/g' \
  -e 's/text-blue-600/text-blue/g' \
  -e 's/text-blue-700/text-blue/g' \
  -e 's/text-blue-900/text-blue/g' \
  -e 's/bg-blue-50/bg-blue\/5/g' \
  -e 's/bg-blue-100/bg-blue\/10/g' \
  -e 's/bg-blue-200/bg-blue\/20/g' \
  -e 's/bg-blue-300/bg-blue\/30/g' \
  -e 's/bg-blue-400/bg-blue\/40/g' \
  -e 's/bg-blue-500/bg-blue/g' \
  -e 's/bg-blue-600/bg-blue/g' \
  -e 's/bg-blue-700/bg-blue/g' \
  -e 's/bg-blue-900/bg-blue/g' \
  -e 's/border-blue-50/border-blue\/5/g' \
  -e 's/border-blue-100/border-blue\/10/g' \
  -e 's/border-blue-200/border-blue\/20/g' \
  -e 's/border-blue-300/border-blue\/30/g' \
  -e 's/border-blue-400/border-blue\/40/g' \
  -e 's/border-blue-500/border-blue/g' \
  -e 's/border-blue-600/border-blue/g' \
  -e 's/border-blue-700/border-blue/g' \
  -e 's/border-blue-900/border-blue/g' \
  {} \;

# Phase 2: Replace purple variants with DTC purple
echo "▶ Phase 2: Standardizing purple colors..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-purple-50/from-purple\/5/g' \
  -e 's/from-purple-100/from-purple\/10/g' \
  -e 's/from-purple-600/from-purple/g' \
  -e 's/from-purple-900/from-purple/g' \
  -e 's/text-purple-50/text-purple\/5/g' \
  -e 's/text-purple-100/text-purple\/10/g' \
  -e 's/text-purple-600/text-purple/g' \
  -e 's/text-purple-700/text-purple/g' \
  -e 's/text-purple-800/text-purple/g' \
  -e 's/text-purple-900/text-purple/g' \
  -e 's/bg-purple-50/bg-purple\/5/g' \
  -e 's/bg-purple-100/bg-purple\/10/g' \
  -e 's/bg-purple-600/bg-purple/g' \
  -e 's/bg-purple-700/bg-purple/g' \
  -e 's/bg-purple-800/bg-purple/g' \
  -e 's/bg-purple-900/bg-purple/g' \
  -e 's/bg-purple-950/bg-purple/g' \
  -e 's/border-purple-50/border-purple\/5/g' \
  -e 's/border-purple-100/border-purple\/10/g' \
  -e 's/border-purple-200/border-purple\/20/g' \
  -e 's/border-purple-400/border-purple\/40/g' \
  -e 's/border-purple-500/border-purple/g' \
  -e 's/border-purple-600/border-purple/g' \
  -e 's/border-purple-800/border-purple/g' \
  -e 's/dark:bg-purple-900\/30/dark:bg-purple\/10/g' \
  -e 's/dark:bg-purple-950/dark:bg-purple/g' \
  -e 's/dark:border-purple-500/dark:border-purple\/40/g' \
  -e 's/dark:text-purple-400/dark:text-purple\/40/g' \
  {} \;

# Phase 3: Replace cyan with DTC blue
echo "▶ Phase 3: Replacing cyan with blue..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-cyan-50/from-blue\/5/g' \
  -e 's/from-cyan-500/from-blue/g' \
  -e 's/from-cyan-600/from-blue/g' \
  -e 's/via-cyan-500/via-blue/g' \
  -e 's/to-cyan-500/to-blue/g' \
  -e 's/to-cyan-600/to-blue/g' \
  -e 's/text-cyan-600/text-blue/g' \
  -e 's/bg-cyan-50/bg-blue\/5/g' \
  -e 's/bg-cyan-600/bg-blue/g' \
  -e 's/border-cyan-200/border-blue\/20/g' \
  {} \;

# Phase 4: Replace indigo with DTC blue
echo "▶ Phase 4: Replacing indigo with blue..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-indigo-50/from-blue\/5/g' \
  -e 's/from-indigo-600/from-blue/g' \
  -e 's/text-indigo-600/text-blue/g' \
  -e 's/bg-indigo-50/bg-blue\/5/g' \
  -e 's/bg-indigo-600/bg-blue/g' \
  -e 's/border-indigo-200/border-blue\/20/g' \
  {} \;

# Phase 5: Replace emerald with DTC green
echo "▶ Phase 5: Replacing emerald with green..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-emerald-50/from-green\/5/g' \
  -e 's/from-emerald-600/from-green/g' \
  -e 's/to-emerald-500/to-green/g' \
  -e 's/text-emerald-600/text-green/g' \
  -e 's/bg-emerald-50/bg-green\/5/g' \
  -e 's/bg-emerald-600/bg-green/g' \
  -e 's/border-emerald-200/border-green\/20/g' \
  {} \;

# Phase 6: Replace teal with DTC blue
echo "▶ Phase 6: Replacing teal with blue..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-teal-600/from-blue/g' \
  -e 's/to-teal-500/to-blue/g' \
  -e 's/text-teal-600/text-blue/g' \
  -e 's/bg-teal-600/bg-blue/g' \
  -e 's/border-teal-200/border-blue\/20/g' \
  {} \;

# Phase 7: Replace amber with DTC yellow
echo "▶ Phase 7: Replacing amber with yellow..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-amber-50/from-yellow\/5/g' \
  -e 's/from-amber-600/from-yellow/g' \
  -e 's/from-amber-800/from-yellow/g' \
  -e 's/text-amber-600/text-yellow/g' \
  -e 's/text-amber-700/text-yellow/g' \
  -e 's/bg-amber-50/bg-yellow\/5/g' \
  -e 's/bg-amber-600/bg-yellow/g' \
  -e 's/border-amber-200/border-yellow\/20/g' \
  {} \;

# Phase 8: Replace rose with DTC red
echo "▶ Phase 8: Replacing rose with red..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-rose-50/from-red\/5/g' \
  -e 's/from-rose-500/from-red/g' \
  -e 's/from-rose-600/from-red/g' \
  -e 's/text-rose-500/text-red/g' \
  -e 's/text-rose-600/text-red/g' \
  -e 's/bg-rose-50/bg-red\/5/g' \
  -e 's/bg-rose-500/bg-red/g' \
  -e 's/bg-rose-600/bg-red/g' \
  -e 's/border-rose-200/border-red\/20/g' \
  {} \;

# Phase 9: Replace pink with DTC red
echo "▶ Phase 9: Replacing pink with red..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-pink-50/from-red\/5/g' \
  -e 's/from-pink-500/from-red/g' \
  -e 's/from-pink-600/from-red/g' \
  -e 's/text-pink-500/text-red/g' \
  -e 's/text-pink-600/text-red/g' \
  -e 's/bg-pink-50/bg-red\/5/g' \
  -e 's/bg-pink-500/bg-red/g' \
  -e 's/bg-pink-600/bg-red/g' \
  -e 's/border-pink-200/border-red\/20/g' \
  {} \;

# Phase 10: Replace green variants with DTC green
echo "▶ Phase 10: Standardizing green colors..."
find app -name "*.tsx" -exec sed -i \
  -e 's/from-green-50/from-green\/5/g' \
  -e 's/from-green-500/from-green/g' \
  -e 's/to-green-500/to-green/g' \
  -e 's/text-green-500/text-green/g' \
  -e 's/text-green-600/text-green/g' \
  -e 's/bg-green-50/bg-green\/5/g' \
  -e 's/bg-green-500/bg-green/g' \
  -e 's/bg-green-600/bg-green/g' \
  -e 's/border-green-200/border-green\/20/g' \
  {} \;

# Phase 11: Handle slate/gray with DTC neutral palette
echo "▶ Phase 11: Standardizing neutral colors..."
find app -name "*.tsx" -exec sed -i \
  -e 's/bg-slate-50/bg-muted\/5/g' \
  -e 's/bg-slate-100/bg-muted\/10/g' \
  -e 's/bg-slate-200/bg-muted\/20/g' \
  -e 's/bg-slate-300/bg-muted\/30/g' \
  -e 's/text-slate-200/text-muted\/20/g' \
  -e 's/text-slate-300/text-muted\/30/g' \
  -e 's/text-slate-400/text-muted\/40/g' \
  -e 's/text-slate-500/text-muted\/50/g' \
  -e 's/text-slate-600/text-muted\/60/g' \
  -e 's/text-slate-700/text-muted\/70/g' \
  -e 's/border-slate-100/border-muted\/10/g' \
  -e 's/border-slate-200/border-muted\/20/g' \
  -e 's/border-slate-300/border-muted\/30/g' \
  {} \;

# Phase 12: Handle dark mode variants
echo "▶ Phase 12: Standardizing dark mode colors..."
find app -name "*.tsx" -exec sed -i \
  -e 's/dark:bg-blue-900/dark:bg-blue\/10/g' \
  -e 's/dark:bg-blue-800/dark:bg-blue/g' \
  -e 's/dark:text-blue-400/dark:text-blue\/40/g' \
  -e 's/dark:text-blue-300/dark:text-blue\/30/g' \
  -e 's/dark:border-blue-800/dark:border-blue\/10/g' \
  -e 's/dark:bg-slate-800/dark:bg-card/g' \
  -e 's/dark:bg-slate-900/dark:bg-background/g' \
  -e 's/dark:text-slate-300/dark:text-foreground\/80/g' \
  -e 's/dark:text-slate-400/dark:text-foreground\/60/g' \
  -e 's/dark:border-slate-700/dark:border-card/g' \
  {} \;

echo "✅ Master DTC color system applied to entire app!"
echo "📊 Summary:"
echo "   - Blue variants standardized"
echo "   - Purple variants standardized"
echo "   - Cyan/Indigo/Teal → Blue"
echo "   - Emerald → Green"
echo "   - Amber → Yellow"
echo "   - Rose/Pink → Red"
echo "   - Green standardized"
echo "   - Slate/Gray → DTC neutral palette"
echo "   - Dark mode aligned"
