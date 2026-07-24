/**
 * product.js — Product Detail Page Logic
 *
 * Handles:
 *  - Loading product data from the shared `products` object (products.js)
 *  - Image gallery (thumbnail click → main image swap with fade)
 *  - Size selection toggle (S / M / L / XL)
 *  - Color swatch selection toggle
 *  - Quantity selector (+/−, range 1–10)
 *  - Add to Cart button (UI feedback + cart count update)
 *  - Wishlist heart toggle
 *  - Recommended Products rendering (4 cards from same + other categories)
 *
 * Reads URL params: ?cat=bridal&idx=0
 *   cat — category key in the products object (bridal|daily|summer|sale|kids)
 *   idx — product index within that category array
 *
 * Depends on:
 *  - products.min.js (global `products` object)
 *  - script.min.js  (shared fade-in observer, newsletter, back-to-top, etc.)
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     1. PARSE URL PARAMETERS
     ========================================================== */
  var params = new URLSearchParams(window.location.search);
  var category = params.get('cat');
  var index = parseInt(params.get('idx')) || 0;

  /* ==========================================================
     2. LOAD PRODUCT DATA
     ========================================================== */
  var allProducts = typeof products !== 'undefined' ? products : null;
  if (!allProducts) return; // products.js not loaded

  if (!category || !allProducts[category]) {
    category = Object.keys(allProducts)[0];
  }

  var categoryProducts = allProducts[category];
  var product = categoryProducts[index] || categoryProducts[0];

  /* ==========================================================
     3. BUILD GALLERY IMAGE LIST
     Primary image → hover image → next 2 products in category
     This gives us up to 4–5 thumbnails to browse.
     ========================================================== */
  var galleryImages = [product.image];
  if (product.hover) galleryImages.push(product.hover);
  if (categoryProducts.length > 2) {
    galleryImages.push(categoryProducts[2].image);
    if (categoryProducts[3]) galleryImages.push(categoryProducts[3].image);
  }

  /* ==========================================================
     4. CACHE DOM ELEMENTS
     ========================================================== */
  var mainImg = document.getElementById('pd-main-img');
  var thumbsContainer = document.getElementById('pd-thumbnails');
  var titleEl = document.querySelector('.pd-title');
  var priceEl = document.getElementById('pd-price');
  var originalPriceEl = document.getElementById('pd-original-price');
  var badgeEl = document.getElementById('pd-badge');
  var fabricEl = document.getElementById('pd-fabric');
  var breadcrumbLast = document.querySelector('.pd-breadcrumb span');
  var qtyValue = document.getElementById('pd-qty-value');

  /* ==========================================================
     5. POPULATE PRODUCT INFO
     ========================================================== */

  // Main image
  if (mainImg) mainImg.src = galleryImages[0];

  // Title & breadcrumb
  if (titleEl) titleEl.textContent = product.name;
  if (breadcrumbLast) breadcrumbLast.textContent = product.name;

  // Price
  if (priceEl) priceEl.textContent = 'PKR ' + product.price.toLocaleString();

  // Fabric in details table
  if (fabricEl) fabricEl.textContent = product.fabric;

  // Original price (shown only for sale items with originalPrice)
  if (product.originalPrice && originalPriceEl) {
    originalPriceEl.textContent = 'PKR ' + product.originalPrice.toLocaleString();
  } else if (originalPriceEl) {
    originalPriceEl.style.display = 'none';
  }

  // Discount badge (e.g. "50% OFF")
  if (product.originalPrice && badgeEl) {
    var discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    badgeEl.textContent = discount + '% OFF';
  } else if (badgeEl) {
    badgeEl.style.display = 'none';
  }

  /* ==========================================================
     6. RENDER THUMBNAILS
     Replace the static HTML thumbnails with dynamically built ones
     matching the actual gallery image list.
     ========================================================== */
  if (thumbsContainer) {
    thumbsContainer.innerHTML = galleryImages.map(function (src, i) {
      return '<button class="pd-thumb' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" role="option" aria-selected="' + (i === 0) + '">' +
        '<img src="' + src + '" alt="Thumbnail ' + (i + 1) + '" width="80" height="120">' +
        '</button>';
    }).join('');
  }

  /* ==========================================================
     7. RENDER COLOR SWATCHES
     Dynamically replace default color dots from product.colors
     ========================================================== */
  if (product.colors && product.colors.length > 0) {
    var colorsEl = document.getElementById('pd-colors');
    if (colorsEl) {
      colorsEl.innerHTML = product.colors.map(function (c, i) {
        return '<span class="pd-color-dot' + (i === 0 ? ' active' : '') +
          '" style="background:' + c + '" data-color="' + c +
          '" role="radio" aria-checked="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '"></span>';
      }).join('');
    }
  }

  /* ==========================================================
     8. UPDATE BREADCRUMB CATEGORY LINK
     ========================================================== */
  var categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  var breadcrumbLink = document.querySelector('.pd-breadcrumb a:nth-child(2)');
  if (breadcrumbLink) {
    breadcrumbLink.textContent = categoryName;
    breadcrumbLink.href = category + '.html';
  }

  // Update page title
  document.title = product.name + ' — EverStyle';

  // Continue Shopping link
  var continueLink = document.getElementById('pd-continue-link');
  if (continueLink) {
    continueLink.href = category + '.html';
  }

  /* ==========================================================
     9. THUMBNAIL CLICK → SWAP MAIN IMAGE
     Uses opacity fade for smooth transition.
     ========================================================== */
  thumbsContainer.addEventListener('click', function (e) {
    var thumb = e.target.closest('.pd-thumb');
    if (!thumb) return;

    var idx = parseInt(thumb.dataset.index);

    // Fade out, swap source, fade in
    mainImg.style.opacity = '0';
    setTimeout(function () {
      mainImg.src = galleryImages[idx];
      mainImg.style.opacity = '1';
    }, 200);

    // Update active state on all thumbnails
    thumbsContainer.querySelectorAll('.pd-thumb').forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    thumb.classList.add('active');
    thumb.setAttribute('aria-selected', 'true');
  });

  // Apply transition to main image
  mainImg.style.transition = 'opacity 0.3s ease';

  /* ==========================================================
     10. SIZE SELECTION TOGGLE
     Clicking a size button makes it active, removes active from others.
     ========================================================== */
  document.getElementById('pd-sizes').addEventListener('click', function (e) {
    var btn = e.target.closest('.pd-size-btn');
    if (!btn) return;

    this.querySelectorAll('.pd-size-btn').forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
  });

  /* ==========================================================
     11. COLOR SWATCH SELECTION TOGGLE
     ========================================================== */
  document.getElementById('pd-colors').addEventListener('click', function (e) {
    var dot = e.target.closest('.pd-color-dot');
    if (!dot) return;

    this.querySelectorAll('.pd-color-dot').forEach(function (d) {
      d.classList.remove('active');
      d.setAttribute('aria-checked', 'false');
      d.setAttribute('tabindex', '-1');
    });
    dot.classList.add('active');
    dot.setAttribute('aria-checked', 'true');
    dot.setAttribute('tabindex', '0');
  });

  /* ==========================================================
     12. QUANTITY SELECTOR (+/−)
     Range: 1 to 10. Updates the displayed value.
     ========================================================== */
  var qty = 1;
  var qtyMinus = document.getElementById('pd-qty-minus');
  var qtyPlus = document.getElementById('pd-qty-plus');

  qtyMinus.addEventListener('click', function () {
    if (qty > 1) {
      qty--;
      qtyValue.textContent = qty;
    }
  });

  qtyPlus.addEventListener('click', function () {
    if (qty < 10) {
      qty++;
      qtyValue.textContent = qty;
    }
  });

  /* ==========================================================
     13. ADD TO CART + CHECKLIST + localStorage
     Collects selected size, color, quantity, and checklist options.
     Persists cart data in localStorage.
     ========================================================== */
  var checklistPrices = { 'gift-wrap': 200, 'express': 350 };

  function getCart() {
    try { return JSON.parse(localStorage.getItem('everstyle-cart')) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem('everstyle-cart', JSON.stringify(cart));
  }

  function updateCartBadge() {
    var cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    var cart = getCart();
    var total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    cartCount.textContent = total;
  }

  updateCartBadge();

  document.getElementById('pd-add-to-cart').addEventListener('click', function () {
    var btn = this;
    var originalHTML = btn.innerHTML;

    // Gather selected size
    var activeSize = document.querySelector('.pd-size-btn.active');
    var selectedSize = activeSize ? activeSize.dataset.size : 'M';

    // Gather selected color
    var activeColor = document.querySelector('.pd-color-dot.active');
    var selectedColor = activeColor ? activeColor.dataset.color : '';

    // Gather checklist options
    var checkedBoxes = document.querySelectorAll('#pd-checklist .pd-checkbox:checked');
    var options = [];
    var optionsPrice = 0;
    checkedBoxes.forEach(function (cb) {
      options.push(cb.value);
      if (checklistPrices[cb.value]) optionsPrice += checklistPrices[cb.value];
    });

    // Build cart item
    var cartItem = {
      name: product.name,
      price: product.price,
      image: galleryImages[0],
      size: selectedSize,
      color: selectedColor,
      qty: qty,
      options: options,
      optionsPrice: optionsPrice,
      totalPrice: product.price + optionsPrice
    };

    var cart = getCart();
    cart.push(cartItem);
    saveCart(cart);
    updateCartBadge();

    // Show confirmation
    btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
    btn.style.background = '#2d7a3a';

    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
    }, 2000);
  });

  /* ==========================================================
     14. WISHLIST HEART TOGGLE
     Toggles between outline (far) and filled (fas) heart icon.
     ========================================================== */
  document.getElementById('pd-wishlist-btn').addEventListener('click', function () {
    var icon = this.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    icon.style.color = icon.classList.contains('fas') ? '#800000' : '';
  });

  /* ==========================================================
     15. RECOMMENDED PRODUCTS
     Shows up to 4 cards:
       - Other products from the same category (excluding current)
       - Then products from other categories to fill up to 4
     Uses the same HTML structure as the main product grid cards.
     ========================================================== */
  var recommended = [];

  // Add other products from same category
  categoryProducts.forEach(function (p, i) {
    if (i !== index) recommended.push({ product: p, cat: category, idx: i });
  });

  // Fill remaining slots from other categories
  var otherCategories = Object.keys(allProducts).filter(function (c) {
    return c !== category;
  });
  otherCategories.forEach(function (c) {
    allProducts[c].forEach(function (p, i) {
      if (recommended.length < 4) {
        recommended.push({ product: p, cat: c, idx: i });
      }
    });
  });

  // Render recommended product cards into the grid
  var grid = document.getElementById('pd-recommended-grid');
  if (grid && recommended.length > 0) {
    grid.innerHTML = recommended.slice(0, 4).map(function (item) {
      var p = item.product;
      // Build color dots HTML
      var colorsHtml = p.colors
        ? p.colors.map(function (c) {
            return '<span class="color-dot" style="background:' + c + '"></span>';
          }).join('')
        : '';

      // Build original (strikethrough) price for sale items
      var originalHtml = p.originalPrice
        ? '<span class="original-price">PKR ' + p.originalPrice.toLocaleString() + '</span>'
        : '';

      // Product card HTML (matches the structure from script.js renderProducts)
      return '<div class="product-card fade-in" data-cat="' + item.cat + '" data-idx="' + item.idx + '">' +
        '<div class="product-card-image">' +
          '<img class="img-main" src="' + p.image + '" alt="' + p.name + '" width="280" height="420" loading="lazy">' +
          '<img class="img-hover" src="' + (p.hover || p.image) + '" alt="' + p.name + '" width="280" height="420" loading="lazy">' +
          '<button class="wishlist-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>' +
          '<button class="add-cart-btn">Add to Cart</button>' +
        '</div>' +
        '<div class="product-card-body">' +
          '<div class="product-fabric">' + p.fabric + '</div>' +
          '<h3>' + p.name + '</h3>' +
          '<div class="product-price">' +
            '<span class="current-price">PKR ' + p.price.toLocaleString() + '</span>' +
            originalHtml +
          '</div>' +
          (colorsHtml ? '<div class="color-options">' + colorsHtml + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    // Wire up fade-in animation observer (same as script.js pattern)
    var recObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          recObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.fade-in').forEach(function (el) {
      el.style.animationPlayState = 'paused';
      recObserver.observe(el);
    });

    // Wire up click navigation for recommended cards
    grid.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.wishlist-btn')) return;
        var cat = this.dataset.cat;
        var idx = this.dataset.idx;
        if (cat) {
          window.location.href = 'product.html?cat=' + cat + '&idx=' + idx;
        }
      });
    });
  }
});
