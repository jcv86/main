import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

function fixBrokenTemplates(content) {
  let result = content;
  
  // Fix unclosed template literals in className
  // Pattern: className={`...text without closing backtick
  // We need to find the end of the line or next closing brace
  
  // Match className={`...something that's not closed properly
  const lines = result.split('\n');
  const fixedLines = lines.map((line, index) => {
    // Check if line has unclosed template literal in className
    if (line.includes('className={`') && !line.includes('`}')) {
      // This line has an opening template but no closing
      // Check if the closing is on the next line
      if (line.trim().endsWith('{`')) {
        // The entire template is missing, just close it
        return line.replace(/className=\{`$/, 'className={``}');
      }
      
      // Find where the className value should end
      // Look for the next > or /> or newline followed by proper closure
      const match = line.match(/className=\{`([^`]*)/);
      if (match) {
        const beforeTemplate = line.substring(0, line.indexOf('className={`'));
        const content = match[1];
        
        // Find the logical end of this className
        if (line.includes('rounded')) {
          // Find the last style property
          let endIdx = line.lastIndexOf("'");
          if (endIdx === -1) endIdx = line.lastIndexOf('"');
          if (endIdx === -1) endIdx = line.length - 1;
          
          const template = line.substring(line.indexOf('{`') + 2, endIdx + 1);
          return line.substring(0, line.indexOf('{`')) + '{`' + template + '`}' + line.substring(endIdx + 1);
        }
      }
    }
    return line;
  });
  
  result = fixedLines.join('\n');
  
  // More aggressive fix: find all unclosed template literals
  result = result.replace(/className=\{`([^}]+)$/gm, (match) => {
    // If line ends without closing template, close it
    if (!match.includes('`}')) {
      return match + '`}';
    }
    return match;
  });
  
  return result;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixed = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      const result = processDirectory(fullPath);
      fixed += result;
    } else if (file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const modified = fixBrokenTemplates(content);
        
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

console.log('🔧 Fixing broken template literals...\n');
let totalFixed = 0;
totalFixed += processDirectory(path.join(projectRoot, 'app'));
totalFixed += processDirectory(path.join(projectRoot, 'components'));
console.log(`\n✅ Fixed ${totalFixed} files!`);
