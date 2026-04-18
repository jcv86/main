#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Final surgical DTC color fixes - handling last 25 edge cases..."

# Fix slate-950 variants (should be background)
find app -name "*.tsx" -exec sed -i \
  -e 's/to-slate-950/to-background/g' \
  -e 's/from-slate-950/from-background/g' \
  -e 's/via-slate-950/via-background/g' \
  {} \;

# Fix 950 dark variants (very dark shades should map to their base color or background)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-purple-950/from-purple/g' \
  -e 's/to-purple-950/to-purple/g' \
  -e 's/via-purple-950/via-purple/g' \
  -e 's/from-cyan-950/from-blue/g' \
  -e 's/to-cyan-950/to-blue/g' \
  -e 's/from-teal-950/from-blue/g' \
  -e 's/to-teal-950/to-blue/g' \
  -e 's/from-emerald-950/from-green/g' \
  -e 's/to-emerald-950/to-green/g' \
  {} \;

# Fix light 50 variants (very light shades)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-teal-50/from-blue\/5/g' \
  -e 's/to-teal-50/to-blue\/5/g' \
  -e 's/via-teal-50/via-blue\/5/g' \
  -e 's/from-emerald-50/from-green\/5/g' \
  -e 's/to-emerald-50/to-green\/5/g' \
  -e 's/via-emerald-50/via-green\/5/g' \
  -e 's/from-cyan-50/from-blue\/5/g' \
  -e 's/to-cyan-50/to-blue\/5/g' \
  {} \;

# Fix medium teal/cyan/emerald variants (should be their DTC equivalents)
find app -name "*.tsx" -exec sed -i \
  -e 's/from-teal-500/from-blue/g' \
  -e 's/to-teal-500/to-blue/g' \
  -e 's/from-cyan-500/from-blue/g' \
  -e 's/to-cyan-500/to-blue/g' \
  -e 's/from-emerald-500/from-green/g' \
  -e 's/to-emerald-500/to-green/g' \
  {} \;

echo "✅ Final surgical DTC fixes applied!"
echo "✓ All to-slate-950 → to-background"
echo "✓ All from-purple-950 → from-purple"
echo "✓ All cyan/teal-950 → blue/emerald-950 → green"
echo "✓ All teal/emerald/cyan-50 → blue/green/5"
echo "✓ All teal/cyan/emerald-500 → blue/green"
