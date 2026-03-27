#!/usr/bin/env python3
import subprocess
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    subprocess.run([
        "git", "commit", "-m", 
        "fix: resolve all high-severity TypeScript issues - add missing testType and userEmail props across all test files"
    ], check=True)
    
    print("[v0] Pushing to origin...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] ✅ All changes pushed to GitHub successfully!")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] ❌ Error: {e}")
    sys.exit(1)
