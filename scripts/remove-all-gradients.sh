#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Removing ALL gradients - Using solid brandbook colors"
echo ""

# Background gradients to solid backgrounds
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-br from-background to-muted\/20/bg-background/g' \
  -e 's/bg-gradient-to-br from-background to-muted/bg-background/g' \
  -e 's/bg-gradient-to-br from-muted\/5 to-muted\/10/bg-background/g' \
  -e 's/bg-gradient-to-br from-muted\/5 via-blue\/5 to-blue\/5/bg-background/g' \
  -e 's/bg-gradient-to-br from-background via-purple to-muted\/90/bg-background/g' \
  -e 's/bg-gradient-to-br from-purple\/5 to-blue\/5/bg-background/g' \
  -e 's/bg-gradient-to-br from-purple\/5 via-blue\/5 to-blue\/5/bg-background/g' \
  -e 's/bg-gradient-to-br from-blue via-background to-green/bg-background/g' \
  -e 's/bg-gradient-to-br from-background to-muted p-4/bg-background p-4/g' \
  {} \;

# Text gradients - convert to solid colors
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-r from-blue via-blue to-purple bg-clip-text text-transparent/text-blue/g' \
  -e 's/bg-gradient-to-r from-purple via-blue to-blue bg-clip-text text-transparent/text-purple/g' \
  -e 's/dark:from-purple-400 dark:via-blue-400 dark:to-blue\/40//g' \
  {} \;

# Button gradients - convert to solid colors
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-r from-blue to-blue hover:from-blue hover:to-blue-800/bg-blue hover:bg-blue\/80/g' \
  -e 's/dark:from-blue dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900//g' \
  -e 's/bg-gradient-to-r from-purple to-blue/bg-purple/g' \
  {} \;

# Card gradients - convert to solid colors
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-gradient-to-br from-red to-red/bg-red/g' \
  -e 's/bg-gradient-to-br from-orange\/50 to-orange-600/bg-orange/g' \
  -e 's/bg-gradient-to-r from-blue to-blue/bg-blue/g' \
  -e 's/bg-gradient-to-br from-green to-green/bg-green/g' \
  -e 's/bg-gradient-to-r from-green-600 to-green/bg-green/g' \
  -e 's/bg-gradient-to-r from-orange-600 to-red-600/bg-orange/g' \
  -e 's/bg-gradient-to-r from-red to-red/bg-red/g' \
  -e 's/bg-gradient-to-br from-muted\/90 to-muted\/80/bg-muted\/90/g' \
  -e 's/bg-gradient-to-r from-blue via-blue to-purple/bg-blue/g' \
  -e 's/bg-gradient-to-br from-purple\/50 to-blue\/50/bg-purple\/50/g' \
  {} \;

# Clean up dark mode gradient remnants
find app components -name "*.tsx" -exec sed -i \
  -e 's/ dark:from-background dark:to-muted\/90//g' \
  -e 's/ dark:from-muted\/5 dark:to-muted\/10//g' \
  -e 's/ dark:from-background dark:via-muted\/90 dark:to-muted\/90//g' \
  {} \;

echo "✅ All gradients removed!"
echo "All titles and buttons now use solid brandbook colors"
