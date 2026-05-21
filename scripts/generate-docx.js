const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, BorderStyle } = require('docx');

// Archivos a convertir
const files = [
  'README_TECHNICAL.md',
  'MVP_PROGRESS_CHECKLIST.md',
  'TECHNICAL_ARCHITECTURE.md',
  'GIT_AND_DEPLOY_STATUS.md',
  'INVESTOR_BRIEF.md',
  'DOWNLOAD_AND_USE.md',
  'PAQUETE_COMPLETADO.md',
];

function markdownToDocx(mdContent, filename) {
  const lines = mdContent.split('\n');
  const paragraphs = [];

  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        paragraphs.push(
          new Paragraph({
            text: codeBlockContent.join('\n'),
            style: 'Normal',
            shading: { fill: 'E8E8E8' },
            border: {
              top: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
              left: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
              right: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { line: 240, lineRule: 'auto' },
          })
        );
        codeBlockContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Skip empty lines
    if (!line.trim()) {
      paragraphs.push(new Paragraph({ text: '', spacing: { line: 240 } }));
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      paragraphs.push(
        new Paragraph({
          text: line.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120, line: 240 },
          bold: true,
          size: 32,
        })
      );
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100, line: 240 },
          bold: true,
          size: 28,
        })
      );
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80, line: 240 },
          bold: true,
          size: 24,
        })
      );
      continue;
    }

    // Bold and italic
    let processedText = line
      .replace(/\*\*(.*?)\*\*/g, (match, text) => text)
      .replace(/_(.*?)_/g, (match, text) => text);

    // Regular paragraph
    paragraphs.push(
      new Paragraph({
        text: processedText,
        spacing: { line: 240, lineRule: 'auto', after: 100 },
        alignment: AlignmentType.LEFT,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return doc;
}

async function generateAll() {
  console.log('[v0] Iniciando generación de archivos .docx en español...');

  for (const filename of files) {
    const filepath = path.join(__dirname, '..', filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  ${filename} no encontrado`);
      continue;
    }

    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      const doc = markdownToDocx(content, filename);
      
      const outputName = filename.replace('.md', '.docx');
      const outputPath = path.join(__dirname, '..', 'public', 'documentos', outputName);
      
      // Crear carpeta si no existe
      const docDir = path.dirname(outputPath);
      if (!fs.existsSync(docDir)) {
        fs.mkdirSync(docDir, { recursive: true });
      }
      
      // Usar Packer.toBuffer en lugar de toFile
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ ${outputName} generado exitosamente`);
    } catch (error) {
      console.error(`❌ Error generando ${filename}:`, error.message);
    }
  }

  console.log('\n[v0] ✅ Generación de archivos .docx completada!');
  console.log('[v0] Archivos disponibles en: public/documentos/');
}

generateAll().catch(console.error);
