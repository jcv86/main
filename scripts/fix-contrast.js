#!/usr/bin/env node

/**
 * Script para reemplazar patrones de bajo contraste con alto contraste
 * Ejecutar: node scripts/fix-contrast.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const contrastReplacements = [
  // text-muted patterns
  { pattern: /text-muted\/20/g, replacement: 'text-white/80' },
  { pattern: /text-muted\/30/g, replacement: 'text-white/85' },
  { pattern: /text-muted\/40/g, replacement: 'text-white/75' },
  { pattern: /text-muted\/50/g, replacement: 'text-white/70' },
  
  // dark mode muted patterns
  { pattern: /dark:text-muted\/20/g, replacement: 'dark:text-white/80' },
  { pattern: /dark:text-muted\/30/g, replacement: 'dark:text-white/85' },
  { pattern: /dark:text-muted\/40/g, replacement: 'dark:text-white/75' },
  { pattern: /dark:text-muted\/50/g, replacement: 'dark:text-white/70' },
  
  // dark mode color patterns (/20 and /30 are too faint)
  { pattern: /dark:text-slate\/20/g, replacement: 'dark:text-slate-300' },
  { pattern: /dark:text-slate\/30/g, replacement: 'dark:text-slate-200' },
  { pattern: /dark:text-blue\/20/g, replacement: 'dark:text-blue-300' },
  { pattern: /dark:text-blue\/30/g, replacement: 'dark:text-blue-200' },
  { pattern: /dark:text-yellow\/20/g, replacement: 'dark:text-yellow-300' },
  { pattern: /dark:text-yellow\/30/g, replacement: 'dark:text-yellow-200' },
  { pattern: /dark:text-emerald\/20/g, replacement: 'dark:text-emerald-300' },
  { pattern: /dark:text-emerald\/30/g, replacement: 'dark:text-emerald-200' },
  { pattern: /dark:text-purple\/20/g, replacement: 'dark:text-purple-300' },
  { pattern: /dark:text-purple\/30/g, replacement: 'dark:text-purple-200' },
  
  // text-slate/gray patterns (too faint on dark)
  { pattern: /text-slate-400/g, replacement: 'text-slate-200' },
  { pattern: /text-slate-500/g, replacement: 'text-slate-300' },
  { pattern: /text-gray-400/g, replacement: 'text-gray-200' },
  { pattern: /text-gray-500/g, replacement: 'text-gray-300' },
  
  // text-muted-foreground patterns
  { pattern: /text-muted-foreground\/50/g, replacement: 'text-white/70' },
];

const files = glob.sync('**/*.{tsx,ts,jsx,js}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', '.git/**'],
  cwd: process.cwd()
});

let totalReplacements = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    contrastReplacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        totalReplacements += matches.length;
        console.log(`  ${file}: Found ${matches.length} instances of ${pattern}`);
        content = content.replace(pattern, replacement);
      }
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✓ Updated: ${file}`);
    }
  } catch (e) {
    // Skip files that can't be read
  }
});

console.log(`\n✅ Total replacements made: ${totalReplacements}`);
