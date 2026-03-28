#!/usr/bin/env python3
import subprocess
import os

os.chdir("/vercel/share/v0-project")

try:
    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(["git", "commit", "-m", "fix: add missing props to TestCompletionScreen and TestIntroScreen components - dimensions, keyInsight, onViewFullReport, onTalkToCoach, onBack"], check=True)
    subprocess.run(["git", "push", "origin", "HEAD"], check=True)
    print("[v0] Successfully pushed all fixes to GitHub")
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
