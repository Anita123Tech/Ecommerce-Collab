const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..');

console.log('=== VERIFICATION ===\n');

// 1. Check products.min.js references
const pj = fs.readFileSync(path.join(DIR, 'js', 'products.min.js'), 'utf8');
console.log('1. products.min.js:');
console.log('   .webp references:', pj.includes('.webp') ? 'YES' : 'NO');
console.log('   .jpg references:', pj.includes('.jpg') ? 'YES' : 'NO');

// 2. Check HTML files
console.log('\n2. HTML files:');
const htmlFiles = ['index.html','bridal.html','daily.html','kids.html','summer.html','sale.html'];
for (const f of htmlFiles) {
  const c = fs.readFileSync(path.join(DIR, f), 'utf8');
  const size = (c.length / 1024).toFixed(1);
  const meta = c.includes('description') ? 'YES' : 'NO';
  const defer = ((c.match(/defer/g) || []).length).toString();
  const webp = c.includes('.webp') ? 'YES' : 'NO';
  console.log('   ' + f + ': ' + size + 'KB, meta=' + meta + ', defer=' + defer + ', webp=' + webp);
}

// 3. Check script.js
const sj = fs.readFileSync(path.join(DIR, 'js', 'script.js'), 'utf8');
console.log('\n3. script.js:');
console.log('   width/height in template:', sj.includes('width="280"') ? 'YES' : 'NO');

// 4. Check CSS
const css = fs.readFileSync(path.join(DIR, 'css', 'style.css'), 'utf8');
console.log('\n4. style.css:');
console.log('   CLS prevention:', css.includes('CLS Prevention') ? 'YES' : 'NO');
console.log('   will-change reduced:', !css.includes('will-change: transform, text-shadow') ? 'YES' : 'NO');

// 5. Check webp total size
console.log('\n5. Image sizes (WebP):');
const imgDir = path.join(DIR, 'images');
const webps = fs.readdirSync(imgDir).filter(f => f.endsWith('.webp'));
let total = 0;
for (const f of webps) {
  total += fs.statSync(path.join(imgDir, f)).size;
}
const totalMB = (total / 1024 / 1024).toFixed(2);
const prevTotal = 5.6; // Original total was ~5.6MB
console.log('   Total WebP size: ' + totalMB + 'MB (was ~' + prevTotal + 'MB, saved ' + (100 - total/(prevTotal*1024*1024)*100).toFixed(0) + '%)');

console.log('\n=== VERIFICATION COMPLETE ===');
