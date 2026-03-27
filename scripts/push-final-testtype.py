#!/usr/bin/env python3
import subprocess
import os

cwd = os.getcwd()
print(f"[v0] Working directory: {cwd}")

try:
    print("[v0] Adding all changes to git...")
    subprocess.run(["git", "add", "-A"], check=True)
    
    print("[v0] Committing changes...")
    commit_msg = "fix: correct TestType enum values in big-five results page - use 'Big Five' instead of 'Despega Brújula'"
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    
    print("[v0] Pushing changes to remote...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    
    print("[v0] ✓ Changes pushed successfully!")
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
except Exception as e:
    print(f"[v0] Error: {e}")
