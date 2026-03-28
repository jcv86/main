#!/bin/bash

# Force clear all Next.js build caches
echo "Clearing Next.js build caches..."

# Remove build cache directories
rm -rf /vercel/share/v0-project/.next
rm -rf /vercel/share/v0-project/dist
rm -rf /vercel/share/v0-project/build
rm -rf /vercel/share/v0-project/.turbo
rm -rf /vercel/share/v0-project/node_modules/.cache

# Create a timestamp to force rebuild
touch /vercel/share/v0-project/.v0-rebuild-marker

echo "Build caches cleared successfully"
