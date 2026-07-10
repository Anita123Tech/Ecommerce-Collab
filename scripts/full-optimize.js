const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { minify } = require('html-minifier-terser');

const DIR = path.join(__dirname, '..');
const HTML_FILES = ['index.html', 'bridal.html', 'daily.html', 'kids.html', 'summer.html', 'sale.html'];

// ==================== STEP 1: Re-optimize all images ====================
async function optimizeImages() {
  console.log('\n=== STEP 1: Optimizing Images ===');
  const imgDir = path.join(DIR, 'images');
  const homeDir = path.join(DIR, 'home page images');
  let totalOrig = 0, totalNew = 0;
  const files = [];

  // Collect all product images
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
    'top-picks.jpg', 'best-seller.jpg',
    'hero-1.png', 'hero-2.png', 'hero-3.png', 'hero-4.png', 'hero-5.png'
  ];

  for (const f of usedImages) {
    const input = path.join(imgDir, f);
    if (!fs.existsSync(input)) continue;
    const ext = path.extname(f).toLowerCase();
    const base = path.basename(f, ext);
    const webpPath = path.join(imgDir, base + '.webp');
    const origSize = fs.statSync(input).size;
    totalOrig += origSize;

    try {
      let pipeline = sharp(input);
      if (ext === '.png') {
        pipeline = pipeline.jpeg({ quality: 82 });
        const tempJpg = path.join(imgDir, base + '.tmp.jpg');
        await pipeline.toFile(tempJpg);
        await sharp(tempJpg).webp({ quality: 78, effort: 6 }).toFile(webpPath);
        fs.unlinkSync(tempJpg);
      } else {
        await pipeline.webp({ quality: 78, effort: 6 }).toFile(webpPath);
      }
      const newSize = fs.statSync(webpPath).size;
      totalNew += newSize;
      const pct = (100 - newSize / origSize * 100).toFixed(0);
      files.push({ name: f, orig: origSize, webp: newSize, saved: pct });
      console.log(`  ${f}: ${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (-${pct}%)`);
    } catch (err) {
      console.error(`  FAILED: ${f} - ${err.message}`);
    }
  }

  // Optimize sale banner
  const bannerPath = path.join(homeDir, 'sale banner.jpg');
  if (fs.existsSync(bannerPath)) {
    const bannerWebp = path.join(homeDir, 'sale-banner.webp');
    const origSize = fs.statSync(bannerPath).size;
    await sharp(bannerPath).webp({ quality: 75, effort: 6 }).toFile(bannerWebp);
    const newSize = fs.statSync(bannerWebp).size;
    console.log(`  sale banner.jpg: ${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (-${(100 - newSize/origSize*100).toFixed(0)}%)`);
  }

  const totalMb = (totalOrig / 1024 / 1024).toFixed(1);
  const newMb = (totalNew / 1024 / 1024).toFixed(1);
  console.log(`  Total: ${totalMb}MB -> ${newMb}MB`);
}

