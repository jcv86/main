#!/usr/bin/env python3
import subprocess
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    subprocess.run([
        "git", "commit", "-m",
        "fix: add nullish coalescing for percent value in pie chart label"
    ], check=True)
    
    print("[v0] Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] SUCCESS: All changes pushed to GitHub!")
    sys.exit(0)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
