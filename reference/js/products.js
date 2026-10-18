const KEY = 'partwise.products';
const FIELDS = ['id', 'name', 'category', 'unit', 'price', 'weight'];

const SEED = [
  { id: 'GPU-4070', name: 'NimbusForce RTX 4070 12GB', category: 'GPU', unit: 'Each', price: 549.99, weight: '1.2 kg' },
  { id: 'CPU-7600', name: 'Coreline 7600X 6-core', category: 'CPU', unit: 'Each', price: 229, weight: '' },
  { id: 'CASE-A1', name: 'BriteBox A1 Mid Tower', category: 'Case', unit: 'Each', price: 89.5, weight: '6.4 kg' },
  { id: 'RAM-32', name: 'FlashLine 32GB DDR5 Kit', category: 'RAM', unit: 'Kit', price: 109.99, weight: '' },
  { id: 'SSD-1TB', name: 'Vaultdrive 1TB NVMe SSD', category: 'Storage', unit: 'Each', price: 74.99, weight: '' },
  { id: 'PSU-750', name: 'Steadywatt 750W Gold', category: 'Power Supply', unit: 'Each', price: 99, weight: '2.1 kg' }
];

function getProducts() { return JSON.parse(localStorage.getItem(KEY)) || []; }
function saveProducts(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

if (localStorage.getItem(KEY) === null) saveProducts(SEED);

let editingId = null;
let activeCategory = 'All';

function readForm() {
  return Object.fromEntries(FIELDS.map(name => [name, $('#' + name).val().trim()]));
}

function validate(data) {
  const errors = {};
  const duplicate = getProducts().some(p =>
    p.id.toLowerCase() === data.id.toLowerCase() && p.id !== editingId);

  if (!/^[A-Za-z0-9-]{2,20}$/.test(data.id)) errors.id = 'Part ID: 2 to 20 letters, numbers or hyphens.';
  else if (duplicate) errors.id = 'That Part ID is already used.';
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Name must be 2 to 80 characters.';
  if (!data.category) errors.category = 'Pick a category.';
  if (!data.unit) errors.unit = 'Pick a unit.';
  if (!/^\d+(\.\d{1,2})?$/.test(data.price) || Number(data.price) <= 0) errors.price = 'Price must be over 0.';
  return errors;
}

function showErrors(errors) {
  FIELDS.forEach(name => {
    const field = $('#' + name);
    field.toggleClass('is-invalid', Boolean(errors[name]));
    field.siblings('.invalid-feedback').text(errors[name] || '');
  });
  $('.is-invalid').first().trigger('focus');
}

function showAlert(type = '', message = '') {
  const alert = $('#formAlert');
  alert.attr('class', type ? `alert alert-${type} mb-0 py-1 px-2 small` : 'mb-0').text(message);
}

function resetMode() {
  editingId = null;
  $('#formTitle').text('Add a part');
  $('#submitBtn').text('Add part');
  $('#cancelBtn').addClass('d-none');
}

function startEdit(product) {
  editingId = product.id;
  FIELDS.forEach(name => $('#' + name).val(product[name]));
  showErrors({});
  showAlert();
  $('#formTitle').text('Edit part');
  $('#submitBtn').text('Save changes');
  $('#cancelBtn').removeClass('d-none');
  $('html, body').animate({ scrollTop: 0 }, 200);
}

function removeProduct(product) {
  if (confirm('Delete ' + product.name + '?')) {
    saveProducts(getProducts().filter(p => p.id !== product.id));
    if (editingId === product.id) resetMode();
    render();
  }
}

function card(product) {
  const col = $('<div class="col-sm-6 col-lg-4">');
  const inner = $('<div class="card h-100">').appendTo(col);
  $('<img class="card-img-top product-img">')
    .attr('src', 'https://picsum.photos/seed/' + encodeURIComponent(product.id) + '/400/300')
    .attr('alt', product.name)
    .appendTo(inner);

  const body = $('<div class="card-body d-flex flex-column">').appendTo(inner);
  $('<span class="badge text-bg-light border align-self-start mb-2">').text(product.category).appendTo(body);
  $('<h3 class="h6 fw-bold mb-1">').text(product.name).appendTo(body);
  $('<p class="text-body-secondary small mb-1">').text(product.id + ' · per ' + product.unit).appendTo(body);
  if (product.weight) $('<p class="text-body-secondary small mb-2">').text('Weight: ' + product.weight).appendTo(body);
  $('<p class="fw-bold fs-5 mb-3">').text('$' + Number(product.price).toFixed(2)).appendTo(body);

  const actions = $('<div class="d-flex gap-2 mt-auto">').appendTo(body);
  $('<button type="button" class="btn btn-sm btn-primary">').text('Edit').on('click', () => startEdit(product)).appendTo(actions);
  $('<button type="button" class="btn btn-sm btn-outline-danger">').text('Delete').on('click', () => removeProduct(product)).appendTo(actions);
  return col;
}

function render() {
  const term = $('#searchInput').val().toLowerCase();
  const products = getProducts();
  const shown = products.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.id + ' ' + p.name + ' ' + p.category).toLowerCase().includes(term));

  $('#productCount').text(products.length);
  const grid = $('#productGrid').empty();

  if (shown.length === 0) {
    grid.append($('<div class="col-12">').append(
      $('<p class="text-body-secondary mb-0">').text(products.length === 0 ? 'No parts yet. Add one above.' : 'No parts match your filters.')
    ));
    return;
  }
  shown.forEach(p => grid.append(card(p)));
}

$(function () {
  $('#productForm').on('submit', function (event) {
    event.preventDefault();
    const data = readForm();
    const errors = validate(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      showAlert('danger', 'Please fix the highlighted fields.');
      return;
    }

    const record = { ...data, price: Number(data.price) };
    const list = getProducts();

    if (editingId === null) {
      list.push(record);
      showAlert('success', 'Added ' + record.name + '.');
    } else {
      list[list.findIndex(p => p.id === editingId)] = record;
      showAlert('success', 'Saved changes to ' + record.name + '.');
      resetMode();
    }

    saveProducts(list);
    this.reset();
    showErrors({});
    render();
  });

  $('#cancelBtn').on('click', function () {
    $('#productForm')[0].reset();
    showErrors({});
    showAlert();
    resetMode();
  });

  $('#categoryFilter').on('click', '.list-group-item', function () {
    activeCategory = $(this).data('category');
    $('#categoryFilter .list-group-item').removeClass('active');
    $(this).addClass('active');
    render();
  });

  $('#searchInput').on('input', render);

  render();
});
