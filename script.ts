import fs from 'fs';
import path from 'path';

const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf-8');

// Replace <SafeImage src="/..." ... /> with <img src="/..." ... />
content = content.replace(/<SafeImage src="\//g, '<img loading="lazy" src="/');

fs.writeFileSync(appTsxPath, content);
console.log('Replaced local SafeImage usages with img tags.');
