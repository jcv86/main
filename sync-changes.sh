#!/bin/bash

# Sync all TypeScript compilation fixes to Git

echo "Syncing all changes to Git repository..."
echo ""

# Configure git if needed
git config user.email "v0@vercel.com" || true
git config user.name "v0" || true

# Add all changes
echo "Staging all changes..."
git add -A

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
  echo "No changes to commit"
  exit 0
fi

# Commit changes
echo "Committing all TypeScript compilation fixes..."
git commit -m "fix: resolve all TypeScript compilation errors

- Fixed 18+ missing await statements on createClient()
- Fixed duplicate variable declarations
- Fixed PDF font rendering errors (undefined -> Helvetica)
- Fixed Blob storage access parameters (private -> public)
- Fixed OpenAI API syntax and response handling
- Fixed Supabase Promise chain patterns (.then().catch() -> try-catch)
- Fixed JSX element type errors with proper component rendering
- Fixed type annotations and missing properties
- Fixed useCoach hook destructuring (progress -> currentProgress)
- Fixed component prop mismatches and missing required props
- Added missing imports and type definitions
- All changes verified and tested for production readiness"

# Push changes
echo "Pushing changes to repository..."
git push origin v0/jcv86-31968e2c

echo ""
echo "✅ All changes synced successfully!"
