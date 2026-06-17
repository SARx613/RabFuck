/* ============================================================
   Rabieta — shared logic for the 3-page pickup flow.
   State (selected products) is kept in sessionStorage so it
   survives navigation between the static HTML pages.
   ============================================================ */

// Product catalogue. Add / edit freely.
const PRODUCTS = [
  {
    id: "pinta-ingreso",
    name: "Pinta ingreso",
    meta: "",
    image: "https://assets.skipit.com.ar/60/cropped_1768234365786.webp",
  },
];

const STORAGE_KEY = "rabieta:selected";

const Store = {
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  },
  set(ids) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  },
  clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  },
  products(ids) {
    const set = new Set(ids || this.get());
    return PRODUCTS.filter((p) => set.has(p.id));
  },
};

/* ---------- Page 1: product selection ---------- */
function initSelectionPage() {
  const listEl = document.getElementById("productList");
  if (!listEl) return;

  const countEl = document.getElementById("count");
  const confirmBtn = document.getElementById("confirmBtn");
  const selectAllBtn = document.getElementById("selectAllBtn");

  let selected = new Set(Store.get());

  function render() {
    listEl.innerHTML = "";
    PRODUCTS.forEach((p) => {
      const li = document.createElement("li");
      li.className = "product-item" + (selected.has(p.id) ? " selected" : "");
      li.innerHTML = `
        <div class="product-image">
          <img alt="${p.name}" loading="lazy" src="${p.image}">
        </div>
        <div class="product-info">
          <p class="product-name" translate="no">${p.name}</p>
          ${p.meta ? `<p class="product-meta">${p.meta}</p>` : ""}
        </div>
        <div class="radio">
          <input type="checkbox" ${selected.has(p.id) ? "checked" : ""}>
          <span></span>
        </div>`;
      li.addEventListener("click", () => toggle(p.id));
      listEl.appendChild(li);
    });
    update();
  }

  function toggle(id) {
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    render();
  }

  function update() {
    const n = selected.size;
    countEl.textContent = n + " " + (n === 1 ? "Producto" : "Productos");
    confirmBtn.classList.toggle("disabled", n === 0);
    const allSelected = n === PRODUCTS.length;
    selectAllBtn.classList.toggle("is-active", allSelected);
  }

  selectAllBtn.addEventListener("click", () => {
    if (selected.size === PRODUCTS.length) selected.clear();
    else selected = new Set(PRODUCTS.map((p) => p.id));
    render();
  });

  confirmBtn.addEventListener("click", () => {
    if (selected.size === 0) return;
    Store.set([...selected]);
    window.location.href = "./retirar.html";
  });

  render();
}

/* ---------- Page 2: retiro items + clock ---------- */
function initRetiroPage() {
  const el = document.getElementById("retiroItems");
  if (!el) return;

  const items = Store.products();
  if (items.length === 0) {
    window.location.replace("./index.html");
    return;
  }

  const totalEl = document.getElementById("retiroTotal");
  if (totalEl) totalEl.textContent = items.length;

  el.innerHTML = "";
  items.forEach((p) => {
    const div = document.createElement("div");
    div.className = "retiro-item";
    div.innerHTML = `
      <p class="retiro-item-qty">1</p>
      <p class="retiro-item-name">${p.name}</p>`;
    el.appendChild(div);
  });

  const timeEl = document.getElementById("retiroTime");
  if (timeEl) {
    function tick() {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString("es-AR", { hour12: false });
    }
    tick();
    setInterval(tick, 1000);
  }
}

/* ---------- Page 3: confirmed list ---------- */
function initConfirmedList() {
  const el = document.getElementById("confirmedList");
  if (!el) return;

  const items = Store.products();
  renderReadOnlyList(el, items);

  // Pickup code (stable per session if already generated).
  const codeEl = document.getElementById("pickupCode");
  if (codeEl) {
    let code = sessionStorage.getItem("rabieta:code");
    if (!code) {
      code = String(Math.floor(1000 + Math.random() * 9000));
      sessionStorage.setItem("rabieta:code", code);
    }
    codeEl.textContent = code;
  }

  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      Store.clear();
      sessionStorage.removeItem("rabieta:code");
      window.location.href = "./index.html";
    });
  }
}

function renderReadOnlyList(el, items) {
  el.innerHTML = "";
  if (items.length === 0) {
    el.innerHTML = `<li class="empty-state">No hay productos seleccionados.</li>`;
    return;
  }
  items.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product-item";
    li.innerHTML = `
      <div class="product-image">
        <img alt="${p.name}" loading="lazy" src="${p.image}">
      </div>
      <div class="product-info">
        <p class="product-name" translate="no">${p.name}</p>
        <p class="product-meta">${p.meta}</p>
      </div>`;
    el.appendChild(li);
  });
}

// Bootstrap whichever page we're on.
document.addEventListener("DOMContentLoaded", () => {
  initSelectionPage();
  initRetiroPage();
  initConfirmedList();
});
