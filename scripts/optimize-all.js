const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..');

// 1. Fix index.html banner images: add WebP, width/height
let indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Replace top-picks.jpg and best-seller.jpg with WebP + dimensions
indexHtml = indexHtml.replace(
  /<img src="images\/top-picks\.jpg" alt="Top Picks" loading="lazy">/g,
  '<picture><source srcset="images/top-picks.webp" type="image/webp"><img src="images/top-picks.jpg" alt="Top Picks" width="1240" height="413" loading="lazy"></picture>'
);
indexHtml = indexHtml.replace(
  /<img src="images\/best-seller\.jpg" alt="Bestsellers" loading="lazy">/g,
  '<picture><source srcset="images/best-seller.webp" type="image/webp"><img src="images/best-seller.jpg" alt="Bestsellers" width="1240" height="413" loading="lazy"></picture>'
);

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
console.log('✓ index.html: banner images updated to WebP with dimensions');

// 2. Update script.js: add width/height to product images, optimize animations
let scriptJs = fs.readFileSync(path.join(dir, 'js', 'script.js'), 'utf8');

// Add width/height to product card images
scriptJs = scriptJs.replace(
  '<img class="img-main" src="${p.image}" alt="${p.name}" loading="${i < 2 ? \'eager\' : \'lazy\'}">',
  '<img class="img-main" src="${p.image}" alt="${p.name}" width="280" height="420" loading="${i < 2 ? \'eager\' : \'lazy\'}">'
);
scriptJs = scriptJs.replace(
  '<img class="img-hover" src="${p.hover || p.image}" alt="${p.name}" loading="lazy">',
  '<img class="img-hover" src="${p.hover || p.image}" alt="${p.name}" width="280" height="420" loading="lazy">'
);

console.log('✓ script.js: product images width/height added');

// 3. Optimize animations in style.css — the original source
let styleCss = fs.readFileSync(path.join(dir, 'css', 'style.css'), 'utf8');

// Remove animations that cause repaints (text-shadow in shimmer/glow)
// Replace will-change with more targeted hints
styleCss = styleCss.replace(
  'will-change: transform, text-shadow, color;',
  'will-change: transform;'
);

fs.writeFileSync(path.join(dir, 'css', 'style.css'), styleCss);
console.log('✓ style.css: optimized animation properties');

// 4. Add meta descriptions to all HTML pages
const htmlFiles = ['bridal.html', 'daily.html', 'summer.html', 'kids.html', 'sale.html'];
const metaTags = {
  'bridal.html': 'Shop the finest Pakistani bridal wear — luxurious lehengas, shararas, and ghararas at Riwaayat. Premium craftsmanship for your special day.',
  'daily.html': 'Discover everyday elegance with Riwaayat\'s daily wear collection — shalwar kameez, kurtas, and 3-piece suits in premium fabrics.',
  'summer.html': 'Stay cool and stylish with Riwaayat\'s Summer \'26 lawn collection. Unstitched and ready-to-wear suits in breathable fabrics.',
  'kids.html': 'Adorable Pakistani outfits for kids — shalwar kameez, frocks, and festive wear. Quality craftsmanship for your little ones at Riwaayat.',
  'sale.html': 'Up to 50% off on selected lawn suits, kurtas, and daily wear essentials. Limited-time sale at Riwaayat. Grab the deal!'
};

for (const [file, desc] of Object.entries(metaTags)) {
  let html = fs.readFileSync(path.join(dir, file), 'utf8');
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  } else {
    html = html.replace('<title>', `<meta name="description" content="${desc}">\n  <title>`);
  }
  fs.writeFileSync(path.join(dir, file), html);
  console.log(`✓ ${file}: meta description added`);
}

console.log('\nAll optimizations applied!');
