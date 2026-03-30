#!/usr/bin/env node

/**
 * Script para mapear y reemplazar colores hardcoded con design tokens
 * Analiza archivos y crea un reporte de migración
 */

const fs = require('fs');
const path = require('path');

// Mapeo de colores hardcoded a design tokens
const COLOR_MAPPING = {
  // Rojos
  'bg-red-50': 'bg-background',
  'bg-red-100': 'bg-muted',
  'bg-red-500': 'bg-destructive',
  'text-red-500': 'text-destructive',
  'text-red-600': 'text-destructive',
  'text-red-700': 'text-destructive',
  'text-red-400': 'text-destructive',
  
  // Azules (Primary)
  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary',
  'bg-blue-700': 'bg-primary',
  'text-blue-500': 'text-primary',
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'text-blue-400': 'text-primary',
  'text-blue-600': 'text-primary-foreground',
  'border-blue-500': 'border-primary',
  'from-blue-500': 'from-primary',
  'to-blue-500': 'to-primary',
  
  // Púrpuras (Accent)
  'bg-purple-500': 'bg-accent',
  'bg-purple-600': 'bg-accent',
  'text-purple-500': 'text-accent',
  'text-purple-600': 'text-accent',
  'text-purple-400': 'text-accent',
  'border-purple-500': 'border-accent',
  
  // Grises (Neutral)
  'bg-slate-800': 'bg-card',
  'bg-slate-900': 'bg-background',
  'text-slate-300': 'text-foreground',
  'text-slate-400': 'text-muted-foreground',
  'border-slate-700': 'border',
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
  filesScanned: 0,
  filesWithColors: 0,
  totalColorInstances: 0,
  colorBreakdown: {},
  files: []
};

walkDir(process.cwd(), (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    report.filesScanned++;
    
    let fileColors = {};
    let hasColors = false;
    
    Object.keys(COLOR_MAPPING).forEach(colorClass => {
      const regex = new RegExp(colorClass, 'g');
      const matches = content.match(regex);
      if (matches) {
        fileColors[colorClass] = matches.length;
        report.totalColorInstances += matches.length;
        report.colorBreakdown[colorClass] = (report.colorBreakdown[colorClass] || 0) + matches.length;
        hasColors = true;
      }
    });
    
    if (hasColors) {
      report.filesWithColors++;
      report.files.push({
        path: path.relative(process.cwd(), filePath),
        colors: fileColors
      });
    }
  } catch (err) {
    // Ignorar errores
  }
});

console.log('\n=== REPORTE DE COLORES HARDCODED ===\n');
console.log(`Archivos escaneados: ${report.filesScanned}`);
console.log(`Archivos con colores hardcoded: ${report.filesWithColors}`);
console.log(`Total instancias de color: ${report.totalColorInstances}\n`);

console.log('Top 10 colores más usados:');
Object.entries(report.colorBreakdown)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([color, count]) => {
    console.log(`  ${color}: ${count} instancias → ${COLOR_MAPPING[color]}`);
  });

console.log(`\nDetalles guardados en color-migration-report.json`);
fs.writeFileSync('color-migration-report.json', JSON.stringify(report, null, 2));
