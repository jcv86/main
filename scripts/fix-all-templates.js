import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

function fixAllBrokenTemplates(content) {
  let result = content;
  
  // Fix pattern 1: className={`...content without closing backtick and brace
  // This matches: className={`something but not closed
  // We need to add `} at the end
  result = result.replace(/className=\{`([^`}]*?)(\s*(?:\/?>|$))/gm, (match, classContent, ending) => {
    // If there's no closing backtick and brace, add it
    if (!match.includes('`}')) {
      return `className={\`${classContent}\`}${ending}`;
    }
    return match;
  });
  
  // Fix pattern 2: Handles multiline cases where opening { ` is on one line
  const lines = result.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Count unclosed template literals
    const openCount = (line.match(/\{`/g) || []).length;
    const closeCount = (line.match(/`}/g) || []).length;
    
    if (openCount > closeCount) {
      // This line has unclosed template literals
      const diff = openCount - closeCount;
      for (let j = 0; j < diff; j++) {
        // Add closing `} at the end of meaningful content
        if (line.trim().endsWith('>') || line.trim().endsWith('/>')) {
          // Already has closing tag, insert before it
          lines[i] = line.replace(/(\s*\/?>)$/, '`}$1');
        } else if (!line.includes('`}')) {
          // No closing yet, add at end of line
          lines[i] = line.trimEnd() + '`}';
        }
      }
    }
  }
  result = lines.join('\n');
  
  // Clean up any double closing
  result = result.replace(/`}`}/g, '`}');
  
  return result;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixed = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      fixed += processDirectory(fullPath);
    } else if (file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const modified = fixAllBrokenTemplates(content);
        
        if (modified !== content) {
          fs.writeFileSync(fullPath, modified, 'utf-8');
          console.log(`✓ Fixed: ${fullPath}`);
          fixed++;
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  }
  
  return fixed;
}

console.log('🔧 Fixing all remaining broken template literals...\n');
let totalFixed = 0;
totalFixed += processDirectory(path.join(projectRoot, 'app'));
totalFixed += processDirectory(path.join(projectRoot, 'components'));
console.log(`\n✅ Fixed ${totalFixed} files!`);
