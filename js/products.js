let products = [];

const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const clearButton = document.getElementById("clearFilters");
const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const categoryIcons = {
  CPU: "bi-cpu",
  GPU: "bi-gpu-card",
  RAM: "bi-memory",
  Storage: "bi-device-hdd",
  Case: "bi-pc",
  Motherboard: "bi-motherboard",
  "Power Supply": "bi-lightning-charge",
  Cooling: "bi-fan"
};

// Create one product card using the JSON fields.
function createProductCard(product) {
  const column = document.createElement("div");
  column.className = "col-sm-6 col-lg-4 col-xl-3";

  const card = document.createElement("article");
  card.className = "card h-100";

  const body = document.createElement("div");
  body.className = "card-body p-4 d-flex flex-column";

  const icon = document.createElement("i");
  const iconName = categoryIcons[product.category] || "bi-box-seam";
  icon.className = `bi ${iconName} display-4 mb-3`;
  icon.setAttribute("aria-hidden", "true");

  const category = document.createElement("p");
  category.className = "small text-body-secondary mb-2";
  category.textContent = product.category;

  const title = document.createElement("h2");
  title.className = "h5 card-title";
  title.textContent = product.description;

  const productId = document.createElement("p");
  productId.className = "small text-body-secondary mb-2";
  productId.textContent = `Product ID: ${product.id}`;

  const details = document.createElement("p");
  details.className = "card-text";
  details.textContent = product.additionalInfo || "";

  const price = document.createElement("p");
  price.className = "h4 fw-bold mt-auto pt-3 mb-1";
  price.textContent = currency.format(product.price);

  const unit = document.createElement("p");
  unit.className = "small text-body-secondary mb-0";
  unit.textContent = `Per ${product.unit.toLowerCase()}`;

  body.append(icon, category, title, productId, details, price, unit);
  card.append(body);
  column.append(card);

  return column;
}

// Build the category dropdown from the JSON.
function populateCategories() {
  categoryFilter.replaceChildren(new Option("All categories", "all"));

  const categories = [...new Set(
    products.map(function (product) {
      return product.category;
    })
  )].sort();

  categories.forEach(function (category) {
    categoryFilter.add(new Option(category, category));
  });
}

// Search products and apply the category filter.
function displayProducts() {
  const searchWords = searchInput.value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(function (product) {
    const searchableText = [
      product.id,
      product.description,
      product.category,
      product.unit,
      product.additionalInfo
    ].join(" ").toLowerCase();

    const matchesSearch = searchWords.every(function (word) {
      return searchableText.includes(word);
    });

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productGrid.replaceChildren();

  filteredProducts.forEach(function (product) {
    productGrid.append(createProductCard(product));
  });

  const count = filteredProducts.length;

  resultCount.textContent =
    `${count} product${count === 1 ? "" : "s"} found`;

  noResults.hidden = count !== 0;
}

// Fetch the products from your group's JSON file.
async function loadProducts() {
  resultCount.textContent = "Loading products...";
  noResults.hidden = true;
  searchInput.disabled = true;
  categoryFilter.disabled = true;
  clearButton.disabled = true;

  try {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
      throw new Error(`Could not load products: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("products.json must contain an array of products.");
    }

    products = data;

    populateCategories();
    displayProducts();

    searchInput.disabled = false;
    categoryFilter.disabled = false;
    clearButton.disabled = false;
  } catch (error) {
    productGrid.replaceChildren();
    noResults.hidden = true;
    resultCount.textContent =
      "Unable to load products. Check data/products.json and open the page using Live Server.";

    console.error(error);
  }
}

$("#productSearch").on("input", displayProducts);
$("#categoryFilter").on("change", displayProducts);
$("#clearFilters").on("click", function () {
  $("#productSearch").val("").trigger("focus");
  $("#categoryFilter").val("all");
  displayProducts();
});

loadProducts();