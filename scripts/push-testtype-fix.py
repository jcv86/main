#!/usr/bin/env python3
import subprocess
import os
import sys

try:
    print("[v0] Adding all changes...")
    subprocess.run(["git", "add", "-A"], check=True, cwd=os.getcwd())
    
    print("[v0] Committing changes...")
    subprocess.run(
        ["git", "commit", "-m", "fix: add missing testType prop to TestCompletionScreen in big-five test"],
        check=True,
        cwd=os.getcwd()
    )
    
    print("[v0] Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True, cwd=os.getcwd())
    
    print("[v0] ✓ Successfully pushed all fixes!")
    sys.exit(0)
except subprocess.CalledProcessError as e:
    print(f"[v0] Git command failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
