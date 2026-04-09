import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const base64Dir = path.join(process.cwd(), 'base64-images');

if (!fs.existsSync(base64Dir)) {
  fs.mkdirSync(base64Dir, { recursive: true });
}

const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

for (const file of files) {
  const content = fs.readFileSync(path.join(publicDir, file));
  const base64 = content.toString('base64');
  fs.writeFileSync(path.join(base64Dir, `${file}.txt`), base64);
  console.log(`Encoded ${file} to base64 text.`);
}

const restoreScript = `import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const base64Dir = path.join(process.cwd(), 'base64-images');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (fs.existsSync(base64Dir)) {
  const files = fs.readdirSync(base64Dir).filter(f => f.endsWith('.txt'));
  for (const file of files) {
    const base64 = fs.readFileSync(path.join(base64Dir, file), 'utf-8');
    const originalName = file.replace('.txt', '');
    fs.writeFileSync(path.join(publicDir, originalName), Buffer.from(base64, 'base64'));
    console.log('Restored ' + originalName);
  }
} else {
  console.log('No base64-images directory found.');
}
`;

fs.writeFileSync(path.join(process.cwd(), 'restore-images.js'), restoreScript);
console.log('Updated restore-images.js');
