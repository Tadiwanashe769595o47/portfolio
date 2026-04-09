import fs from 'fs';
const content = fs.readFileSync('restore-images.js', 'utf-8');
console.log(content.substring(0, 500));
console.log('...');
console.log(content.substring(content.length - 500));
