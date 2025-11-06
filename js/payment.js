// ===============================
// MODAL DE PAGO + VALIDACIÓN LOGIN
// ===============================
(() => {
  const modal        = document.getElementById("modalPago");
  const modalTotal   = document.getElementById("modalTotal");
  const btnConfirmar = document.getElementById("btnConfirmarPago");
  const btnCancelar  = document.getElementById("btnCancelarPago");
  const errorEl      = document.getElementById("pagoError");
  const modalExito   = document.getElementById("modalExito");

  function getSession() {
    try { return JSON.parse(localStorage.getItem("mimir_session") || "null"); }
    catch { return null; }
  }

  // Expuesto para cart.js
  window.openPaymentModal = () => {
    const session = getSession();
    if (!session || !(session.email || session.correo)) {
      alert("Debes iniciar sesión antes de pagar.");
      // tras login vuelve aquí
      window.location.href = "../login/login.html?next=../veterinaria/productos.html";
      return;
    }

    const cart = JSON.parse(localStorage.getItem("mimir_cart") || "[]");
    const total = cart.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
    modalTotal.textContent = total.toFixed(2);

    modal.classList.remove("hidden");
  };

  btnCancelar?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

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

    // Éxito simulado
    modal.classList.add("hidden");
    modalExito.classList.remove("hidden");

    localStorage.removeItem("mimir_cart");
    setTimeout(() => {
      modalExito.classList.add("hidden");
      window.location.reload();
    }, 2200);
  });
})();
