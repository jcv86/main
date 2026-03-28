#!/bin/bash

# Production cleanup script - removes debug console.log statements

echo "Starting console.log cleanup..."

# Find and process TypeScript/JavaScript files
# Remove console.log lines that contain "[v0]"
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./dist/*" \
  -exec sed -i '/console\.log.*\[v0\]/d' {} +

echo "Cleanup completed!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Run tests: npm test"
echo "3. Build: npm run build"
echo "4. Deploy to staging"