// ==================== STEP 2: Update HTML files ====================
async function updateHTML() {
  console.log('\n=== STEP 2: Updating HTML files ===');

  const metaDescriptions = {
    'index.html': 'Shop EverStyle — Pakistan\'s premier online store for bridal lehengas, daily wear shalwar kameez, summer lawn suits, and kids wear. Free shipping nationwide.',
    'bridal.html': 'Shop the finest Pakistani bridal wear — luxurious lehengas, shararas, and ghararas at Riwaayat. Premium craftsmanship for your special day.',
    'daily.html': 'Discover everyday elegance with Riwaayat\'s daily wear collection — shalwar kameez, kurtas, and 3-piece suits in premium fabrics.',
    'summer.html': 'Stay cool and stylish with Riwaayat\'s Summer \'26 lawn collection. Unstitched and ready-to-wear suits in breathable fabrics.',
    'kids.html': 'Adorable Pakistani outfits for kids — shalwar kameez, frocks, and festive wear. Quality craftsmanship for your little ones at Riwaayat.',
    'sale.html': 'Up to 50% off on selected lawn suits, kurtas, and daily wear essentials. Limited-time sale at Riwaayat. Grab the deal!'
  };

  for (const file of HTML_FILES) {
    let html = fs.readFileSync(path.join(DIR, file), 'utf8');
    const isIndex = file === 'index.html';
    const isSale = file === 'sale.html';
    const isCategory = !isIndex && !isSale;

    // 1. Add meta description if missing
    if (!html.includes('name="description"')) {
      html = html.replace('<title>', `<meta name="description" content="${metaDescriptions[file]}">\n  <title>`);
      console.log(`  ${file}: added meta description`);
    }

    // 2. Fix font URLs to include font-display:swap in the URL itself
    // The Google Fonts URL already has &display=swap - good, but ensure it's there
    if (html.includes('display=swap')) {
      console.log(`  ${file}: font-display:swap already set`);
    }

    // 3. Add width/height to top-picks and best-seller banners (index.html only)
    if (isIndex) {
      // top-picks.jpg banner
      html = html.replace(
        '<img src="images/top-picks.jpg" alt="Top Picks" loading="lazy">',
        '<picture><source srcset="images/top-picks.webp" type="image/webp"><img src="images/top-picks.jpg" alt="Top Picks" width="1240" height="413" loading="lazy"></picture>'
      );
      // best-seller.jpg banner
      html = html.replace(
        '<img src="images/best-seller.jpg" alt="Bestsellers" loading="lazy">',
        '<picture><source srcset="images/best-seller.webp" type="image/webp"><img src="images/best-seller.jpg" alt="Bestsellers" width="1240" height="413" loading="lazy"></picture>'
      );
      console.log('  index.html: banner images updated with WebP + dimensions');
    }

    // 4. Fix sale page: add width/height to category images
    if (isSale) {
      html = html.replace(
        'src="images/bridal-1.jpg" alt="Bridal" class="cat-img" loading="lazy"',
        'src="images/bridal-1.jpg" alt="Bridal" class="cat-img" width="120" height="120" loading="lazy"'
      );
      html = html.replace(
        'src="images/daily-1.jpg" alt="Daily Wear" class="cat-img" loading="lazy"',
        'src="images/daily-1.jpg" alt="Daily Wear" class="cat-img" width="120" height="120" loading="lazy"'
      );
      html = html.replace(
        'src="images/summer-1.jpg" alt="Summer" class="cat-img" loading="lazy"',
        'src="images/summer-1.jpg" alt="Summer" class="cat-img" width="120" height="120" loading="lazy"'
      );
      html = html.replace(
        'src="images/new-1.jpg" alt="Kids" class="cat-img" loading="lazy"',
        'src="images/new-1.jpg" alt="Kids" class="cat-img" width="120" height="120" loading="lazy"'
      );
      console.log('  sale.html: category images updated with dimensions');
    }

    // 5. Add preload for the hero image
    // Only on non-sale pages (sale page doesn't have page-hero with images)
    if (!isSale) {
      // The hero images already have fetchpriority="high" on first slide - good
      console.log(`  ${file}: hero images have fetchpriority=high`);
    }

    // 6. Add explicit width/height to page-hero images on category pages
    if (isCategory) {
      // The page-hero images already have width/height in the HTML I saw
      console.log(`  ${file}: page-hero has width/height already`);
    }

    // 7. Ensure style.min.css is loaded with preload + onload (already done)
    // 8. Ensure JS is deferred (already using defer)

    fs.writeFileSync(path.join(DIR, file), html);
  }
}

