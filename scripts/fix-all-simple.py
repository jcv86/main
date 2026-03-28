#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

# Change to the project directory
os.chdir("/vercel/share/v0-project")

api_dir = Path("./app/api")
if not api_dir.exists():
    print(f"Error: {api_dir} does not exist")
    print(f"Current directory: {os.getcwd()}")
    print(f"Contents: {list(Path('.').glob('*'))}")
    sys.exit(1)

# Find all route.ts files
routes = list(api_dir.rglob("route.ts"))
print(f"Found {len(routes)} route files")

fixed_count = 0
for route_file in routes:
    try:
        content = route_file.read_text()
        original = content
        
        # Fix 1: Replace Response.json with NextResponse.json
        if "Response.json(" in content and "NextResponse" in content:
            content = re.sub(r'(?<!Next)Response\.json\(', 'NextResponse.json(', content)
            if content != original:
                fixed_count += 1
                route_file.write_text(content)
                print(f"✓ Fixed: {route_file.relative_to('.')}")
    except Exception as e:
        print(f"✗ Error processing {route_file}: {e}")

print(f"\nFixed {fixed_count} files")
