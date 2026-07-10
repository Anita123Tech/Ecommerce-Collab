const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', 'images');
const usedImages = [
  'bridal-1.jpg', 'bridal-2.jpg', 'bridal-3.jpg', 'bridal-4.jpg',
  'bridal-5.jpg', 'bridal-6.jpg', 'bridal-7.jpg', 'bridal-8.jpg',
  'daily-1.jpg', 'daily-2.jpg', 'daily-3.jpg', 'daily-4.jpg',
  'summer-1.jpg', 'summer-2.jpg', 'summer-3.jpg', 'summer-4.jpg',
  'summer-5.jpg', 'summer-6.jpg', 'summer-7.jpg', 'summer-8.jpg',
  'sale-1.jpg', 'sale-2.jpg', 'sale-3.jpg', 'sale-4.jpg',
  'sale-5.jpg', 'sale-6.jpg', 'sale-7.jpg',
  'new-1.jpg', 'new-2.jpg', 'new-3.jpg', 'new-4.jpg',
  'new-5.jpg', 'new-6.jpg', 'new-7.jpg', 'new-8.jpg',
  'top-picks.jpg', 'best-seller.jpg'
];

(async () => {
  let totalOrig = 0, totalWebp = 0;
  for (const f of usedImages) {
    const input = path.join(dir, f);
    if (!fs.existsSync(input)) continue;
    const output = path.join(dir, f.replace(/\.(jpg|png)$/i, '.webp'));
    const orig = fs.statSync(input).size;
    totalOrig += orig;
    try {
      await sharp(input)
        .webp({ quality: 80, effort: 4 })
        .toFile(output);
      const webp = fs.statSync(output).size;
      totalWebp += webp;
      console.log(`${f}: ${(orig/1024).toFixed(0)}KB → ${(webp/1024).toFixed(0)}KB (${(100 - webp/orig*100).toFixed(0)}% saved)`);
    } catch (err) {
      console.error(`FAILED: ${f} - ${err.message}`);
    }
  }
  console.log('---');
  console.log(`Total: ${(totalOrig/1024/1024).toFixed(1)}MB → ${(totalWebp/1024/1024).toFixed(1)}MB (${(100 - totalWebp/totalOrig*100).toFixed(0)}% saved)`);
})();
