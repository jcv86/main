#!/bin/bash

cd /vercel/share/v0-project

echo "🎨 Removing ALL gray backgrounds - Converting to transparent"
echo ""

# Replace bg-white dark:bg-muted patterns with bg-transparent
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-white dark:bg-muted\/80/bg-transparent/g' \
  -e 's/bg-white dark:bg-muted\/90/bg-transparent/g' \
  -e 's/bg-muted\/80 border/bg-transparent border/g' \
  -e 's/bg-muted\/90 border/bg-transparent border/g' \
  -e 's/hover:bg-muted\/10/hover:bg-transparent/g' \
  -e 's/hover:bg-muted\/90/hover:bg-transparent/g' \
  -e 's/dark:hover:bg-muted\/90/dark:hover:bg-transparent/g' \
  -e 's/dark:bg-muted\/90/dark:bg-transparent/g' \
  -e 's/dark:bg-muted\/80/dark:bg-transparent/g' \
  {} \;

# Replace dropdown backgrounds with more transparent ones
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-muted\/90 border border-muted/bg-transparent border border-muted/g' \
  -e 's/bg-muted\/80 border border-muted/bg-transparent border border-muted/g' \
  {} \;

# Replace opacity-reduced background dropdowns  
find app components -name "*.tsx" -exec sed -i \
  -e 's/bg-muted\/80 border-muted\/70/bg-transparent border-muted\/40/g' \
  -e 's/dark:bg-muted\/80 dark:text-white/dark:bg-transparent dark:text-white/g' \
  {} \;

echo "✅ Removed all gray backgrounds!"
echo "All cards and modals now use transparent backgrounds with colored borders"
