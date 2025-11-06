/* ==============================
   MimirPetShop · CART (mini cart)
   ============================== */

(() => {
  const STORAGE_KEY = "mimir_cart";

  // UI refs
  const cartCountEl = document.getElementById("cartCount");
  const cartLinkEl  = document.getElementById("cartLink");
  const miniCartEl  = document.getElementById("miniCart");
  const closeMiniEl = document.getElementById("closeMiniCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const payBtnEl    = document.getElementById("payBtn");

  let cart = [];

  // Utils
  const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch { cart = []; }
  };
  const countItems = () => cart.reduce((acc, it) => acc + it.qty, 0);
  const calcTotal  = () => cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  const openMini   = () => miniCartEl?.classList.add("show");
  const closeMini  = () => miniCartEl?.classList.remove("show");
  const toggleMini = () => miniCartEl?.classList.toggle("show");

  // Render
  const updateBadge = () => {
    const totalQty = countItems();
    if (cartCountEl) cartCountEl.textContent = String(totalQty);
  };

  const renderCart = () => {
    if (!cartItemsEl || !cartTotalEl) return;
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      miniCartEl?.querySelector(".empty")?.classList.remove("hidden");
      cartTotalEl.textContent = "0.00";
      return;
    }
    miniCartEl?.querySelector(".empty")?.classList.add("hidden");

    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <div class="row-left">
          <img class="thumb" src="${item.img || ""}" alt="${item.name}" />
          <div class="meta">
            <p class="name">${item.name}</p>
            <p class="sku">SKU: ${item.sku}</p>
          </div>
        </div>

        <div class="row-right">
          <div class="qty">
            <button class="qty-btn dec" aria-label="Disminuir cantidad">−</button>
            <input class="qty-input" type="number" min="1" step="1" value="${item.qty}" />
            <span class="unit-badge">${item.unit || ""}</span>
            <button class="qty-btn inc" aria-label="Aumentar cantidad">+</button>
          </div>
          <div class="price">$${fmt(item.price * item.qty)}</div>
          <button class="remove" title="Eliminar">✕</button>
        </div>
      `;

      const decBtn = li.querySelector(".dec");
      const incBtn = li.querySelector(".inc");
      const qtyInp = li.querySelector(".qty-input");
      const rmBtn  = li.querySelector(".remove");

      decBtn.addEventListener("click", () => updateQty(item.sku, item.qty - 1));
      incBtn.addEventListener("click", () => updateQty(item.sku, item.qty + 1));
      qtyInp.addEventListener("change", (e) => {
        const val = Math.max(1, parseInt(e.target.value || "1", 10));
        updateQty(item.sku, val);
      });
      rmBtn.addEventListener("click", () => removeItem(item.sku));

      cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = fmt(calcTotal());
  };

  // Ops
  const addItem = (payload) => {
    const { sku, name, price, img, qty = 1, unit = "" } = payload || {};
    if (!sku || !name || isNaN(price)) return;

    const found = cart.find((it) => it.sku === sku && it.unit === unit);
    if (found) {
      found.qty += qty;
    } else {
      cart.push({ sku, name, price: Number(price), qty: Number(qty), img: img || "", unit });
    }
    save();
    updateBadge();
    renderCart();
    openMini();
  };

  const updateQty = (sku, qty) => {
    const it = cart.find((x) => x.sku === sku);
    if (!it) return;
    it.qty = Math.max(1, qty|0);
    save(); updateBadge(); renderCart();
  };

  const removeItem = (sku) => {
    cart = cart.filter((x) => x.sku !== sku);
    save(); updateBadge(); renderCart();
    if (cart.length === 0) miniCartEl?.querySelector(".empty")?.classList.remove("hidden");
  };

  // Captura de clicks "Agregar"
  const getCardPayload = (btn) => {
    const card = btn.closest(".card");
    if (!card) return null;

    const sku   = card.getAttribute("data-sku") || "";
    const name  = card.getAttribute("data-name") || card.querySelector("h3")?.textContent?.trim() || "";
    const price = parseFloat(card.getAttribute("data-price") || "0");
    const unit  = (card.getAttribute("data-unit") || "").trim();
    const img   = card.querySelector("img")?.getAttribute("src") || "";

    // cantidad leída del input adyacente
    const qtyInp = card.querySelector(".qty-input");
    const qtyVal = Math.max(1, parseInt(qtyInp?.value || "1", 10));

    return { sku, name, price, img, qty: qtyVal, unit };
  };

  const bindAddToCart = () => {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const payload = getCardPayload(btn);
        if (!payload || !payload.sku) {
          console.warn("No se encontraron datos válidos en la tarjeta para agregar al carrito.");
          return;
        }
        addItem(payload);
      });
    });

    // Botones +/- de cada tarjeta
    document.querySelectorAll(".card .qty-select").forEach((wrap) => {
      const minus = wrap.querySelector(".qty-btn.minus");
      const plus  = wrap.querySelector(".qty-btn.plus");
      const inp   = wrap.querySelector(".qty-input");
      minus?.addEventListener("click", () => {
        const v = Math.max(1, parseInt(inp.value || "1", 10) - 1);
        inp.value = String(v);
      });
      plus?.addEventListener("click", () => {
        const v = Math.max(1, parseInt(inp.value || "1", 10) + 1);
        inp.value = String(v);
      });
    });
  };

  // Global
  const bindGlobal = () => {
    cartLinkEl?.addEventListener("click", (e) => { e.preventDefault(); toggleMini(); });
    closeMiniEl?.addEventListener("click", closeMini);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMini(); });

    // Pagar → abrir modal (payment.js valida login)
    payBtnEl?.addEventListener("click", (e) => {
      e.preventDefault();
      if (cart.length === 0) return openMini();
      if (typeof window.openPaymentModal === "function") window.openPaymentModal();
    });
  };

  // Init
  const init = () => {
    load(); updateBadge(); renderCart();
    bindAddToCart(); bindGlobal();

    // por si renderizas más tarjetas dinámicamente
    const observer = new MutationObserver(() => bindAddToCart());
    observer.observe(document.body, { childList: true, subtree: true });
  };
  document.addEventListener("DOMContentLoaded", init);
})();
