function getSub() {
  const h = window.location.hostname; 
  const p = h.split(".");
  if (p.length >= 3) return p[0];
  return null;
}

async function fetchShopData(sub) {
  const url = `https://tokoinstan-3e6d5-default-rtdb.firebaseio.com/shops/${sub}.json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}

async function loadProducts(sheetUrl) {
  const res = await fetch(sheetUrl);
  const csv = await res.text();
  return Papa.parse(csv, { header: true }).data;
}

function renderProducts(products, wa) {
  const container = document.getElementById("productList");
  products.forEach(p => {
    if (!p.Name) return;
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <h3>${p.Name}</h3>
      <p>Rp ${p.Price}</p>
      <button onclick="window.location.href='https://wa.me/${wa}?text=Halo,%20saya%20ingin%20membeli:%20${encodeURIComponent(p.Name)}'">
        Beli via WhatsApp
      </button>
    `;
    container.appendChild(el);
  });
}

(async () => {
  const sub = getSub();
  if (!sub) {
    document.body.innerHTML = "<h1>Subdomain tidak ditemukan</h1>";
    return;
  }
  const shop = await fetchShopData(sub);
  if (!shop) {
    document.body.innerHTML = "<h1>Toko tidak ditemukan di Firebase</h1>";
    return;
  }
  document.documentElement.style.setProperty("--accent", shop.theme.accent);
  document.documentElement.style.setProperty("--bg", shop.theme.bg);
  document.documentElement.style.setProperty("--card", shop.theme.card);
  document.getElementById("loader").style.display = "none";
  document.getElementById("shopName").innerText = shop.name;
  document.getElementById("shopDesc").innerText = shop.desc;
  const products = await loadProducts(shop.sheetUrl);
  renderProducts(products, shop.wa);
})();