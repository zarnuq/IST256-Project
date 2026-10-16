// Refresh the browser snapshot from the category JSON files for direct HTML opening.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const categories = JSON.parse(fs.readFileSync(path.join(root, 'data/categories.json'), 'utf8'));
const files = {};
for (const category of categories) {
  if (!/^category-sets\/[a-z0-9-]+\.json$/.test(category.file)) {
    throw new Error('Invalid category file: ' + category.file);
  }
  files[category.file] = JSON.parse(fs.readFileSync(path.join(root, 'data', category.file), 'utf8'));
}
fs.writeFileSync(path.join(root, 'js/catalog-data.js'),
  '// Generated from data/categories.json and data/category-sets/. Run node scripts/build-catalog.cjs to refresh.\n' +
  'window.PartwiseCatalogSnapshot = ' + JSON.stringify({ categories, files }, null, 2) + ';\n');
console.log('Updated direct-open catalog for ' + categories.length + ' categories.');
