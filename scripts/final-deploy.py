#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Add all changes
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    # Commit
    print("[v0] Committing changes...")
    subprocess.run(["git", "commit", "-m", "fix: final TypeScript errors - test type string formatting and const assertions"], check=True)
    
    # Push
    print("[v0] Pushing to Git...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] ✓ Successfully deployed all fixes!")
except Exception as e:
    print(f"[v0] Error: {e}")
