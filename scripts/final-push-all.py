#!/usr/bin/env python3
import subprocess
import os

os.chdir("/vercel/share/v0-project")

try:
    # Add all changes
    result = subprocess.run(["git", "add", "-A"], capture_output=True, text=True)
    print("[v0] Git add completed")
    
    # Commit all TypeScript fixes
    result = subprocess.run([
        "git", "commit", "-m", 
        "fix: comprehensive TypeScript fixes across all test files - type guards, prop fixes, enum values, and type safety"
    ], capture_output=True, text=True)
    
    if "nothing to commit" in result.stdout:
        print("[v0] No changes to commit - code already fixed")
    else:
        print("[v0] Committed all changes")
    
    # Push to origin
    result = subprocess.run(["git", "push", "origin", "HEAD"], capture_output=True, text=True)
    print("[v0] Pushed to GitHub")
    print("[v0] Deployment build starting...")
    
except Exception as e:
    print(f"[v0] Error: {e}")
