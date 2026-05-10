import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

function removeGradients(content) {
  // Remove all bg-gradient-to-* patterns and their color stops
  let result = content;
  
  // Remove entire gradient classes
  result = result.replace(/bg-gradient-to-[a-z]+ from-[^\s]+ (?:via-[^\s]+ )?to-[^\s]+/g, 'bg-background');
  result = result.replace(/bg-gradient-to-[a-z]+ from-[^\s]+/g, 'bg-background');
  
  // Remove orphaned color stops
  result = result.replace(/ from-[a-z0-9\/-]*/g, '');
  result = result.replace(/ to-[a-z0-9\/-]*/g, '');
  result = result.replace(/ via-[a-z0-9\/-]*/g, '');
  result = result.replace(/ dark:from-[a-z0-9\/-]*/g, '');
  result = result.replace(/ dark:to-[a-z0-9\/-]*/g, '');
  result = result.replace(/ dark:via-[a-z0-9\/-]*/g, '');
  
  // Remove text gradients
  result = result.replace(/bg-gradient-to-r [^\s]+ bg-clip-text text-transparent/g, 'text-purple');
  result = result.replace(/bg-\[.*gradient.*\] bg-clip-text text-transparent/g, 'text-purple');
  
  return result;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const modified = removeGradients(content);
        
        if (modified !== content) {
          fs.writeFileSync(fullPath, modified, 'utf-8');
          console.log(`✓ Updated: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  }
}

console.log('🎨 Removing ALL gradients from site...\n');
processDirectory(path.join(projectRoot, 'app'));
processDirectory(path.join(projectRoot, 'components'));
console.log('\n✅ Gradient removal complete!');
