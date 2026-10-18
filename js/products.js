// products.js: add, edit, delete and search products with jQuery.

const PRODUCTS_KEY = 'partwise.products';
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
let products = [];
let editingId = null;

// Saves the products to localStorage and refreshes the page.
function save() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  render();
}

// Reads the form fields into a product object.
function readProduct() {
  return {
    id: $('#id').val().trim(),
    description: $('#description').val().trim(),
    category: $('#category').val(),
    unit: $('#unit').val(),
    price: $('#price').val().trim(),
    additionalInfo: $('#additionalInfo').val().trim()
  };
}

// Returns { field: message } for every invalid field.
function validate(p) {
  const errors = {};
  if (!/^[A-Za-z0-9-]{2,40}$/.test(p.id)) errors.id = 'ID must be 2 to 40 letters, numbers or hyphens.';
  else if (!editingId && products.some(x => x.id === p.id)) errors.id = 'That ID is already used.';
  if (p.description.length < 2) errors.description = 'Enter a description.';
  if (!p.category) errors.category = 'Choose a category.';
  if (!p.unit) errors.unit = 'Choose a unit.';
  if (!(Number(p.price) > 0)) errors.price = 'Price must be a number above 0.';
  return errors;
}

// Marks each field red with its message, or clears it.
function showErrors(errors) {
  $('#productForm [name]').each(function () {
    $(this).toggleClass('is-invalid', Boolean(errors[this.name]))
      .next('.invalid-feedback').text(errors[this.name] || '');
  });
  $('#productForm .is-invalid').first().trigger('focus');
}

// Puts the form back into "add" mode.
function resetForm() {
  editingId = null;
  $('#productForm')[0].reset();
  $('#id').prop('readonly', false);
  $('#formTitle').text('Add a product');
  $('#saveBtn').text('Add product');
  showErrors({});
}

// Loads a product into the form for editing.
function startEdit(p) {
  editingId = p.id;
  $.each(readProduct(), name => $('#' + name).val(p[name]));
  $('#id').prop('readonly', true);
  $('#formTitle').text('Edit ' + p.id);
  $('#saveBtn').text('Save changes');
  $('#formAlert').prop('hidden', true);
  $('#productForm')[0].scrollIntoView({ behavior: 'smooth' });
}

// Builds one product card. .text() keeps typed HTML from running.
function card(p) {
  const body = $('<div class="card-body d-flex flex-column">').append(
    $('<p class="small text-body-secondary mb-1">').text(p.category + ' · ' + p.id),
    $('<h3 class="h6 card-title">').text(p.description),
    $('<p class="card-text small">').text(p.additionalInfo),
    $('<p class="fw-bold mt-auto">').text(money.format(p.price) + ' / ' + p.unit),
    $('<div class="d-flex gap-2">').append(
      $('<button type="button" class="btn btn-sm btn-primary">Edit</button>').on('click', () => startEdit(p)),
      $('<button type="button" class="btn btn-sm btn-outline-danger">Delete</button>').on('click', () => {
        if (!confirm('Delete ' + p.description + '?')) return;
        products = products.filter(x => x.id !== p.id);
        if (editingId === p.id) resetForm();
        save();
      })
    )
  );
  const image = p.image && $('<img class="card-img-top p-3" height="180" style="object-fit: contain" loading="lazy">')
    .attr({ src: p.image, alt: p.description });
  return $('<div class="col-md-6 col-lg-4">').append($('<div class="card h-100">').append(image, body));
}

// Redraws the cards, count, category filter and JSON view.
function render() {
  const term = $('#search').val().toLowerCase();
  const category = $('#filter').val();
  const shown = products.filter(p =>
    (!category || p.category === category) &&
    (p.id + ' ' + p.description + ' ' + p.additionalInfo).toLowerCase().includes(term));

  $('#productGrid').empty().append(shown.map(card));
  $('#noResults').prop('hidden', shown.length > 0);
  $('#productCount').text(products.length);
  $('#jsonView').text(JSON.stringify(products, null, 2));
}

$(function () {
  // copy the category choices from the form into the filter
  $('#category option').slice(1).clone().appendTo('#filter');
  $('#search, #filter').on('input change', render);
  $('#cancelBtn').on('click', resetForm);

  $('#productForm').on('submit', function (event) {
    event.preventDefault();
    const p = readProduct();
    const errors = validate(p);
    showErrors(errors);
    $('#formAlert').prop('hidden', true);
    if (Object.keys(errors).length) return;

    p.price = Number(p.price);
    const old = products.find(x => x.id === editingId);
    if (old) Object.assign(old, p);
    else products.push(p);
    const message = (old ? 'Updated ' : 'Added ') + p.description + '.';
    resetForm();
    save();
    $('#formAlert').text(message).prop('hidden', false);
  });

  $('#downloadBtn').on('click', function () {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    $('<a download="products.json">').attr('href', URL.createObjectURL(blob))[0].click();
  });

  // saved changes win; first visit starts from data/products.json
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if (saved) {
    products = JSON.parse(saved);
    render();
  } else {
    $.getJSON('data/products.json')
      .done(data => { products = data; save(); })
      .fail(() => $('#noResults').text('Could not load data/products.json. Open the site with Live Server.').prop('hidden', false));
  }
});
