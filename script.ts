import fs from 'fs';
const stat = fs.statSync('restore-images.js');
console.log('Size:', stat.size / 1024 / 1024, 'MB');