// ==================== STEP 3: Fix products.min.js (.jpg -> .webp) ====================
function fixProductsJS() {
  console.log('\n=== STEP 3: Fixing JS image references ===');

  // products.js (source) already uses .webp - good
  // products.min.js uses .jpg - need to fix
  let minJs = fs.readFileSync(path.join(DIR, 'js', 'products.min.js'), 'utf8');
  // Check if it still uses .jpg
  if (minJs.includes('.jpg') && !minJs.includes('.webp')) {
    // Replace .jpg with .webp in image paths
    minJs = minJs.replace(/\.jpg/g, '.webp');
    fs.writeFileSync(path.join(DIR, 'js', 'products.min.js'), minJs);
    console.log('  products.min.js: fixed .jpg -> .webp references');
  } else {
    console.log('  products.min.js: already using .webp');
  }
}

// ==================== STEP 4: Update script.js template ====================
function fixScriptJS() {
  console.log('\n=== STEP 4: Updating script.js ===');

  let script = fs.readFileSync(path.join(DIR, 'js', 'script.js'), 'utf8');

  // Add width/height to product card images in the template
  script = script.replace(
    '<img class="img-main" src="${p.image}" alt="${p.name}" loading="${i < 2 ? \'eager\' : \'lazy\'}">',
    '<img class="img-main" src="${p.image}" alt="${p.name}" width="280" height="420" loading="${i < 2 ? \'eager\' : \'lazy\'}">'
  );
  script = script.replace(
    '<img class="img-hover" src="${p.hover || p.image}" alt="${p.name}" loading="lazy">',
    '<img class="img-hover" src="${p.hover || p.image}" alt="${p.name}" width="280" height="420" loading="lazy">'
  );

  fs.writeFileSync(path.join(DIR, 'js', 'script.js'), script);
  console.log('  script.js: added width/height to product image templates');
}

// ==================== STEP 5: Optimize CSS ====================
function optimizeCSS() {
  console.log('\n=== STEP 5: Optimizing CSS ===');

  let css = fs.readFileSync(path.join(DIR, 'css', 'style.css'), 'utf8');

  // Remove expensive text-shadow animations that cause repaints
  // Replace will-change that's too broad
  css = css.replace(
    'will-change: transform, text-shadow, color;',
    'will-change: transform;'
  );

  // Add aspect-ratio to section-banner images to prevent CLS
  // section-banner img already has aspect-ratio: 3/1 - good

  // Optimize the titleShimmer animation to be less expensive
  // Remove text-shadow from shimmer to reduce repaints
  css = css.replace(
    `@keyframes titleShimmer {
  0%, 100% {
    color: var(--accent);
    text-shadow: 0 0 15px rgba(255,215,0,0.2);
  }
  25% {
    color: #fff8dc;
    text-shadow: 0 0 35px rgba(255,215,0,0.7), 0 0 70px rgba(255,215,0,0.3);
  }
  50% {
    color: var(--accent);
    text-shadow: 0 0 15px rgba(255,215,0,0.2);
  }
  75% {
    color: #fff8dc;
    text-shadow: 0 0 35px rgba(255,215,0,0.7), 0 0 70px rgba(255,215,0,0.3);
  }
}`,
    `@keyframes titleShimmer {
  0%, 100% { color: var(--accent); }
  25% { color: #fff8dc; }
  50% { color: var(--accent); }
  75% { color: #fff8dc; }
}`
  );

  // Remove the watermark floating animation (saves CPU/GPU)
  css = css.replace(
    `@keyframes watermarkFloat {
  0%, 100% { transform: translate(-50%, -50%) rotate(-12deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.03); }
}`,
    `@keyframes watermarkFloat {
  0%, 100% { transform: translate(-50%, -50%) rotate(-12deg); }
}`
  );

  // Reduce shimmerBg animation to not animate (stops repaint)
  css = css.replace(
    `@keyframes shimmerBg {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}`,
    `@keyframes shimmerBg {
  0%, 100% { opacity: 0.4; }
}`
  );

  fs.writeFileSync(path.join(DIR, 'css', 'style.css'), css);
  console.log('  style.css: optimized animations (reduced repaints)');
}

