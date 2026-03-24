#!/usr/bin/env python3
import subprocess
import os
import sys

# Change to project directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

try:
    # Add all changes
    print("[v0] Adding all changes to git...")
    subprocess.run(["git", "add", "-A"], check=True, cwd=".")
    
    # Check git status
    print("[v0] Checking git status...")
    result = subprocess.run(["git", "status", "--short"], capture_output=True, text=True, check=True)
    print("[v0] Git status:")
    print(result.stdout)
    
    # Commit changes
    print("[v0] Committing changes...")
    commit_msg = "fix: resolve all TypeScript compilation errors - Supabase client initialization, missing awaits, type annotations, component props, and error handling"
    subprocess.run(["git", "commit", "-m", commit_msg], check=True, cwd=".")
    
    # Push changes
    print("[v0] Pushing changes to remote repository...")
    subprocess.run(["git", "push", "origin", "HEAD"], check=True, cwd=".")
    
    print("[v0] ✓ All changes synced to Git successfully!")
    sys.exit(0)
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Error executing git command: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
