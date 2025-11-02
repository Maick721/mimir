/* ===========================
   MimirPetShop · cart.js
   =========================== */

(() => {
  const $ = (s, sc = document) => sc.querySelector(s);
  const $$ = (s, sc = document) => Array.from(sc.querySelectorAll(s));

  // ----- Elementos del DOM (coinciden con tu HTML) -----
  const cartLink        = $("#cartLink");
  const cartCount       = $("#cartCount");

  const miniCart        = $("#miniCart");
  const closeMiniCart   = $("#closeMiniCart");
  const cartItemsUl     = $("#cartItems");
  const cartTotalEl     = $("#cartTotal");
  const payBtn          = $("#payBtn");

  const detailOverlay   = $("#detailOverlay");
  const detailModal     = $("#detailModal");
  const closeDetail     = $("#closeDetail");
  const detailImg       = $("#detailImg");
  const detailName      = $("#detailName");
  const detailDesc      = $("#detailDesc");
  const detailPrice     = $("#detailPrice");
  const detailUnit      = $("#detailUnit");
  const detailQty       = $("#detailQty");
  const detailQtyLabel  = $("#detailQtyLabel");
  const detailAdd       = $("#detailAdd");

  const checkoutOverlay = $("#checkoutOverlay");
  const checkoutModal   = $("#checkoutModal");
  const closeCheckout   = $("#closeCheckout");
  const checkoutItemsUl = $("#checkoutItems");
  const checkoutTotalEl = $("#checkoutTotal");
  const checkoutForm    = $("#checkoutForm");
  const chkMethod       = $("#chkMethod");
  const cardFields      = $("#cardFields");

  const LS_KEY = "mimir_cart_v1";

  // ----- Estado -----
  const state = {
    items: loadState(),
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data;
    } catch {
      return [];
    }
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state.items));
  }

  // ----- Helpers -----
  function format(n) {
    const v = Number(n || 0);
    return v.toFixed(2);
  }

  function getQtyFromCard(card) {
    const input = card.querySelector(".cantidad-input");
    const val = parseFloat((input && input.value) || "1");
    return isNaN(val) || val <= 0 ? 1 : val;
  }

  function findItem(sku) {
    return state.items.find(i => i.sku === sku);
  }

  function sumCount() {
    return state.items.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  }

  function sumTotal() {
    return state.items.reduce((acc, it) => acc + it.price * it.qty, 0);
  }

  function updateBadge() {
    const count = sumCount();
    cartCount.textContent = count;
    cartCount.dataset.count = String(count);
  }

  // ----- CRUD del carrito -----
  function addItem({ sku, name, price, qty, img, unit }) {
    if (!sku) return;
    const existing = findItem(sku);
    if (existing) {
      existing.qty += qty;
      existing.img = existing.img || img;
      existing.unit = existing.unit || unit;
      existing.name = existing.name || name;
      existing.price = Number(price);
    } else {
      state.items.push({
        sku,
        name,
        price: Number(price),
        qty: Number(qty),
        img: img || "",
        unit: unit || "",
      });
    }
    saveState();
    renderCart();
  }

  function updateQty(sku, qty) {
    const it = findItem(sku);
    if (!it) return;
    it.qty = Math.max(1, Number(qty) || 1);
    saveState();
    renderCart();
  }

  function removeItem(sku) {
    state.items = state.items.filter(i => i.sku !== sku);
    saveState();
    renderCart();
  }

  function clearCart() {
    state.items = [];
    saveState();
    renderCart();
  }

  // ----- Render mini-carrito -----
  function renderCart() {
    cartItemsUl.innerHTML = "";
    if (!state.items.length) {
      $(".empty", miniCart).style.display = "block";
      cartTotalEl.textContent = "0.00";
    } else {
      $(".empty", miniCart).style.display = "none";
      const frag = document.createDocumentFragment();
      state.items.forEach(it => {
        const li = document.createElement("li");
        li.className = "cart-row";
        li.innerHTML = `
          <img src="${it.img || ""}" alt="${it.name || "producto"}">
          <div class="cart-row-info">
            <div><strong>${it.name}</strong></div>
            <div class="muted">${it.sku} · $${format(it.price)} ${it.unit ? `/${it.unit}` : ""}</div>
            <div class="muted">Subtotal: $${format(it.price * it.qty)}</div>
          </div>
          <div class="cart-row-actions">
            <button class="qty-dec" data-sku="${it.sku}" title="Restar">-</button>
            <button class="qty-show" disabled>${format(it.qty)}</button>
            <button class="qty-inc" data-sku="${it.sku}" title="Sumar">+</button>
            <button class="rm" data-sku="${it.sku}" title="Eliminar">✕</button>
          </div>
        `;
        frag.appendChild(li);
      });
      cartItemsUl.appendChild(frag);
      cartTotalEl.textContent = format(sumTotal());
    }
    updateBadge();
  }

  // ----- Mini-carrito UI -----
  function openMiniCart() {
    miniCart.classList.add("show");
    miniCart.setAttribute("aria-hidden", "false");
  }
  function closeMiniCartUI() {
    miniCart.classList.remove("show");
    miniCart.setAttribute("aria-hidden", "true");
  }

  // ----- Detalle UI -----
  function openDetail() {
    detailOverlay.classList.add("show");
    detailModal.classList.add("show");
    detailOverlay.setAttribute("aria-hidden", "false");
    detailModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }
  function closeDetailUI() {
    detailOverlay.classList.remove("show");
    detailModal.classList.remove("show");
    detailOverlay.setAttribute("aria-hidden", "true");
    detailModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  // ----- Checkout UI -----
  function renderCheckout() {
    checkoutItemsUl.innerHTML = "";
    const frag = document.createDocumentFragment();
    state.items.forEach(it => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <img src="${it.img || ""}" alt="${it.name || "producto"}">
        <div class="cart-row-info">
          <div><strong>${it.name}</strong></div>
          <div class="muted">${it.sku} · $${format(it.price)} ${it.unit ? `/${it.unit}` : ""}</div>
          <div class="muted">Cantidad: ${format(it.qty)} · Subtotal: $${format(it.price * it.qty)}</div>
        </div>
      `;
      frag.appendChild(li);
    });
    checkoutItemsUl.appendChild(frag);
    checkoutTotalEl.textContent = format(sumTotal());
  }

  function openCheckout() {
    if (!state.items.length) {
      openMiniCart();
      return;
    }
    renderCheckout();
    checkoutOverlay.classList.add("show");
    checkoutModal.classList.add("show");
    checkoutOverlay.setAttribute("aria-hidden", "false");
    checkoutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }
  function closeCheckoutUI() {
    checkoutOverlay.classList.remove("show");
    checkoutModal.classList.remove("show");
    checkoutOverlay.setAttribute("aria-hidden", "true");
    checkoutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  // Mostrar/ocultar campos de tarjeta
  function toggleCardFields() {
    const m = chkMethod.value;
    cardFields.style.display = m === "tarjeta" ? "block" : "none";
  }

  // ----- Listeners globales -----
  document.addEventListener("click", (e) => {
    // Agregar al carrito
    const addBtn = e.target.closest(".add-to-cart");
    if (addBtn) {
      e.preventDefault();
      const card = addBtn.closest(".card");
      if (!card) return;

      const sku   = card.dataset.sku;
      const name  = card.dataset.name || $(".title", card)?.textContent?.trim() || "Producto";
      const price = parseFloat(card.dataset.price || "0");
      const qty   = getQtyFromCard(card);
      const img   = $("figure img", card)?.src || "";
      const unit  = $(".precio .unit", card)?.textContent?.replace("/", "")?.trim() || "";

      if (!sku || isNaN(price) || price <= 0) {
        console.warn("Datos de producto inválidos:", { sku, price });
        return;
      }

      addItem({ sku, name, price, qty, img, unit });
      openMiniCart();
      return;
    }

    // Ver detalle (si usas el modal de detalle desde el listado)
    const viewLink = e.target.closest(".btn-ghost[href^='./producto.html']");
    if (viewLink) {
      // Si quieres ir a la página, elimina este bloque.
      e.preventDefault();
      const card = viewLink.closest(".card");
      if (!card) return;

      const name  = card.dataset.name || $(".title", card)?.textContent?.trim() || "Producto";
      const desc  = card.dataset.desc || "";
      const price = parseFloat(card.dataset.price || "0");
      const img   = $("figure img", card)?.src || "";
      const unit  = $(".precio .unit", card)?.textContent?.trim() || "/ kg";
      const qty   = getQtyFromCard(card);

      detailImg.src = img || "";
      detailName.textContent = name;
      detailDesc.textContent = desc;
      detailPrice.textContent = format(price);
      detailUnit.textContent = unit.startsWith("/") ? unit : ` ${unit ? "/ " + unit : ""}`;
      detailQty.value = qty;
      detailQtyLabel.textContent = unit.includes("unidad") ? "Unidades" : "Kilos";

      // Guarda datos actuales en dataset del botón "Agregar" del modal
      detailAdd.dataset.sku   = card.dataset.sku;
      detailAdd.dataset.name  = name;
      detailAdd.dataset.price = String(price);
      detailAdd.dataset.img   = img;
      detailAdd.dataset.unit  = unit.replace("/", "").trim();

      openDetail();
      return;
    }

    // Botones mini-carrito (sumar/restar/eliminar)
    if (e.target.matches(".qty-inc")) {
      const sku = e.target.dataset.sku;
      const it = findItem(sku);
      if (it) updateQty(sku, it.qty + 1);
      return;
    }
    if (e.target.matches(".qty-dec")) {
      const sku = e.target.dataset.sku;
      const it = findItem(sku);
      if (it) updateQty(sku, Math.max(1, it.qty - 1));
      return;
    }
    if (e.target.matches(".rm")) {
      const sku = e.target.dataset.sku;
      removeItem(sku);
      return;
    }
  });

  // Clicks de apertura/cierre
  cartLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openMiniCart();
  });
  closeMiniCart?.addEventListener("click", closeMiniCartUI);

  // Detalle
  closeDetail?.addEventListener("click", closeDetailUI);
  detailOverlay?.addEventListener("click", (e) => {
    if (e.target === detailOverlay) closeDetailUI();
  });
  detailAdd?.addEventListener("click", () => {
    const sku   = detailAdd.dataset.sku;
    const name  = detailAdd.dataset.name;
    const price = parseFloat(detailAdd.dataset.price || "0");
    const img   = detailAdd.dataset.img || "";
    const unit  = detailAdd.dataset.unit || "";
    const qty   = parseFloat(detailQty.value || "1") || 1;

    if (!sku || isNaN(price) || price <= 0) return;
    addItem({ sku, name, price, qty, img, unit });
    closeDetailUI();
    openMiniCart();
  });

  // Checkout
  payBtn?.addEventListener("click", openCheckout);
  closeCheckout?.addEventListener("click", closeCheckoutUI);
  checkoutOverlay?.addEventListener("click", (e) => {
    if (e.target === checkoutOverlay) closeCheckoutUI();
  });
  chkMethod?.addEventListener("change", toggleCardFields);
  toggleCardFields();

  checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.items.length) return;

    // Validaciones simples para "tarjeta"
    if (chkMethod.value === "tarjeta") {
      const card = $("#chkCard").value.trim();
      const exp  = $("#chkExp").value.trim();
      const cvv  = $("#chkCvv").value.trim();
      if (card.length < 12 || !/^\d[\d\s]*$/.test(card)) {
        alert("Número de tarjeta inválido.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(exp)) {
        alert("Fecha de expiración inválida (usa MM/AA).");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        alert("CVV inválido.");
        return;
      }
    }

    alert("¡Pago procesado con éxito! ✨");
    clearCart();
    closeCheckoutUI();
  });

  // Iniciar UI
  renderCart();
})();
