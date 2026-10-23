// cart.js: search products, add and remove cart items, send the cart with AJAX.

let products = [];
let cart = JSON.parse(localStorage.getItem('partwise.cart') || '[]');

// Shows the products that match the search box.
function showResults() {
  const term = $('#search').val().toLowerCase();
  $('#results').empty();
  products.forEach(function (p) {
    if (!(p.id + ' ' + p.description + ' ' + p.category).toLowerCase().includes(term)) return;
    const row = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
    row.append($('<span></span>').text(p.description + ' - $' + p.price.toFixed(2)));
    row.append($('<button class="btn btn-sm btn-primary">Add</button>').click(function () { addToCart(p); }));
    $('#results').append(row);
  });
}

// Checks the quantity, then adds the product to the cart.
function addToCart(p) {
  const qty = Number($('#qty').val());
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    $('#qty').addClass('is-invalid');
    return;
  }
  $('#qty').removeClass('is-invalid');
  cart.push({ id: p.id, description: p.description, category: p.category, unit: p.unit, price: p.price, quantity: qty });
  showCart();
}

// Redraws the cart, total and JSON view, and saves the cart.
function showCart() {
  let total = 0;
  $('#cartItems').empty();
  cart.forEach(function (item, i) {
    total += item.price * item.quantity;
    const row = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
    row.append($('<span></span>').text(item.quantity + ' x ' + item.description));
    row.append($('<button class="btn btn-sm btn-danger">Remove</button>').click(function () {
      cart.splice(i, 1);
      showCart();
    }));
    $('#cartItems').append(row);
  });
  $('#cartTotal').text(total.toFixed(2));
  $('#jsonView').text(JSON.stringify(cart, null, 2));
  localStorage.setItem('partwise.cart', JSON.stringify(cart));
}

$(function () {
  showCart();
  $('#search').on('input', showResults);

  // load the same products the Shop page uses
  const saved = localStorage.getItem('partwise.products');
  if (saved) {
    products = JSON.parse(saved);
    showResults();
  } else {
    $.getJSON('data/products.json', function (data) {
      products = data;
      showResults();
    });
  }

  // send the cart JSON to the RESTful API (built in a later lab)
  $('#checkoutBtn').click(function () {
    $.ajax({
      url: '/api/cart',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(cart),
      success: function () { $('#message').text('Order sent!'); },
      error: function () { $('#message').text('API not built yet. Cart JSON is ready to send.'); }
    });
  });
});
