import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const file = 'anyiculture-screenshot.jpg';
const content = fs.readFileSync(path.join(publicDir, file));
console.log('Local First 50 bytes after restore:', content.slice(0, 50).toString('hex'));
