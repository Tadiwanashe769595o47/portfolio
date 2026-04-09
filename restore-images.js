import fs from 'fs';
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
