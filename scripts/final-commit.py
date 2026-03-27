#!/usr/bin/env python3
import subprocess
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    subprocess.run([
        "git", "commit", "-m", 
        "fix: resolve all remaining TypeScript errors - TestIntroScreen/TestCompletionScreen props, TestType enum values, component interfaces"
    ], check=True)
    
    print("[v0] Pushing to origin...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] ✓ All changes pushed successfully!")
    sys.exit(0)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
