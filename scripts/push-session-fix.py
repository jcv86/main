#!/usr/bin/env python3
import subprocess
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    subprocess.run([
        "git", "commit", "-m", 
        "fix: remove unused session destructuring from big-five results page"
    ], check=True)
    
    print("[v0] Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] Successfully pushed all changes to GitHub!")
    sys.exit(0)
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