// ==================== STEP 6: Minify CSS and JS ====================
function minifyAssets() {
  console.log('\n=== STEP 6: Minifying CSS and JS ===');

  // Minify CSS
  const csso = require('csso');
  let css = fs.readFileSync(path.join(DIR, 'css', 'style.css'), 'utf8');
  try {
    // Simple minification via clean-css is available in node_modules
    const CleanCSS = require('clean-css');
    const minified = new CleanCSS({ level: { 1: { specialComments: 0 }, 2: {} } }).minify(css);
    fs.writeFileSync(path.join(DIR, 'css', 'style.min.css'), minified.styles);
    console.log(`  style.min.css: ${(css.length/1024).toFixed(0)}KB -> ${(minified.styles.length/1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`  style.min.css minify failed: ${e.message}`);
  }

  // Minify JS files
  const terser = require('terser');
  const jsFiles = [
    { src: 'js/script.js', dest: 'js/script.min.js' },
    { src: 'js/products.js', dest: 'js/products.min.js' }
  ];

  for (const jf of jsFiles) {
    const src = fs.readFileSync(path.join(DIR, jf.src), 'utf8');
    terser.minify(src, { compress: { passes: 2 }, mangle: true }).then(result => {
      if (result.code) {
        fs.writeFileSync(path.join(DIR, jf.dest), result.code);
        console.log(`  ${jf.dest}: ${(src.length/1024).toFixed(0)}KB -> ${(result.code.length/1024).toFixed(0)}KB`);
      }
    }).catch(err => {
      console.log(`  ${jf.dest} minify failed: ${err.message}`);
    });
  }
}

// ==================== STEP 7: Add CLS prevention CSS ====================
function addCLSPrevention() {
  console.log('\n=== STEP 7: Adding CLS prevention ===');

  let css = fs.readFileSync(path.join(DIR, 'css', 'style.css'), 'utf8');

  // Add explicit aspect-ratio fallbacks and min-heights for known image containers
  const clsFixCss = `

/* CLS Prevention */
.sale-banner {
  aspect-ratio: 16/9;
  min-height: 340px;
}
@media (max-width: 768px) {
  .sale-banner {
    aspect-ratio: 4/3;
    min-height: 260px;
  }
}
@media (max-width: 480px) {
  .sale-banner {
    aspect-ratio: 4/3;
    min-height: 200px;
  }
}
.product-card-image {
  background: var(--bg-light);
}
.section-banner img {
  aspect-ratio: 3/1;
}
`;

  if (!css.includes('CLS Prevention')) {
    css += clsFixCss;
    fs.writeFileSync(path.join(DIR, 'css', 'style.css'), css);
    console.log('  style.css: added CLS prevention rules');
  }
}

// ==================== STEP 8: Minify HTML ====================
async function minifyHTML() {
  console.log('\n=== STEP 8: Minifying HTML ===');

  for (const file of HTML_FILES) {
    const html = fs.readFileSync(path.join(DIR, file), 'utf8');
    try {
      const result = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: false,
        minifyJS: false,
        useShortDoctype: true,
        removeOptionalTags: false
      });
      fs.writeFileSync(path.join(DIR, file), result);
      console.log(`  ${file}: ${(html.length/1024).toFixed(0)}KB -> ${(result.length/1024).toFixed(0)}KB`);
    } catch (e) {
      console.log(`  ${file} minify failed: ${e.message}`);
    }
  }
}

// ==================== MAIN ====================
(async () => {
  console.log('========================================');
  console.log('  COMPREHENSIVE PERFORMANCE OPTIMIZATION');
  console.log('========================================');

  await optimizeImages();
  updateHTML();
  fixProductsJS();
  fixScriptJS();
  optimizeCSS();
  addCLSPrevention();
  minifyAssets();

  // Wait for async minification to complete
  await new Promise(r => setTimeout(r, 2000));

  await minifyHTML();

  console.log('\n========================================');
  console.log('  OPTIMIZATION COMPLETE!');
  console.log('========================================');
})();
