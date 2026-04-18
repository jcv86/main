#!/bin/bash

# DTC Color System Replacements
# This script replaces all non-DTC colors with the official brand colors

cd /vercel/share/v0-project

# Remove old gradient colors - replace with solid DTC colors
find app/despega -name "*.tsx" -exec sed -i \
  -e 's/from-blue-500/from-blue/g' \
  -e 's/from-blue-600/from-blue/g' \
  -e 's/from-purple-600/from-purple/g' \
  -e 's/from-cyan-500/from-blue/g' \
  -e 's/from-cyan-600/from-blue/g' \
  -e 's/from-indigo-600/from-blue/g' \
  -e 's/from-emerald-600/from-green/g' \
  -e 's/from-orange-600/from-orange/g' \
  -e 's/from-orange-800/from-orange/g' \
  -e 's/from-amber-600/from-yellow/g' \
  -e 's/from-amber-800/from-yellow/g' \
  -e 's/from-teal-600/from-blue/g' \
  -e 's/from-green-500/from-green/g' \
  -e 's/via-blue-500/via-blue/g' \
  -e 's/via-cyan-500/via-blue/g' \
  -e 's/to-blue-500/to-blue/g' \
  -e 's/to-cyan-500/to-blue/g' \
  -e 's/to-emerald-500/to-green/g' \
  -e 's/to-teal-500/to-blue/g' \
  -e 's/text-blue-600/text-blue/g' \
  -e 's/text-purple-600/text-purple/g' \
  -e 's/text-cyan-600/text-blue/g' \
  -e 's/text-indigo-600/text-blue/g' \
  -e 's/text-emerald-600/text-green/g' \
  -e 's/text-orange-600/text-orange/g' \
  -e 's/text-amber-600/text-yellow/g' \
  -e 's/bg-blue-600/bg-blue/g' \
  -e 's/bg-blue-50/bg-blue\/5/g' \
  -e 's/bg-purple-50/bg-purple\/5/g' \
  -e 's/bg-cyan-50/bg-blue\/5/g' \
  -e 's/bg-indigo-50/bg-blue\/5/g' \
  -e 's/bg-emerald-50/bg-green\/5/g' \
  -e 's/bg-orange-50/bg-orange\/5/g' \
  -e 's/bg-amber-50/bg-yellow\/5/g' \
  -e 's/border-blue-600/border-blue/g' \
  -e 's/border-blue-200/border-blue\/30/g' \
  -e 's/border-purple-200/border-purple\/30/g' \
  -e 's/border-cyan-200/border-blue\/30/g' \
  -e 's/border-indigo-200/border-blue\/30/g' \
  -e 's/border-amber-200/border-yellow\/30/g' \
  {} \;

echo "✓ DTC color system applied to all pages"
