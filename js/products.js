// Display the shared category catalog in the existing Shop page.
(() => {
  const grid = document.getElementById('productGrid');
  const search = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const count = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  const clearFilters = document.getElementById('clearFilters');
  const editor = document.getElementById('itemEditor');
  const itemSave = document.getElementById('itemSave');
  const f = {
    desc: document.getElementById('itemDesc'),
    category: document.getElementById('itemCategory'),
    price: document.getElementById('itemPrice'),
    unit: document.getElementById('itemUnit'),
    info: document.getElementById('itemInfo'),
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
    f.desc.value = product.description || '';
    f.category.value = product.category || '';
    f.price.value = product.price ?? '';
    f.unit.value = product.unit || 'Each';
    f.info.value = product.additionalInfo || '';
    itemSave.textContent = 'Save changes';
    bootstrap.Collapse.getOrCreateInstance(document.getElementById('itemEditorBox')).show();
    editor.scrollIntoView({ behavior: 'smooth' });
  }

  function resetEditor() {
    editingId = null;
    itemSave.textContent = 'Add item';
    editor.reset();
    f.unit.value = 'Each';
  }

  // Keep catalog text as text so product descriptions cannot inject HTML.
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
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
        image.src = url;
        image.alt = product.imageAlt || product.description;
        image.loading = 'lazy';
        image.height = 180;
        image.style.objectFit = 'contain';
        image.addEventListener('error', () => { image.hidden = true; }, { once: true });
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
        const link = element('a', 'align-self-start', 'View listing');
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        body.append(link);
      }
    }
    const edit = element('button', 'btn btn-sm btn-outline-dark align-self-start mt-2', 'Edit');
    edit.type = 'button';
    edit.addEventListener('click', () => startEdit(product));
    body.append(edit);
    card.append(body);
    column.append(card);
    return column;
  }

  // Combine the existing search and category controls when redrawing cards.
  function render() {
    const term = search.value.trim().toLowerCase();
    const shown = products.filter(product =>
      (categoryFilter.value === 'all' || product.category === categoryFilter.value) &&
      [product.id, product.description, product.category, product.additionalInfo || '']
        .join(' ').toLowerCase().includes(term));
    grid.replaceChildren(...shown.map(productCard));
    count.textContent = `${shown.length} of ${products.length} parts`;
    noResults.hidden = shown.length !== 0;
  }

  // Load once and build filter values directly from the category manifest.
  async function start() {
    search.disabled = categoryFilter.disabled = clearFilters.disabled = true;
    try {
      const catalog = await PartwiseCatalog.load();
      catalogProducts = catalog.products;
      rebuild();
      categoryFilter.replaceChildren(new Option('All categories', 'all'),
        ...catalog.categories.map(category => new Option(category.label, category.id)));
      f.category.replaceChildren(...catalog.categories.map(category => new Option(category.label, category.id)));
      search.addEventListener('input', render);
      categoryFilter.addEventListener('change', render);
      clearFilters.addEventListener('click', () => {
        search.value = '';
        categoryFilter.value = 'all';
        render();
      });
      editor.addEventListener('submit', event => {
        event.preventDefault();
        const id = editingId || 'item-' + Date.now();
        const item = {
          id,
          description: f.desc.value.trim(),
          category: f.category.value,
          price: Number(f.price.value),
          unit: f.unit.value.trim() || 'Each',
          additionalInfo: f.info.value.trim(),
        };
        saved = saved.filter(p => p.id !== id).concat(item);
        localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
        resetEditor();
        rebuild();
        render();
      });
      document.getElementById('itemClear').addEventListener('click', resetEditor);
      search.disabled = categoryFilter.disabled = clearFilters.disabled = false;
      render();
    } catch (error) {
      grid.replaceChildren();
      noResults.hidden = true;
      count.textContent = location.protocol === 'file:'
        ? 'Could not load the direct-open catalog. Refresh it with node scripts/build-catalog.cjs, then reopen this page.'
        : 'Could not load the parts. Check the category JSON files and reload the page.';
      console.error('Catalog loading failed:', error);
    }
  }

  start();
})();
