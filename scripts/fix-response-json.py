#!/usr/bin/env python3
"""
Bulk fix Response.json() to NextResponse.json() in all API routes
"""
import os
import re
from pathlib import Path

api_routes_dir = Path('/vercel/share/v0-project/app/api')
rest_routes_dir = Path('/vercel/share/v0-project/app/rest')

def fix_file(file_path):
    """Fix Response.json() to NextResponse.json() in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Add NextResponse import if not already present
        if 'NextResponse' not in content and 'Response.json' in content:
            # Check if it's a route file
            if content.startswith('import ') or 'export async function' in content:
                # Add NextResponse import after the first import line
                lines = content.split('\n')
                insert_idx = 0
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        insert_idx = i + 1
                        break
                
                if 'next/server' not in content:
                    lines.insert(insert_idx, "import { NextResponse } from 'next/server'")
                    content = '\n'.join(lines)
        
        # Replace Response.json with NextResponse.json
        content = re.sub(r'\bResponse\.json\(', 'NextResponse.json(', content)
        
        # Write back if changed
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'[v0] Fixed {file_path}')
            return True
        return False
    except Exception as e:
        print(f'[v0] Error processing {file_path}: {e}')
        return False

# Fix all files in api and rest directories
fixed_count = 0
for directory in [api_routes_dir, rest_routes_dir]:
    if directory.exists():
        for route_file in directory.rglob('route.ts'):
            if fix_file(route_file):
                fixed_count += 1

print(f'[v0] Fixed {fixed_count} files total')
