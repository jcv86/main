#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Add all changes
    subprocess.run(['git', 'add', '-A'], check=True)
    print("[v0] Added all changes")
    
    # Commit with message
    subprocess.run([
        'git', 'commit', '-m',
        'fix: use type guards for optional question properties in DISC client rendering'
    ], check=True)
    print("[v0] Committed changes")
    
    # Push to origin
    subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)
    print("[v0] Pushed to GitHub successfully")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Git command failed: {e}")
except Exception as e:
    print(f"[v0] Error: {e}")
