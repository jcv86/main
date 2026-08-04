import { access, readFile } from 'node:fs/promises'

const requiredFiles = [
  'public/TESTING_GUIDE.md',
  'public/PRODUCTION_READY_CHECKLIST.md',
  'public/TESTING_LINKS.md',
]

for (const file of requiredFiles) {
  await access(file)
  const content = await readFile(file, 'utf8')
  if (!content.includes('https://github.com/jcv86/main/blob/main/')) {
    throw new Error(`${file} no apunta al documento canónico`)
  }
}

const comenzar = await readFile('app/comenzar/page.tsx', 'utf8')
for (const href of ['/TESTING_GUIDE.md', '/PRODUCTION_READY_CHECKLIST.md', '/TESTING_LINKS.md']) {
  if (!comenzar.includes(`href="${href}"`)) {
    throw new Error(`Falta el enlace público ${href} en /comenzar`)
  }
}

console.log('Public documentation links contract passed')
