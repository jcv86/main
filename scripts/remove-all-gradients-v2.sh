#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Complete gradient removal - Version 2"
echo ""

# Remove all bg-gradient patterns completely with their color stops
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-[a-z]* [^"]*/bg-background/g' \
  -e 's/ from-[a-z-]*//g' \
  -e 's/ to-[a-z-]*//g' \
  -e 's/ via-[a-z-]*//g' \
  -e 's/ dark:from-[a-z-]*//g' \
  -e 's/ dark:to-[a-z-]*//g' \
  -e 's/ dark:via-[a-z-]*//g' \
  {} \;

# Fix specific remaining gradient patterns
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-r from-purple to-purple/bg-purple/g' \
  -e 's/bg-gradient-to-b from-background to-muted/bg-background/g' \
  -e 's/bg-gradient-to-br from-purple.*to-blue.*/bg-purple/g' \
  -e 's/bg-gradient-to-br from-purple\/5 via-blue.*to-muted.*/bg-background/g' \
  -e 's/bg-gradient-to-r from-blue to-purple/bg-blue/g' \
  -e 's/bg-gradient-to-r from-blue/5 to-purple\/5/bg-background/g' \
  -e 's/bg-gradient-to-br from-red.*/bg-red/g' \
  -e 's/bg-gradient-to-br from-blue.*/bg-blue/g' \
  -e 's/bg-gradient-to-br from-green.*/bg-green/g' \
  -e 's/bg-gradient-to-br from-yellow.*/bg-yellow/g' \
  -e 's/bg-gradient-to-br from-orange.*/bg-orange/g' \
  -e 's/hover:from-purple-700 hover:to-blue//g' \
  {} \;

# Remove text gradients and replace with solid text color
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-purple bg-clip-text text-transparent/text-purple/g' \
  -e 's/bg-gradient-to-r [^ ]* bg-clip-text text-transparent/text-purple/g' \
  {} \;

echo "✅ Complete gradient removal finished!"
echo "All gradients replaced with solid brandbook colors"
