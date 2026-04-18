#!/bin/bash

# DTC Border Radius Fixes
# This script replaces all rounded-lg, rounded-md, rounded-full with proper DTC radius values

cd /vercel/share/v0-project

# For card/surface elements (28px)
find app/despega components -name "*.tsx" -exec sed -i \
  -e 's/rounded-lg(?![^"])/rounded-[28px]/g' \
  -e 's/rounded-md(?![^"])/rounded-[20px]/g' \
  -e 's/rounded-full(?![^"])/rounded-[20px]/g' \
  {} \;

# More precise replacements using patterns
find app/despega components -name "*.tsx" -exec sed -i \
  -e 's/p-4 rounded-lg/p-4 rounded-[28px]/g' \
  -e 's/p-6 rounded-lg/p-6 rounded-[28px]/g' \
  -e 's/p-8 rounded-lg/p-8 rounded-[28px]/g' \
  -e 's/rounded-lg border/rounded-[28px] border/g' \
  -e 's/rounded-lg p-/rounded-[28px] p-/g' \
  -e 's/rounded-lg bg-/rounded-[28px] bg-/g' \
  -e 's/rounded-full text/rounded-[20px] text/g' \
  -e 's/rounded-full bg-/rounded-[20px] bg-/g' \
  {} \;

echo "✓ DTC radius system applied - all elements now use squared corners (20px/28px)"
