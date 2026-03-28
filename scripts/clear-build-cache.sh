#!/bin/bash

# Clear all Next.js build caches
echo "Clearing Next.js build caches..."

rm -rf .next
rm -rf dist
rm -rf build
rm -rf .turbo
rm -rf node_modules/.cache

echo "Build caches cleared successfully!"
