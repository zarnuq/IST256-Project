// Shared catalog loader: merges the category JSON files into one product list for the Shop page.
const PartwiseCatalog = (() => {
  // Flatten the per-category files into one product array plus the filter list.
  function assemble(categories, files) {
    return {
      products: categories.flatMap(category => files[category.file] || []),
      categories: categories.map(category => ({ id: category.id, label: category.label })),
    };
  }

  // Fetch works over http(s); a page opened as file:// falls back to the prebuilt snapshot.
  async function load() {
    if (location.protocol === 'file:') {
      if (!window.PartwiseCatalogSnapshot) throw new Error('Direct-open snapshot missing');
      const { categories, files } = window.PartwiseCatalogSnapshot;
      return assemble(categories, files);
    }
    const categories = await fetchJSON('data/categories.json');
    const files = {};
    await Promise.all(categories.map(async category => {
      files[category.file] = await fetchJSON('data/' + category.file);
    }));
    return assemble(categories, files);
  }

  async function fetchJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(path + ': ' + response.status);
    return response.json();
  }

  function imageURL(image) {
    return image ? new URL(image, document.baseURI).href : '';
  }

  return { load, imageURL };
})();
