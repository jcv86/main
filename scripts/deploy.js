const { execSync } = require('child_process');
const path = require('path');

console.log('[v0] Starting Git deployment...');

try {
  const projectRoot = '/vercel/share/v0-project';
  
  console.log('[v0] Project root:', projectRoot);
  console.log('[v0] Running: git add -A');
  execSync('git add -A', { cwd: projectRoot, stdio: 'inherit' });
  
  console.log('[v0] Running: git commit');
  execSync('git commit -m "fix: resolve all TypeScript compilation errors and type safety issues"', { 
    cwd: projectRoot, 
    stdio: 'inherit' 
  });
  
  console.log('[v0] Running: git push');
  execSync('git push origin HEAD', { cwd: projectRoot, stdio: 'inherit' });
  
  console.log('[v0] ✓ Successfully pushed to Git!');
  console.log('[v0] Vercel deployment will now begin automatically.');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error during deployment:', error.message);
  process.exit(1);
}
