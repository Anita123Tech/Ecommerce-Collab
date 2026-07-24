function renderProducts(productList, gridId, opts = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const isSale = opts.page === 'sale';
  grid.innerHTML = productList.map((p, i) => {
    const colorsHtml = p.colors ? p.colors.map(c =>
      `<span class="color-dot" style="background:${c}"></span>`
    ).join('') : '';
    const originalHtml = p.originalPrice
      ? `<span class="original-price">PKR ${p.originalPrice.toLocaleString()}</span>`
      : '';
    const saleExtras = isSale ? `
      <div class="discount-badge"><span>50%<br><small>off</small></span></div>
    ` : '';
    return `
      <div class="product-card fade-in" data-cat="${opts.cat || ''}" data-idx="${i}">
        <div class="product-card-image">
          <img class="img-main" src="${p.image}" alt="${p.name}" width="280" height="420" loading="${i < 2 ? 'eager' : 'lazy'}">
          <img class="img-hover" src="${p.hover || p.image}" alt="${p.name}" width="280" height="420" loading="lazy">
          <button class="wishlist-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>
          <button class="add-cart-btn">Add to Cart</button>
          ${saleExtras}
        </div>
        <div class="product-card-body">
          <div class="product-fabric">${p.fabric}</div>
          <h3>${p.name}</h3>
          <div class="product-price">
            <span class="current-price">PKR ${p.price.toLocaleString()}</span>
            ${originalHtml}
          </div>
          ${colorsHtml ? `<div class="color-options">${colorsHtml}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

const page = document.body.dataset.page || 'home';

if (page === 'home') {
  if (typeof products !== 'undefined') {
    renderProducts(products.bridal, 'bridal-grid', { cat: 'bridal' });
    renderProducts(products.daily.slice(0, 4), 'daily-grid', { cat: 'daily' });
    renderProducts(products.sale, 'sale-grid', { cat: 'sale' });
  }
} else if (products[page]) {
  const count = document.getElementById('product-count');
  if (count) count.textContent = products[page].length;
  renderProducts(products[page], 'collection-grid', { page, cat: page });
}

document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const icon = this.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    icon.style.color = icon.classList.contains('fas') ? '#800000' : '';
  });
});

/* Load cart count from localStorage */
function loadCartCount() {
  try {
    var cart = JSON.parse(localStorage.getItem('everstyle-cart')) || [];
    var total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var el = document.querySelector('.cart-count');
    if (el) el.textContent = total;
  } catch (e) {}
}
loadCartCount();

/* Product card "Add to Cart" button handler */
document.querySelectorAll('.add-cart-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var card = this.closest('.product-card');
    if (!card) return;
    var cat = card.dataset.cat;
    var idx = parseInt(card.dataset.idx) || 0;
    var p = products[cat] ? products[cat][idx] : null;
    if (!p) return;

    var cartItem = {
      name: p.name,
      price: p.price,
      image: p.image,
      size: 'M',
      color: p.colors && p.colors[0] ? p.colors[0] : '',
      qty: 1,
      options: [],
      optionsPrice: 0,
      totalPrice: p.price
    };

    var cart;
    try { cart = JSON.parse(localStorage.getItem('everstyle-cart')) || []; }
    catch (e) { cart = []; }
    cart.push(cartItem);
    localStorage.setItem('everstyle-cart', JSON.stringify(cart));

    var total = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    var countEl = document.querySelector('.cart-count');
    if (countEl) countEl.textContent = total;

    var orig = this.textContent;
    this.textContent = 'Added!';
    this.style.background = '#2d7a3a';
    var self = this;
    setTimeout(function () {
      self.textContent = orig;
      self.style.background = '';
    }, 1500);
  });
});

/* Product card click → open product detail page */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', function(e) {
    if (e.target.closest('.wishlist-btn')) return;
    var cat = this.dataset.cat;
    var idx = this.dataset.idx;
    if (cat) {
      window.location.href = 'product.html?cat=' + cat + '&idx=' + idx;
    }
  });
});

const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-arrow.prev');
const nextBtn = document.querySelector('.carousel-arrow.next');
let currentSlide = 0;
let autoplayInterval;

if (slides.length && dots.length) {
  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); }));
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  navOverlay.id = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function toggleMenu(forceClose = false) {
    hamburger.classList.toggle('active', !forceClose);
    navLinks.classList.toggle('open', !forceClose);
    navOverlay.classList.toggle('open', !forceClose);
    document.body.style.overflow = forceClose ? '' : 'hidden';
  }

  function closeMenu() { toggleMenu(true); }

  hamburger.addEventListener('click', () => toggleMenu());
  navOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    const mega = link.nextElementSibling;
    if (mega && mega.classList.contains('mega-menu')) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          mega.classList.toggle('open');
        }
      });
    } else {
      link.addEventListener('click', closeMenu);
    }
  });
}

const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const btn = this.querySelector('button');
    if (input.value) {
      btn.textContent = 'Subscribed!';
      btn.style.background = '#2d7a3a';
      btn.style.color = '#fff';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Confirm';
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  });
}

/* Auto-scroll for product scroll (desktop only) */
function startAutoScroll() {
  const container = document.querySelector('.product-scroll');
  if (!container || window.innerWidth <= 768) return;
  let ticking = true;
  function step() {
    if (!ticking) return;
    container.scrollLeft += 1;
    if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
      container.scrollLeft = 0;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  container.addEventListener('mouseenter', () => { ticking = false; });
  container.addEventListener('mouseleave', () => {
    ticking = true;
    requestAnimationFrame(step);
  });
}
if (window.innerWidth > 768) setTimeout(startAutoScroll, 500);

/* Countdown timer */
function startCountdown() {
  const end = new Date();
  end.setDate(end.getDate() + 7);
  function update() {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const idSets = [
      ['days','hours','minutes','seconds'],
      ['sale-days','sale-hours','sale-mins','sale-secs']
    ];
    const vals = [d, h, m, s];
    idSets.forEach(ids => {
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pad(vals[i]);
      });
    });
  }
  update();
  setInterval(update, 1000);
}
startCountdown();

window.addEventListener('load', () => {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 400);
  }
});
