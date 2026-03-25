import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

try:
    # Stage all changes
    subprocess.run(['git', 'add', '-A'], check=True)
    
    # Commit with timestamp
    import time
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    subprocess.run(['git', 'commit', '-m', f'Force redeploy: {timestamp}'], check=True)
    
    # Push to remote
    subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)
    
    print("[v0] Successfully pushed changes to GitHub for redeploy")
    sys.exit(0)
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Git operation failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
