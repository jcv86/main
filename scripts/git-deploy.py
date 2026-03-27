#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

try:
    print("[v0] Adding all changes...")
    subprocess.run(['git', 'add', '-A'], check=True)
    print("[v0] ✓ Changes added")
    
    print("[v0] Committing changes...")
    subprocess.run(['git', 'commit', '-m', 'fix: resolve all TypeScript compilation errors and type safety issues'], check=True)
    print("[v0] ✓ Changes committed")
    
    print("[v0] Pushing to remote...")
    subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)
    print("[v0] ✓ Changes pushed successfully!")
    print("[v0] Deployment triggered - Vercel will now build and deploy the application")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
