#!/usr/bin/env python3
import subprocess
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    subprocess.run([
        "git", "commit", "-m",
        "fix: resolve final TypeScript errors - estimatedTime number type, whatItMeasures array, component props"
    ], check=True)
    
    print("[v0] Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] ✓ All changes pushed successfully!")
    sys.exit(0)
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
