#!/usr/bin/env python3
import subprocess
import sys
import os

def run_command(cmd, description=""):
    """Execute a shell command and print output."""
    print(f"\n[v0] {description}")
    print(f"[v0] Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.stdout:
        print(f"[v0] Output: {result.stdout}")
    if result.stderr:
        print(f"[v0] Error: {result.stderr}")
    
    if result.returncode != 0:
        print(f"[v0] Command failed with exit code {result.returncode}")
        return False
    return True

def main():
    os.chdir("/vercel/share/v0-project")
    
    # Check git status
    print("[v0] Checking Git status...")
    result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if result.stdout:
        print("[v0] Changed files:")
        print(result.stdout)
    
    # Configure git
    run_command(["git", "config", "user.name", "v0 Bot"], "Configuring Git user name")
    run_command(["git", "config", "user.email", "v0@vercel.com"], "Configuring Git user email")
    
    # Add all changes
    if not run_command(["git", "add", "."], "Adding all changes"):
        print("[v0] Failed to add changes")
        sys.exit(1)
    
    # Commit changes
    commit_msg = "fix: resolve all TypeScript compilation errors and sync changes"
    if not run_command(["git", "commit", "-m", commit_msg], f"Committing with message: {commit_msg}"):
        print("[v0] No changes to commit or commit failed")
    
    # Push changes
    if not run_command(["git", "push", "origin", "v0/jcv86-31968e2c"], "Pushing to remote branch"):
        print("[v0] Failed to push changes")
        sys.exit(1)
    
    print("[v0] All changes successfully synced to GitHub!")
    print("[v0] Branch: v0/jcv86-31968e2c")

if __name__ == "__main__":
    main()
