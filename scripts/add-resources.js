const fs = require('fs');
const path = require('path');

const taskDetailsPath = path.join(__dirname, '../lib/task-details.ts');
let content = fs.readFileSync(taskDetailsPath, 'utf-8');

// Recursos para Mes 2 (31-60)
const mes2Resources = {
  31: [{ title: 'Udemy', type: 'course', url: 'https://www.udemy.com' }, { title: 'Coursera', type: 'course', url: 'https://www.coursera.org' }, { title: 'Platzi', type: 'course', url: 'https://www.platzi.com' }],
  32: [{ title: 'LinkedIn Jobs', type: 'tool', url: 'https://www.linkedin.com/jobs' }, { title: 'Glassdoor', type: 'tool', url: 'https://www.glassdoor.com' }, { title: 'Indeed', type: 'tool', url: 'https://www.indeed.com' }],
  35: [{ title: 'GitHub', type: 'tool', url: 'https://github.com' }, { title: 'Dev.to', type: 'article', url: 'https://dev.to' }, { title: 'Medium', type: 'article', url: 'https://medium.com' }],
  42: [{ title: 'LinkedIn Groups', type: 'tool', url: 'https://www.linkedin.com/groups' }, { title: 'Discord', type: 'tool', url: 'https://discord.com' }, { title: 'Meetup.com', type: 'tool', url: 'https://www.meetup.com' }],
  48: [{ title: 'LinkedIn', type: 'tool', url: 'https://www.linkedin.com' }, { title: 'Gmail', type: 'tool', url: 'https://mail.google.com' }],
  52: [{ title: 'Glassdoor', type: 'tool', url: 'https://www.glassdoor.com' }, { title: 'LinkedIn Job Search', type: 'tool', url: 'https://www.linkedin.com/jobs' }],
  55: [{ title: 'Notion', type: 'tool', url: 'https://www.notion.so' }, { title: 'Google Sheets', type: 'tool', url: 'https://sheets.google.com' }],
  60: [{ title: 'Notion', type: 'tool', url: 'https://www.notion.so' }, { title: 'Medium', type: 'article', url: 'https://medium.com' }]
};

// Recursos para Mes 3 (61-90)
const mes3Resources = {
  61: [{ title: 'Medium', type: 'article', url: 'https://medium.com' }, { title: 'LinkedIn Articles', type: 'article', url: 'https://www.linkedin.com' }],
  65: [{ title: 'Behance', type: 'tool', url: 'https://www.behance.net' }, { title: 'GitHub', type: 'tool', url: 'https://github.com' }],
  70: [{ title: 'Dev.to', type: 'article', url: 'https://dev.to' }, { title: 'HackerNews', type: 'article', url: 'https://news.ycombinator.com' }],
  75: [{ title: 'LinkedIn Learning', type: 'course', url: 'https://www.linkedin.com/learning' }, { title: 'Masterclass', type: 'course', url: 'https://www.masterclass.com' }],
  80: [{ title: 'Levels.fyi', type: 'tool', url: 'https://www.levels.fyi' }, { title: 'Blind', type: 'tool', url: 'https://www.payscale.com' }],
  85: [{ title: 'LinkedIn', type: 'tool', url: 'https://www.linkedin.com' }, { title: 'GitHub', type: 'tool', url: 'https://github.com' }],
  90: [{ title: 'Notion', type: 'tool', url: 'https://www.notion.so' }, { title: 'Medium', type: 'article', url: 'https://medium.com' }]
};

// Combinar todos los recursos
const allResources = { ...mes2Resources, ...mes3Resources };

// Procesar cada día
Object.entries(allResources).forEach(([day, resources]) => {
  const resourcesStr = JSON.stringify(resources);
  // Buscar el patrón: day: X ... resources: []
  const pattern = new RegExp(
    `(day: ${day},.*?)resources: \\[\\]`,
    's'
  );
  
  content = content.replace(pattern, `$1resources: ${resourcesStr}`);
});

fs.writeFileSync(taskDetailsPath, content);
console.log('✓ Resources added to Mes 2 and 3');
