// Esperar a que el contenido se cargue
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".animar-izquierda, .animar-derecha, .animar-abajo");

  const mostrarElemento = (entrada) => {
    entrada.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
      }
    });
  };

  // Crear un observador para detectar cuando los elementos aparecen en pantalla
  const observador = new IntersectionObserver(mostrarElemento, {
    threshold: 0.2 // activa cuando el 20% del elemento es visible
  });

  elementos.forEach((el) => observador.observe(el));
});
