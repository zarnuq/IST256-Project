// Display the shared category catalog in the existing Shop page.
(() => {
  const grid = $('#productGrid');
  const search = $('#productSearch');
  const categoryFilter = $('#categoryFilter');
  const count = $('#resultCount');
  const noResults = $('#noResults');
  const clearFilters = $('#clearFilters');
  const editor = $('#itemEditor');
  const itemSave = $('#itemSave');
  const f = {
    desc: $('#itemDesc'),
    category: $('#itemCategory'),
    price: $('#itemPrice'),
    unit: $('#itemUnit'),
    info: $('#itemInfo'),
  };
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const SAVE_KEY = 'partwise.items';
  let products = [];
  let catalogProducts = [];
  let saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
  let editingId = null;

  // Saved items (localStorage) override the JSON catalog by id; new ids are appended.
  function rebuild() {
    const byId = new Map(catalogProducts.map(p => [p.id, p]));
    saved.forEach(p => byId.set(p.id, p));
    products = [...byId.values()];
  }

  // Load an existing card into the editor for updating.
  function startEdit(product) {
    editingId = product.id;
    f.desc.val(product.description || '');
    f.category.val(product.category || '');
    f.price.val(product.price ?? '');
    f.unit.val(product.unit || 'Each');
    f.info.val(product.additionalInfo || '');
    itemSave.text('Save changes');
    bootstrap.Collapse.getOrCreateInstance($('#itemEditorBox')[0]).show();
    $('html, body').animate({ scrollTop: 0 }, 200);
  }

  function resetEditor() {
    editingId = null;
    itemSave.text('Add item');
    editor[0].reset();
    f.unit.val('Each');
  }

  // Keep catalog text as text so product descriptions cannot inject HTML.
  function element(tag, className, text) {
    const node = $(`<${tag}>`).addClass(className);
    if (text !== undefined) node.text(text);
    return node;
  }

  // Shows the supplied photo, description, price and other part information.
  function productCard(product) {
    const column = element('div', 'col-md-6 col-lg-4');
    const card = element('article', 'card h-100');
    const body = element('div', 'card-body d-flex flex-column');
    if (typeof product.image === 'string') {
      const url = PartwiseCatalog.imageURL(product.image);
      if (url) {
        const image = element('img', 'card-img-top p-3');
        image.attr({
          src: url,
          alt: product.imageAlt || product.description,
          loading: 'lazy',
          height: 180,
        }).css('object-fit', 'contain').one('error', function () { $(this).hide(); });
        card.append(image);
      }
    }
    body.append(
      element('p', 'small text-body-secondary mb-2', product.category),
      element('h2', 'h5 card-title', product.description),
      element('p', 'small text-body-secondary', 'Part ID: ' + product.id),
      element('p', 'card-text', product.additionalInfo || ''),
      element('p', 'fw-bold mt-auto mb-1', money.format(product.price) + ' / ' + product.unit)
    );
    if (typeof product.priceCheckedAt === 'string') {
      body.append(element('p', 'small text-body-secondary', 'Price recorded: ' + product.priceCheckedAt));
    }
    if (typeof product.sourceUrl === 'string' && URL.canParse(product.sourceUrl)) {
      const url = new URL(product.sourceUrl, document.baseURI);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        const link = element('a', 'align-self-start', 'View listing').attr({
          href: url.href,
          target: '_blank',
          rel: 'noopener noreferrer',
        });
        body.append(link);
      }
    }
    const edit = element('button', 'btn btn-sm btn-outline-dark align-self-start mt-2', 'Edit');
    edit.attr('type', 'button').on('click', () => startEdit(product));
    body.append(edit);
    card.append(body);
    column.append(card);
    return column;
  }

  // Combine the existing search and category controls when redrawing cards.
  function render() {
    const term = search.val().trim().toLowerCase();
    const shown = products.filter(product =>
      (categoryFilter.val() === 'all' || product.category === categoryFilter.val()) &&
      [product.id, product.description, product.category, product.additionalInfo || '']
        .join(' ').toLowerCase().includes(term));
    grid.empty();
    shown.forEach(product => grid.append(productCard(product)));
    count.text(`${shown.length} of ${products.length} parts`);
    noResults.prop('hidden', shown.length !== 0);
  }

  // Load once and build filter values directly from the category manifest.
  async function start() {
    search.add(categoryFilter).add(clearFilters).prop('disabled', true);
    try {
      const catalog = await PartwiseCatalog.load();
      catalogProducts = catalog.products;
      rebuild();
      categoryFilter.empty().append(new Option('All categories', 'all'));
      catalog.categories.forEach(category => {
        categoryFilter.append(new Option(category.label, category.id));
        f.category.append(new Option(category.label, category.id));
      });
      search.on('input', render);
      categoryFilter.on('change', render);
      clearFilters.on('click', () => {
        search.val('');
        categoryFilter.val('all');
        render();
      });
      editor.on('submit', event => {
        event.preventDefault();
        const id = editingId || 'item-' + Date.now();
        const item = {
          id,
          description: f.desc.val().trim(),
          category: f.category.val(),
          price: Number(f.price.val()),
          unit: f.unit.val().trim() || 'Each',
          additionalInfo: f.info.val().trim(),
        };
        saved = saved.filter(p => p.id !== id).concat(item);
        localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
        resetEditor();
        rebuild();
        render();
      });
      $('#itemClear').on('click', resetEditor);
      search.add(categoryFilter).add(clearFilters).prop('disabled', false);
      render();
    } catch (error) {
      grid.empty();
      noResults.prop('hidden', true);
      count.text(location.protocol === 'file:'
        ? 'Could not load the direct-open catalog. Refresh it with node scripts/build-catalog.cjs, then reopen this page.'
        : 'Could not load the parts. Check the category JSON files and reload the page.');
      console.error('Catalog loading failed:', error);
    }
  }

  start();
})();
