const fs = require('fs');
const path = require('path');
const markdownPdf = require('markdown-pdf');

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
let completed = 0;

documentsToConvert.forEach((file) => {
  const inputPath = path.join(projectRoot, file);
  const outputPath = path.join(projectRoot, file.replace('.md', '.pdf'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠ Skipping ${file} - not found`);
    return;
  }

  markdownPdf().from(inputPath).to(outputPath, (err) => {
    if (err) {
      console.error(`❌ Error converting ${file}: ${err.message}`);
    } else {
      console.log(`✅ Created: ${file.replace('.md', '.pdf')}`);
      completed++;
    }
  });
});

setTimeout(() => {
  console.log(`\n✅ PDF generation complete! Generated ${completed}/${documentsToConvert.length} PDFs`);
}, 5000);
