const fs = require('fs');
const path = require('path');
const marked = require('marked');

const documentsToConvert = [
  'README.md',
  'INVESTOR_BRIEF.md',
  'MVP_PROGRESS_CHECKLIST.md',
  'GIT_AND_DEPLOY_STATUS.md',
  'README_TECHINICAL.md',
  'TECHNICAL_ARCHITECTURE.md',
  'DOWNLOAD_AND_USE.md',
];

const projectRoot = path.join(__dirname, '..');

async function generateHTMLFromMarkdown() {
  const results = [];

  for (const file of documentsToConvert) {
    const inputPath = path.join(projectRoot, file);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ Skipping ${file} - not found`);
      continue;
    }

    const markdownContent = fs.readFileSync(inputPath, 'utf-8');
    const htmlContent = marked.parse(markdownContent);
    
    const outputPath = path.join(projectRoot, file.replace('.md', '.html'));
    
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.replace('.md', '')}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    table th, table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    li {
      margin: 8px 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 16px 0;
      padding-left: 16px;
      color: #666;
    }
    .page-break {
      page-break-after: always;
      margin-top: 40px;
    }
    @media print {
      body { padding: 0; }
      .page-break { page-break-after: always; }
    }
  </style>
</head>
<body>
  ${htmlContent}
  <div class="page-break"></div>
  <footer style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
    <p>Generated on: ${new Date().toISOString().split('T')[0]}</p>
    <p>DTC Platform - Version 6.0.0</p>
  </footer>
</body>
</html>
    `;

    fs.writeFileSync(outputPath, fullHTML);
    console.log(`✅ Created: ${file.replace('.md', '.html')}`);
    results.push(file.replace('.md', '.html'));
  }

  console.log(`\n✅ HTML generation complete! Generated ${results.length}/${documentsToConvert.length} HTML files`);
  console.log('Note: These HTML files can be printed to PDF using your browser (Ctrl+P or Cmd+P)');
}

generateHTMLFromMarkdown().catch(console.error);
