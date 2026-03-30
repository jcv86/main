#!/usr/bin/env node

/**
 * Script para automatizar reemplazo de terminología antigua
 * Uso: node fix-terminology.js
 * 
 * Este script reemplaza:
 * - "Origen" → "El Ritual"
 * - "Ruta" → "Exploración"  
 * - "Impulso" → "Entrenamiento"
 * - "Radar" → "La Realidad"
 */

const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  { old: /\bOrigen\b/g, new: 'El Ritual' },
  { old: /\bRuta\b/g, new: 'Exploración' },
  { old: /\bImpulso\b/g, new: 'Entrenamiento' },
  { old: /\bRadar\b/g, new: 'La Realidad' },
  // Variaciones con lowercase
  { old: /\"origen\"/gi, new: '"El Ritual"' },
  { old: /\"ruta\"/gi, new: '"Exploración"' },
  { old: /\"impulso\"/gi, new: '"Entrenamiento"' },
  { old: /\"radar\"/gi, new: '"La Realidad"' },
];

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDir(filePath, callback);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

let filesModified = 0;
let totalReplacements = 0;

walkDir(process.cwd(), (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    REPLACEMENTS.forEach(({ old, new: replacement }) => {
      const matches = content.match(old);
      if (matches) {
        console.log(`  ${path.relative(process.cwd(), filePath)}: ${matches.length} replacements`);
        content = content.replace(old, replacement);
        totalReplacements += matches.length;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      filesModified++;
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
});

console.log(`\n✅ Completado: ${filesModified} archivos modificados, ${totalReplacements} reemplazos totales`);
