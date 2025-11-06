// ===============================
// MODAL DE PAGO TIPO “VENTANA”
// (en la misma página, sin redirecciones)
// ===============================
(() => {
  const overlay      = document.getElementById("modalPago");
  const dialog       = overlay?.querySelector(".modal-pago");
  const titlebar     = document.getElementById("modalTitlebar");
  const btnX         = document.getElementById("btnCloseModal");
  const modalTotal   = document.getElementById("modalTotal");
  const btnConfirmar = document.getElementById("btnConfirmarPago");
  const btnCancelar  = document.getElementById("btnCancelarPago");
  const errorEl      = document.getElementById("pagoError");
  const modalExito   = document.getElementById("modalExito");

  const getSession = () => {
    try { return JSON.parse(localStorage.getItem("mimir_session") || "null"); }
    catch { return null; }
  };

  const openOverlay = () => overlay?.classList.remove("hidden");
  const closeOverlay = () => overlay?.classList.add("hidden");

  // Expuesto: lo llama cart.js
  window.openPaymentModal = () => {
    const session = getSession();
    if (!session || !(session.email || session.correo)) {
      alert("Debes iniciar sesión antes de pagar.");
      // Si quieres mantenerte en la misma página, omite redirección
      // o usa ?next para volver aquí tras login:
      window.location.href = "../login/login.html?next=../veterinaria/productos.html";
      return;
    }

    const cart = JSON.parse(localStorage.getItem("mimir_cart") || "[]");
    const total = cart.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
    modalTotal.textContent = total.toFixed(2);

    // Centrar visualmente (por si quedó arrastrado)
    dialog.style.left = ""; dialog.style.top = "";
    openOverlay();
  };

  // Cerrar
  btnX?.addEventListener("click", closeOverlay);
  btnCancelar?.addEventListener("click", closeOverlay);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay(); // clic fuera de la ventana
  });
  document.addEventListener("keydown", (e) => {
    if (!overlay || overlay.classList.contains("hidden")) return;
    if (e.key === "Escape") closeOverlay();
  });

  // Confirmar pago (demo)
  btnConfirmar?.addEventListener("click", () => {
    errorEl.classList.add("hidden");
    const ccNum  = document.getElementById("ccNumber").value.trim();
    const ccExp  = document.getElementById("ccExp").value.trim();
    const ccCvv  = document.getElementById("ccCvv").value.trim();
    const ccName = document.getElementById("ccName").value.trim();

    if (!ccNum || !ccExp || !ccCvv || !ccName) {
      errorEl.textContent = "Completa todos los campos de la tarjeta.";
      errorEl.classList.remove("hidden");
      return;
    }

    closeOverlay();
    modalExito.classList.remove("hidden");
    localStorage.removeItem("mimir_cart");

    setTimeout(() => {
      modalExito.classList.add("hidden");
      window.location.reload();
    }, 2000);
  });

  // ---------------------------
  // Hacer la ventanita arrastrable
  // ---------------------------
  let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function px(n) { return `${n}px`; }
  function getNum(v) { return Number(String(v).replace("px","")) || 0; }

  titlebar?.addEventListener("mousedown", (e) => {
    dragging = true;
    const rect = dialog.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startLeft = rect.left + window.scrollX;
    startTop  = rect.top  + window.scrollY;
    dialog.style.position = "absolute";
    dialog.style.left = px(startLeft);
    dialog.style.top  = px(startTop);
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dialog.style.left = px(getNum(startLeft) + dx);
    dialog.style.top  = px(getNum(startTop)  + dy);
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    document.body.style.userSelect = "";
  });
})();
