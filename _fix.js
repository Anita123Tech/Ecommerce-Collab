const fs = require('fs');

// --- style.min.css ---
let minCss = fs.readFileSync('css/style.min.css', 'utf8');

// nav-links: absolute→fixed, translateY→translateX, z-index 100→1000
const navLinksMinOld = '.nav-links{position:absolute;top:100%;left:0;width:100%;background:var(--white);flex-direction:column;padding:20px 16px;gap:0;box-shadow:0 4px 20px rgba(0,0,0,.1);transform:translateY(-120%);transition:var(--transition);z-index:100;border-bottom:2px solid var(--primary);height:auto;max-height:calc(100vh - 112px);overflow-y:auto;visibility:hidden}';
const navLinksMinNew = '.nav-links{position:fixed;top:112px;left:0;width:100%;background:var(--white);flex-direction:column;padding:20px 16px;gap:0;box-shadow:0 4px 20px rgba(0,0,0,.1);transform:translateX(-100%);transition:var(--transition);z-index:1000;border-bottom:2px solid var(--primary);height:auto;max-height:calc(100vh - 112px);overflow-y:auto;visibility:hidden}';

if (minCss.includes(navLinksMinOld)) {
  minCss = minCss.split(navLinksMinOld).join(navLinksMinNew);
  console.log('style.min.css: nav-links updated');
} else {
  console.log('style.min.css: nav-links pattern NOT FOUND');
}

// .nav-links.open transform
const openOld = '.nav-links.open{transform:translateY(0);visibility:visible}';
const openNew = '.nav-links.open{transform:translateX(0);visibility:visible}';
if (minCss.includes(openOld)) {
  minCss = minCss.split(openOld).join(openNew);
  console.log('style.min.css: nav-links.open updated');
} else {
  console.log('style.min.css: nav-links.open pattern NOT FOUND');
}

// nav-overlay z-index 99 -> 999
const overlayOld = 'z-index:99;opacity:0;visibility:hidden;transition:var(--transition)}.nav-overlay.open';
const overlayNew = 'z-index:999;opacity:0;visibility:hidden;transition:var(--transition)}.nav-overlay.open';
if (minCss.includes(overlayOld)) {
  minCss = minCss.split(overlayOld).join(overlayNew);
  console.log('style.min.css: nav-overlay z-index updated');
} else {
  console.log('style.min.css: nav-overlay pattern NOT FOUND');
}

fs.writeFileSync('css/style.min.css', minCss);

// --- HTML files ---
const files = ['index.html', 'bridal.html', 'daily.html', 'summer.html', 'kids.html', 'sale.html'];

files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  
  // 1. Viewport meta tag
  const oldMeta = '<meta name="viewport" content="width=device-width,initial-scale=1">';
  const newMeta = '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">';
  if (html.includes(oldMeta)) {
    html = html.split(oldMeta).join(newMeta);
  }
  
  // 2. Inline CSS changes (inside <style>)
  const styleStart = html.indexOf('<style>');
  const styleEnd = html.indexOf('</style>', styleStart);
  if (styleStart < 0 || styleEnd < 0) { console.log(file + ': no style tag, skipping inline CSS'); return; }
  
  let css = html.substring(styleStart + 7, styleEnd);
  let original = css;
  
  // Replace nav-links rule in 768px block
  const navLinksPattern = '.nav-links{position:absolute;top:100%;left:0;width:100%;background:var(--white);flex-direction:column;padding:20px 16px;gap:0;box-shadow:0 4px 20px rgba(0,0,0,.1);transform:translateY(-120%);transition:var(--transition);z-index:100;border-bottom:2px solid var(--primary);height:auto;max-height:calc(100vh - 112px);overflow-y:auto;visibility:hidden}';
  const navLinksReplace = '.nav-links{position:fixed;top:112px;left:0;width:100%;background:var(--white);flex-direction:column;padding:20px 16px;gap:0;box-shadow:0 4px 20px rgba(0,0,0,.1);transform:translateX(-100%);transition:var(--transition);z-index:1000;border-bottom:2px solid var(--primary);height:auto;max-height:calc(100vh - 112px);overflow-y:auto;visibility:hidden}';
  css = css.split(navLinksPattern).join(navLinksReplace);
  
  // Replace nav-links.open
  css = css.split('.nav-links.open{transform:translateY(0);visibility:visible}').join('.nav-links.open{transform:translateX(0);visibility:visible}');
  
  // Replace nav-overlay z-index
  css = css.split('z-index:99;opacity:0;visibility:hidden;transition:var(--transition)}.nav-overlay.open').join('z-index:999;opacity:0;visibility:hidden;transition:var(--transition)}.nav-overlay.open');
  
  if (css !== original) {
    html = html.substring(0, styleStart + 7) + css + html.substring(styleEnd);
    fs.writeFileSync(file, html, 'utf8');
    console.log(file + ': updated inline CSS (+viewport)');
  } else {
    // If inline CSS didn't change, at least viewport was updated
    fs.writeFileSync(file, html, 'utf8');
    console.log(file + ': viewport updated (inline CSS unchanged)');
  }
});

console.log('Done');
