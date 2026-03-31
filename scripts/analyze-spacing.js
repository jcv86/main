#!/usr/bin/env node

/**
 * Script para mapear espaciado arbitrario a escala de Tailwind
 * Detecta p-[valor], m-[valor] y sugiere alternativas
 */

const fs = require('fs');
const path = require('path');

// Mapeo de valores arbitrarios comunes a escala Tailwind
const SPACING_MAPPING = {
  '8px': 'p-2',
  '12px': 'p-3', 
  '16px': 'p-4',
  '20px': 'p-5',
  '24px': 'p-6',
  '32px': 'p-8',
  '40px': 'p-10',
  '48px': 'p-12',
  '64px': 'p-16',
};

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

let report = {
  arbitrarySpacing: 0,
  filesAffected: new Set(),
  examples: []
};

const arbitraryRegex = /(p|m|px|py|mt|mb|ml|mr|pt|pb|pl|pr|gap|gap-x|gap-y)-\[([^\]]+)\]/g;

walkDir(process.cwd(), (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;
    
    while ((match = arbitraryRegex.exec(content)) !== null) {
      report.arbitrarySpacing++;
      report.filesAffected.add(path.relative(process.cwd(), filePath));
      
      if (report.examples.length < 20) {
        report.examples.push({
          file: path.relative(process.cwd(), filePath),
          match: match[0],
          property: match[1],
          value: match[2]
        });
      }
    }
  } catch (err) {
    // Ignorar
  }
});

console.log('\n=== REPORTE DE ESPACIADO ARBITRARIO ===\n');
console.log(`Total instancias arbitrarias: ${report.arbitrarySpacing}`);
console.log(`Archivos afectados: ${report.filesAffected.size}\n`);

console.log('Ejemplos (primeros 20):');
report.examples.forEach(ex => {
  console.log(`  ${ex.file}`);
  console.log(`    ${ex.match} → usar escala Tailwind: ${ex.property}-${Math.round(parseInt(ex.value) / 4)}`);
});

console.log(`\nRecomendación: Reemplazar con valores de escala Tailwind (1=4px, 2=8px, 3=12px, etc)`);
