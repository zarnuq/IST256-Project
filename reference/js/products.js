// products.js: add, edit, search and store Partwise parts with jQuery.

const KEY = 'partwise.products';
const FIELDS = ['id', 'name', 'category', 'unit', 'price', 'weight'];

// sample parts so the catalog isn't empty on a first visit
const SEED = [
  { id: 'GPU-4070', name: 'NimbusForce RTX 4070 12GB', category: 'GPU', unit: 'Each', price: 549.99, weight: '1.2 kg' },
  { id: 'CPU-7600', name: 'Coreline 7600X 6-core', category: 'CPU', unit: 'Each', price: 229, weight: '' },
  { id: 'CASE-A1', name: 'BriteBox A1 Mid Tower', category: 'Case', unit: 'Each', price: 89.5, weight: '6.4 kg' }
];

function getProducts() { return JSON.parse(localStorage.getItem(KEY)) || []; }
function saveProducts(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

if (localStorage.getItem(KEY) === null) saveProducts(SEED);

// null while adding; holds the Part ID being edited otherwise
let editingId = null;

// Reads the form into a trimmed object.
function readForm() {
  const data = {};
  FIELDS.forEach(function (name) { data[name] = $('#' + name).val().trim(); });
  return data;
}

// Returns { field: message } for each invalid field; empty means valid.
function validate(data) {
  const errors = {};
  const dupe = getProducts().some(function (p) {
    return p.id.toLowerCase() === data.id.toLowerCase() && p.id !== editingId;
  });

  if (!/^[A-Za-z0-9-]{2,20}$/.test(data.id)) errors.id = 'Part ID: 2 to 20 letters, numbers or hyphens.';
  else if (dupe) errors.id = 'That Part ID is already used.';
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Name must be 2 to 80 characters.';
  if (!data.category) errors.category = 'Pick a category.';
  if (!data.unit) errors.unit = 'Pick a unit of measure.';
  if (!/^\d+(\.\d{1,2})?$/.test(data.price) || Number(data.price) <= 0) errors.price = 'Price must be a number over 0.';
  return errors;
}

// Marks each field red with its message, or clears it, then focuses the first bad field.
function showErrors(errors) {
  FIELDS.forEach(function (name) {
    const field = $('#' + name);
    field.toggleClass('is-invalid', Boolean(errors[name]));
    field.siblings('.invalid-feedback').text(errors[name] || '');
  });
  $('.is-invalid').first().trigger('focus');
}

function showAlert(type, message) { $('#formAlert').attr('class', 'alert alert-' + type).text(message); }
function clearAlert() { $('#formAlert').attr('class', '').text(''); }

// Switches the form back to "add" mode.
function resetMode() {
  editingId = null;
  $('#formTitle').text('Add a part');
  $('#submitBtn').text('Add part');
  $('#cancelBtn').addClass('d-none');
}

// Loads a part into the form for editing.
function startEdit(product) {
  editingId = product.id;
  FIELDS.forEach(function (name) { $('#' + name).val(product[name]); });
  showErrors({});
  clearAlert();
  $('#formTitle').text('Edit part');
  $('#submitBtn').text('Save changes');
  $('#cancelBtn').removeClass('d-none');
}

// Asks first, then deletes the part.
function removeProduct(product) {
  if (confirm('Delete ' + product.name + '?')) {
    saveProducts(getProducts().filter(function (p) { return p.id !== product.id; }));
    if (editingId === product.id) resetMode();
    render();
  }
}

// Redraws the table, the count and the JSON preview.
function render() {
  const term = $('#searchInput').val().toLowerCase();
  const products = getProducts();
  const shown = products.filter(function (p) {
    return (p.id + ' ' + p.name + ' ' + p.category).toLowerCase().includes(term);
  });

  $('#productCount').text(products.length);
  const body = $('#productRows').empty();

  if (shown.length === 0) {
    body.append($('<tr>').append($('<td colspan="8">').text(products.length === 0 ? 'No parts yet.' : 'No parts match your search.')));
  } else {
    shown.forEach(function (p, index) {
      const actions = $('<td class="text-end text-nowrap">');
      $('<button type="button" class="btn btn-sm btn-primary me-1">').text('Edit').on('click', function () { startEdit(p); }).appendTo(actions);
      $('<button type="button" class="btn btn-sm btn-outline-danger">').text('Delete').on('click', function () { removeProduct(p); }).appendTo(actions);
      // .text() (never .html()) so a typed name can't inject markup
      $('<tr>').append(
        $('<td>').text(index + 1),
        $('<td>').text(p.id),
        $('<td>').text(p.name),
        $('<td>').text(p.category),
        $('<td>').text(p.unit),
        $('<td>').text('$' + Number(p.price).toFixed(2)),
        $('<td>').text(p.weight || '-'),
        actions
      ).appendTo(body);
    });
  }

  $('#jsonPreview').text(JSON.stringify(products, null, 2));
}

$(function () {
  $('#productForm').on('submit', function (event) {
    event.preventDefault();
    const data = readForm();
    const errors = validate(data);
    showErrors(errors);
    if (Object.keys(errors).length > 0) {
      showAlert('danger', 'Please fix the highlighted fields.');
      return;
    }

    const record = {
      id: data.id, name: data.name, category: data.category,
      unit: data.unit, price: Number(data.price), weight: data.weight
    };
    const list = getProducts();

    if (editingId === null) {
      list.push(record);
      showAlert('success', 'Added ' + record.name + '.');
    } else {
      list[list.findIndex(function (p) { return p.id === editingId; })] = record;
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
    clearAlert();
    resetMode();
  });

  $('#searchInput').on('input', render);

  $('#downloadBtn').on('click', function () {
    const blob = new Blob([JSON.stringify(getProducts(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.json';
    link.click();
  });

  render();
});
