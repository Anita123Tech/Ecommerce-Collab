/* ─── EverStyle Cart & Checkout Manager ─── */
(function () {
  const STORAGE_KEY = 'everstyle_cart';
  const PROMO_KEY = 'everstyle_promo';

  /* ── helpers ── */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function save(c) { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }
  function fmt(n) { return 'PKR ' + Number(n).toLocaleString('en-PK'); }

  /* ── inject popup styles (once) ── */
  function injectPopupStyles() {
    if (document.getElementById('cart-popup-styles')) return;
    var css = document.createElement('style');
    css.id = 'cart-popup-styles';
    css.textContent = `
      /* ── Added-to-Cart Popup ── */
      .cart-popup-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45);
        z-index: 10001; display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
        backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
      }
      .cart-popup-overlay.show { opacity: 1; pointer-events: auto; }

      .cart-popup {
        background: #fff; border-radius: 16px; width: 420px; max-width: 92vw;
        box-shadow: 0 24px 60px rgba(0,0,0,0.25); overflow: hidden;
        transform: scale(0.85) translateY(30px); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        font-family: 'Poppins', sans-serif;
      }
      .cart-popup-overlay.show .cart-popup {
        transform: scale(1) translateY(0);
      }

      /* header bar */
      .cart-popup-header {
        background: #500000; color: #fff; padding: 14px 20px;
        display: flex; align-items: center; gap: 10px;
      }
      .cart-popup-header i { color: #FFD700; font-size: 1rem; }
      .cart-popup-header span {
        font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px;
      }

      /* body */
      .cart-popup-body { padding: 24px; }
      .cart-popup-item {
        display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
      }
      .cart-popup-img {
        width: 80px; height: 100px; border-radius: 10px; overflow: hidden;
        background: #FFF0EB; flex-shrink: 0;
      }
      .cart-popup-img img { width: 100%; height: 100%; object-fit: cover; }
      .cart-popup-info { flex: 1; min-width: 0; }
      .cart-popup-info h3 {
        font-size: 0.82rem; font-weight: 600; color: #2C2A28;
        margin-bottom: 4px; line-height: 1.4;
      }
      .cart-popup-info .fabric {
        font-size: 0.65rem; color: #7A7672; margin-bottom: 6px;
      }
      .cart-popup-info .price {
        font-size: 0.82rem; font-weight: 700; color: #500000;
      }
      .cart-popup-info .color-pick {
        font-size: 0.6rem; color: #999490; margin-top: 4px;
        display: flex; align-items: center; gap: 6px;
      }
      .cart-popup-info .color-dot {
        width: 12px; height: 12px; border-radius: 50%;
        border: 1px solid #E8E4E0; display: inline-block;
      }

      /* cart total bar */
      .cart-popup-total {
        background: #F8F6F4; border-radius: 10px; padding: 14px 16px;
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 20px;
      }
      .cart-popup-total .label {
        font-size: 0.7rem; color: #7A7672; text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .cart-popup-total .value {
        font-size: 0.9rem; font-weight: 700; color: #2C2A28;
      }
      .cart-popup-total .items-count {
        font-size: 0.65rem; color: #999490; margin-top: 2px;
      }

      /* buttons */
      .cart-popup-actions { display: flex; gap: 10px; }
      .cart-popup-btn {
        flex: 1; padding: 12px; border-radius: 10px; font-size: 0.72rem;
        font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
        cursor: pointer; font-family: 'Poppins', sans-serif; border: none;
        transition: all 0.3s ease; text-align: center; text-decoration: none;
        display: flex; align-items: center; justify-content: center; gap: 6px;
      }
      .cart-popup-btn.primary {
        background: #500000; color: #fff;
      }
      .cart-popup-btn.primary:hover {
        background: #300000; transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(80,0,0,0.3);
      }
      .cart-popup-btn.secondary {
        background: transparent; color: #7A7672;
        border: 1px solid #E8E4E0;
      }
      .cart-popup-btn.secondary:hover {
        border-color: #500000; color: #500000;
      }

      /* close X */
      .cart-popup-close {
        position: absolute; top: 12px; right: 14px; background: none;
        border: none; color: rgba(255,255,255,0.7); cursor: pointer;
        font-size: 1.1rem; transition: color 0.2s; padding: 4px;
      }
      .cart-popup-close:hover { color: #fff; }

      /* checkmark animation */
      .cart-popup-check {
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(255,215,0,0.15); display: flex;
        align-items: center; justify-content: center;
        animation: popCheck 0.4s ease 0.2s both;
      }
      .cart-popup-check i { color: #FFD700; font-size: 0.85rem; }
      @keyframes popCheck {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }

      @media (max-width: 480px) {
        .cart-popup { width: 95vw; }
        .cart-popup-body { padding: 18px; }
        .cart-popup-img { width: 65px; height: 80px; }
      }
    `;
    document.head.appendChild(css);
  }

  /* ── inject confirm styles ── */
  function injectConfirmStyles() {
    if (document.getElementById('cart-confirm-styles')) return;
    var css = document.createElement('style');
    css.id = 'cart-confirm-styles';
    css.textContent = `
      .cart-confirm-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45);
        z-index: 10002; display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
        backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
      }
      .cart-confirm-overlay.show { opacity: 1; pointer-events: auto; }

      .cart-confirm {
        background: #fff; border-radius: 16px; width: 420px; max-width: 92vw;
        box-shadow: 0 24px 60px rgba(0,0,0,0.25); overflow: hidden;
        transform: scale(0.85) translateY(30px); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        font-family: 'Poppins', sans-serif;
      }
      .cart-confirm-overlay.show .cart-confirm { transform: scale(1) translateY(0); }

      .cart-confirm-header {
        background: #500000; color: #fff; padding: 14px 20px;
        display: flex; align-items: center; gap: 10px; position: relative;
      }
      .cart-confirm-header > i:first-child { color: #FFD700; font-size: 1rem; }
      .cart-confirm-header > span { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; flex: 1; }

      .cart-confirm-body { padding: 24px; }

      .cart-confirm-item {
        display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
        padding-bottom: 16px; border-bottom: 1px solid #F0EFED;
      }
      .cart-confirm-img {
        width: 72px; height: 90px; border-radius: 10px; overflow: hidden;
        background: #FFF0EB; flex-shrink: 0;
      }
      .cart-confirm-img img { width: 100%; height: 100%; object-fit: cover; }
      .cart-confirm-info { flex: 1; min-width: 0; }
      .cart-confirm-info h3 { font-size: 0.82rem; font-weight: 600; color: #2C2A28; margin-bottom: 4px; line-height: 1.4; }
      .cart-confirm-info .fabric { font-size: 0.65rem; color: #7A7672; margin-bottom: 6px; }
      .cart-confirm-info .color-pick { font-size: 0.6rem; color: #999490; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
      .cart-confirm-info .color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1px solid #E8E4E0; display: inline-block; }
      .cart-confirm-info .price { font-size: 0.85rem; font-weight: 700; color: #500000; }

      .cart-confirm-msg { font-size: 0.72rem; color: #7A7672; text-align: center; margin-bottom: 20px; }

      .cart-confirm-actions { display: flex; gap: 10px; }
      .cart-confirm-btn {
        flex: 1; padding: 12px; border-radius: 10px; font-size: 0.72rem;
        font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
        cursor: pointer; font-family: 'Poppins', sans-serif; border: none;
        transition: all 0.3s ease; text-align: center;
        display: flex; align-items: center; justify-content: center; gap: 6px;
      }
      .cart-confirm-btn.primary { background: #500000; color: #fff; }
      .cart-confirm-btn.primary:hover { background: #300000; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(80,0,0,0.3); }
      .cart-confirm-btn.secondary { background: transparent; color: #7A7672; border: 1px solid #E8E4E0; }
      .cart-confirm-btn.secondary:hover { border-color: #500000; color: #500000; }

      .cart-confirm-close {
        position: absolute; top: 12px; right: 14px; background: none;
        border: none; color: rgba(255,255,255,0.7); cursor: pointer;
        font-size: 1.1rem; transition: color 0.2s; padding: 4px;
      }
      .cart-confirm-close:hover { color: #fff; }

      @media (max-width: 480px) {
        .cart-confirm { width: 95vw; }
        .cart-confirm-body { padding: 18px; }
        .cart-confirm-img { width: 60px; height: 76px; }
      }
    `;
    document.head.appendChild(css);
  }

  /* ── core API (window.Cart) ── */
  window.Cart = {
    items: load(),

    /* internal add — no popup */
    _add(product, category, index, color) {
      const key = category + '-' + index + '-' + (color || '');
      const existing = this.items.find(i => i.key === key);
      if (existing) { existing.qty += 1; }
      else {
        this.items.push({
          key, name: product.name, fabric: product.fabric,
          price: product.price, originalPrice: product.originalPrice || null,
          image: product.image, color: color || (product.colors && product.colors[0]) || '',
          category, index, qty: 1
        });
      }
      save(this.items);
      this.updateBadge();
    },

    /* public add — shows confirmation first */
    add(product, category, index, color) {
      this.showConfirm(product, category, index, color);
    },

    /* ── confirmation dialog ── */
    showConfirm(product, category, index, color) {
      injectConfirmStyles();
      this._closeConfirm();
      this._closePopup();

      var overlay = document.createElement('div');
      overlay.className = 'cart-confirm-overlay';
      overlay.id = 'cart-confirm-overlay';

      var colorStyle = color ? 'background:' + color : '';

      overlay.innerHTML =
        '<div class="cart-confirm">' +
          '<div class="cart-confirm-header">' +
            '<i class="fas fa-shopping-bag"></i>' +
            '<span>Add to Cart?</span>' +
            '<button class="cart-confirm-close" id="cart-confirm-close"><i class="fas fa-times"></i></button>' +
          '</div>' +
          '<div class="cart-confirm-body">' +
            '<div class="cart-confirm-item">' +
              '<div class="cart-confirm-img"><img src="' + product.image + '" alt="' + product.name + '" loading="lazy"></div>' +
              '<div class="cart-confirm-info">' +
                '<h3>' + product.name + '</h3>' +
                '<p class="fabric">' + product.fabric + '</p>' +
                (color ? '<span class="color-pick"><span class="color-dot" style="' + colorStyle + '"></span>Selected</span>' : '') +
                '<p class="price">' + fmt(product.price) + '</p>' +
              '</div>' +
            '</div>' +
            '<p class="cart-confirm-msg">Would you like to add this item to your cart?</p>' +
            '<div class="cart-confirm-actions">' +
              '<button class="cart-confirm-btn secondary" id="cart-confirm-cancel">Cancel</button>' +
              '<button class="cart-confirm-btn primary" id="cart-confirm-ok"><i class="fas fa-check"></i> Add to Cart</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
      overlay.offsetHeight;
      overlay.classList.add('show');

      var self = this;
      document.getElementById('cart-confirm-close').addEventListener('click', function () { self._closeConfirm(); });
      document.getElementById('cart-confirm-cancel').addEventListener('click', function () { self._closeConfirm(); });
      document.getElementById('cart-confirm-ok').addEventListener('click', function () {
        self._closeConfirm();
        self._add(product, category, index, color);
        self.showPopup(product, color || (product.colors && product.colors[0]) || '');
      });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) self._closeConfirm(); });
    },

    _closeConfirm() {
      var el = document.getElementById('cart-confirm-overlay');
      if (el) {
        el.classList.remove('show');
        setTimeout(function () { el.remove(); }, 350);
      }
    },

    remove(key) {
      this.items = this.items.filter(i => i.key !== key);
      save(this.items);
      this.updateBadge();
    },

    updateQty(key, qty) {
      const item = this.items.find(i => i.key === key);
      if (!item) return;
      item.qty = Math.max(1, Math.min(10, qty));
      save(this.items);
      this.updateBadge();
    },

    clear() { this.items = []; save(this.items); this.updateBadge(); },

    getSubtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },

    getShipping() { return this.getSubtotal() >= 4999 ? 0 : 250; },

    getTax() { return Math.round(this.getSubtotal() * 0.05); },

    getDiscount() {
      const code = sessionStorage.getItem(PROMO_KEY);
      if (!code) return 0;
      const sub = this.getSubtotal();
      if (code === 'EVERSTYLE10') return Math.round(sub * 0.10);
      if (code === 'SUMMER26') return Math.round(sub * 0.15);
      if (code === 'BRIDAL20') return Math.round(sub * 0.20);
      return 0;
    },

    getTotal() {
      return Math.max(0, this.getSubtotal() + this.getShipping() + this.getTax() - this.getDiscount());
    },

    getCount() { return this.items.reduce((s, i) => s + i.qty, 0); },

    applyPromo(code) {
      const c = code.toUpperCase().trim();
      if (c === 'EVERSTYLE10' || c === 'SUMMER26' || c === 'BRIDAL20') {
        sessionStorage.setItem(PROMO_KEY, c);
        return true;
      }
      return false;
    },

    removePromo() { sessionStorage.removeItem(PROMO_KEY); },

    getPromo() { return sessionStorage.getItem(PROMO_KEY) || ''; },

    updateBadge() {
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = this.getCount();
      });
    },

    /* ── popup ── */
    showPopup(product, color) {
      injectPopupStyles();
      this._closePopup();

      var overlay = document.createElement('div');
      overlay.className = 'cart-popup-overlay';
      overlay.id = 'cart-popup-overlay';

      var colorStyle = color ? 'background:' + color : '';
      var totalItems = this.getCount();
      var subtotal = this.getSubtotal();

      overlay.innerHTML =
        '<div class="cart-popup">' +
          '<div class="cart-popup-header" style="position:relative;">' +
            '<div class="cart-popup-check"><i class="fas fa-check"></i></div>' +
            '<span>Added to Cart</span>' +
            '<button class="cart-popup-close" id="cart-popup-close"><i class="fas fa-times"></i></button>' +
          '</div>' +
          '<div class="cart-popup-body">' +
            '<div class="cart-popup-item">' +
              '<div class="cart-popup-img"><img src="' + product.image + '" alt="' + product.name + '" loading="lazy"></div>' +
              '<div class="cart-popup-info">' +
                '<h3>' + product.name + '</h3>' +
                '<p class="fabric">' + product.fabric + '</p>' +
                (color ? '<span class="color-pick"><span class="color-dot" style="' + colorStyle + '"></span>Selected</span>' : '') +
                '<p class="price">' + fmt(product.price) + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="cart-popup-total">' +
              '<div>' +
                '<div class="label">Cart Total</div>' +
                '<div class="items-count">' + totalItems + ' item' + (totalItems > 1 ? 's' : '') + ' in cart</div>' +
              '</div>' +
              '<div class="value">' + fmt(subtotal) + '</div>' +
            '</div>' +
            '<div class="cart-popup-actions">' +
              '<button class="cart-popup-btn secondary" id="cart-popup-continue"><i class="fas fa-arrow-left"></i> Continue Shopping</button>' +
              '<a href="checkout&cart.html#checkout-view" class="cart-popup-btn primary"><i class="fas fa-lock"></i> Go to Checkout</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
      /* force reflow then show */
      overlay.offsetHeight;
      overlay.classList.add('show');

      /* events */
      document.getElementById('cart-popup-close').addEventListener('click', function () {
        Cart._closePopup();
      });
      document.getElementById('cart-popup-continue').addEventListener('click', function () {
        Cart._closePopup();
      });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) Cart._closePopup();
      });

      clearTimeout(this._popupTimer);
      this._popupTimer = setTimeout(function () { Cart._closePopup(); }, 5000);
    },

    _closePopup() {
      var el = document.getElementById('cart-popup-overlay');
      if (el) {
        el.classList.remove('show');
        setTimeout(function () { el.remove(); }, 350);
      }
      clearTimeout(this._popupTimer);
    }
  };

  /* ── find product from card DOM ── */
  function findProductFromCard(card) {
    if (typeof products === 'undefined') return null;
    const nameEl = card.querySelector('.product-card-body h3');
    if (!nameEl) return null;
    const name = nameEl.textContent.trim();
    for (const cat of Object.keys(products)) {
      const idx = products[cat].findIndex(p => p.name === name);
      if (idx !== -1) return { product: products[cat][idx], category: cat, index: idx };
    }
    return null;
  }

  /* ── add-to-cart button delegation (all pages) ── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-cart-btn');
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest('.product-card');
    if (!card) return;
    const found = findProductFromCard(card);
    if (!found) return;
    const colorDot = card.querySelector('.color-dot.active, .color-dot');
    const color = colorDot ? colorDot.style.background || colorDot.style.backgroundColor : '';
    window.Cart.add(found.product, found.category, found.index, color);
  });

  /* ── cart icon link ── */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.cart-icon')) {
      e.preventDefault();
      window.location.href = 'checkout&cart.html#cart-view';
    }
  });

  /* ── init badge on load ── */
  document.addEventListener('DOMContentLoaded', function () {
    window.Cart.updateBadge();
  });
})();
