/**
 * cart.js — Shopping Cart Page Logic
 *
 * Handles:
 *  - Reading cart data from localStorage (key: 'everstyle-cart')
 *  - Rendering cart items with image, name, size, color, qty, options, price
 *  - Quantity update (+/−)
 *  - Remove item
 *  - Order summary (subtotal, options, shipping, total)
 *  - Empty cart state
 */
document.addEventListener('DOMContentLoaded', function () {

  var STORAGE_KEY = 'everstyle-cart';
  var SHIPPING_THRESHOLD = 4999;
  var SHIPPING_COST = 0;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function formatPrice(n) {
    return 'PKR ' + n.toLocaleString();
  }

  var cartItemsEl = document.getElementById('cart-items');
  var cartSummaryEl = document.getElementById('cart-summary');
  var cartEmptyEl = document.getElementById('cart-empty');
  var cartLayoutEl = document.getElementById('cart-layout');

  function updateCartBadge() {
    var cart = getCart();
    var total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = total;
  }

  function renderCart() {
    var cart = getCart();

    if (cart.length === 0) {
      cartLayoutEl.style.display = 'none';
      cartEmptyEl.style.display = 'block';
      updateCartBadge();
      return;
    }

    cartLayoutEl.style.display = 'grid';
    cartEmptyEl.style.display = 'none';

    // Render items
    cartItemsEl.innerHTML = cart.map(function (item, i) {
      var optionsHtml = '';
      if (item.options && item.options.length > 0) {
        optionsHtml = '<div class="cart-item-options">' +
          item.options.map(function (opt) {
            var label = opt === 'gift-wrap' ? 'Gift Wrap' :
                        opt === 'express' ? 'Express Delivery' :
                        opt === 'gift-receipt' ? 'Gift Receipt' :
                        opt === 'message' ? 'Personalized Message' : opt;
            return '<span>' + label + '</span>';
          }).join('') +
        '</div>';
      }

      var colorDot = item.color
        ? '<span class="cart-item-color-dot" style="background:' + item.color + '"></span>'
        : '';

      var itemPrice = item.totalPrice || item.price;

      return '<div class="cart-item" data-index="' + i + '">' +
        '<img class="cart-item-img" src="' + item.image + '" alt="' + item.name + '" width="120" height="160">' +
        '<div class="cart-item-details">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-meta">' +
            '<span>' + colorDot + ' ' + (item.color || 'Default') + '</span>' +
            '<span>Size: ' + (item.size || 'M') + '</span>' +
          '</div>' +
          optionsHtml +
          '<div class="cart-item-price">' + formatPrice(itemPrice) + (item.qty > 1 ? ' each' : '') + '</div>' +
          '<div class="cart-item-bottom">' +
            '<div class="cart-qty">' +
              '<button class="cart-qty-minus" data-index="' + i + '" aria-label="Decrease quantity"><i class="fas fa-minus"></i></button>' +
              '<span>' + item.qty + '</span>' +
              '<button class="cart-qty-plus" data-index="' + i + '" aria-label="Increase quantity"><i class="fas fa-plus"></i></button>' +
            '</div>' +
            '<button class="cart-item-remove" data-index="' + i + '" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Calculate totals
    var subtotal = 0;
    var optionsTotal = 0;
    cart.forEach(function (item) {
      subtotal += item.price * item.qty;
      optionsTotal += (item.optionsPrice || 0) * item.qty;
    });

    var totalBeforeShipping = subtotal + optionsTotal;
    var shipping = totalBeforeShipping >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    var grandTotal = totalBeforeShipping + shipping;

    document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('summary-options').textContent = formatPrice(optionsTotal);
    document.getElementById('summary-shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    document.getElementById('summary-total').textContent = formatPrice(grandTotal);

    updateCartBadge();
  }

  // Event delegation for qty buttons and remove
  cartItemsEl.addEventListener('click', function (e) {
    var cart = getCart();

    // Quantity minus
    var minusBtn = e.target.closest('.cart-qty-minus');
    if (minusBtn) {
      var idx = parseInt(minusBtn.dataset.index);
      if (cart[idx] && cart[idx].qty > 1) {
        cart[idx].qty--;
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Quantity plus
    var plusBtn = e.target.closest('.cart-qty-plus');
    if (plusBtn) {
      var idx2 = parseInt(plusBtn.dataset.index);
      if (cart[idx2] && cart[idx2].qty < 10) {
        cart[idx2].qty++;
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Remove item
    var removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      var idx3 = parseInt(removeBtn.dataset.index);
      cart.splice(idx3, 1);
      saveCart(cart);
      renderCart();
      return;
    }
  });

  // Checkout button
  var checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      var cart = getCart();
      if (cart.length === 0) return;
      alert('Thank you for your order! (Checkout page coming soon)');
    });
  }

  // Initial render
  renderCart();
});
