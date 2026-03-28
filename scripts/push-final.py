#!/usr/bin/env python3
import subprocess
import sys

print("[v0] Adding all changes...")
subprocess.run(["git", "add", "-A"], check=True)

print("[v0] Committing changes...")
subprocess.run([
    "git", "commit", "-m",
    "fix: resolve whatItMeasures prop type - must be string array"
], check=True)

print("[v0] Pushing to origin...")
subprocess.run(["git", "push", "origin", "HEAD"], check=True)

print("[v0] ✓ All changes pushed successfully!")
sys.exit(0)
