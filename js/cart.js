/* ==============================
   MimirPetShop · CART (mini cart)
   Persistencia: localStorage ("mimir_cart")
   Funciona con:
   - Botones .add-to-cart dentro de .card con data-sku, data-name, data-price
   - #cartCount, #cartLink, #miniCart, #closeMiniCart, #cartItems, #cartTotal, #payBtn
   ============================== */

(() => {
  const STORAGE_KEY = "mimir_cart";
  const PAY_URL = "../VisualizacionPago/PagoNoVisible.html"; // ajusta si tu ruta es distinta

  // UI refs
  const cartCountEl = document.getElementById("cartCount");
  const cartLinkEl  = document.getElementById("cartLink");
  const miniCartEl  = document.getElementById("miniCart");
  const closeMiniEl = document.getElementById("closeMiniCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const payBtnEl    = document.getElementById("payBtn");

  // Estado
  let cart = [];

  /* ==============================
     Utils
     ============================== */
  const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2);

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }
  };

  const countItems = () => cart.reduce((acc, it) => acc + it.qty, 0);

  const calcTotal = () =>
    cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  const openMini = () => miniCartEl?.classList.add("show");
  const closeMini = () => miniCartEl?.classList.remove("show");
  const toggleMini = () => miniCartEl?.classList.toggle("show");

  /* ==============================
     Render
     ============================== */
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

  /* ==============================
     Operaciones del carrito
     ============================== */
  const addItem = (payload) => {
    const { sku, name, price, img } = payload || {};
    if (!sku || !name || isNaN(price)) return;

    const found = cart.find((it) => it.sku === sku);
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ sku, name, price: Number(price), qty: 1, img: img || "" });
    }
    save();
    updateBadge();
    renderCart();
    openMini();
  };

  const updateQty = (sku, qty) => {
    const it = cart.find((x) => x.sku === sku);
    if (!it) return;
    it.qty = Math.max(1, qty | 0);
    save();
    updateBadge();
    renderCart();
  };

  const removeItem = (sku) => {
    cart = cart.filter((x) => x.sku !== sku);
    save();
    updateBadge();
    renderCart();
    if (cart.length === 0) {
      miniCartEl?.querySelector(".empty")?.classList.remove("hidden");
    }
  };

  /* ==============================
     Captura de clicks "Agregar"
     ============================== */
  const getCardPayload = (btn) => {
    const card = btn.closest(".card");
    if (!card) return null;

    // SKU y nombre preferentemente desde data-*
    let sku  = card.getAttribute("data-sku") || "";
    let name = card.getAttribute("data-name") || card.querySelector("h3")?.textContent?.trim() || "Producto";

    // Precio desde data-price; si falta, intenta parsear del <p>
    let price = parseFloat(card.getAttribute("data-price") || "NaN");
    if (isNaN(price)) {
      const txt = card.querySelector("p")?.textContent || "";
      const match = txt.replace(",", ".").match(/(\d+(\.\d+)?)/);
      price = match ? parseFloat(match[1]) : NaN;
    }
    if (!sku) {
      // última defensa: SKU temporal (no recomendado en producción)
      sku = `SKU-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    }
    const img = card.querySelector("img")?.getAttribute("src") || "";
    return { sku, name, price, img };
  };

  const bindAddToCart = () => {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const payload = getCardPayload(btn);
        if (!payload || !payload.sku || isNaN(payload.price)) {
          console.warn("Tarjeta sin datos válidos para el carrito:", payload);
          return;
        }
        addItem(payload);
      });
    });
  };

  /* ==============================
     Navegación / Acciones globales
     ============================== */
  const bindGlobal = () => {
    cartLinkEl?.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMini();
    });

    closeMiniEl?.addEventListener("click", closeMini);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMini();
    });

    payBtnEl?.addEventListener("click", (e) => {
      e.preventDefault();
      if (cart.length === 0) return;
      // Redirección simple a tu flujo de pago (ajusta PAY_URL según tu proyecto)
      window.location.href = PAY_URL;
    });
  };

  /* ==============================
     Init
     ============================== */
  const init = () => {
    load();
    updateBadge();
    renderCart();
    bindAddToCart();
    bindGlobal();

    // Re-enlaza si se agregan tarjetas dinámicamente
    const observer = new MutationObserver(() => bindAddToCart());
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.addEventListener("DOMContentLoaded", init);
})();
