document.addEventListener("DOMContentLoaded", () => {
    const fechaInput = document.getElementById("fecha");
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const mesActual = String(hoy.getMonth() + 1).padStart(2, '0');
    const diaActual = String(hoy.getDate()).padStart(2, '0');
    fechaInput.max = `${anioActual}-${mesActual}-${diaActual}`;
    fechaInput.min = `${anioActual - 100}-${mesActual}-${diaActual}`;

    const registerForm = document.getElementById("registerForm");

    const errores = {
        nombre: document.getElementById("error-nombre"),
        apellido: document.getElementById("error-apellido"),
        fecha: document.getElementById("error-fecha"),
        correo: document.getElementById("error-correo"),
        telefono: document.getElementById("error-telefono"),
        contrasena: document.getElementById("error-contrasena")
    };

    const limpiarErrores = () => {
        Object.values(errores).forEach(span => span.textContent = "");
    };

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarErrores();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const fecha = document.getElementById("fecha").value;
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();

        let valido = true;

        // Nombre y apellido solo letras
        const nombreApellidoRegex = /^[A-Za-z]+$/;
        if (!nombre) {
            errores.nombre.textContent = "⚠️ El nombre es obligatorio.";
            valido = false;
        } else if (!nombreApellidoRegex.test(nombre)) {
            errores.nombre.textContent = "❌ Solo letras, sin espacios ni símbolos.";
            valido = false;
        }

        if (!apellido) {
            errores.apellido.textContent = "⚠️ El apellido es obligatorio.";
            valido = false;
        } else if (!nombreApellidoRegex.test(apellido)) {
            errores.apellido.textContent = "❌ Solo letras, sin espacios ni símbolos.";
            valido = false;
        }

        // Fecha
        if (!fecha) {
            errores.fecha.textContent = "⚠️ La fecha es obligatoria.";
            valido = false;
        }

        // Correo electrónico
        // Solo letras, números, puntos, guiones y guion bajo antes del @
        const correoRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!correo) {
            errores.correo.textContent = "⚠️ El correo es obligatorio.";
            valido = false;
        } else if (!correoRegex.test(correo)) {
            errores.correo.textContent = "📧 Ingresa un correo válido sin símbolos ni espacios.";
            valido = false;
        }

        // Teléfono: solo 10 dígitos
        const telefonoRegex = /^[0-9]{10}$/;
        if (!telefono) {
            errores.telefono.textContent = "⚠️ El teléfono es obligatorio.";
            valido = false;
        } else if (!telefonoRegex.test(telefono)) {
            errores.telefono.textContent = "📱 Debe contener 10 dígitos, solo números.";
            valido = false;
        }

        // Contraseña: solo letras y números
        const contrasenaRegex = /^[A-Za-z0-9]+$/;
        if (!contrasena) {
            errores.contrasena.textContent = "⚠️ La contraseña es obligatoria.";
            valido = false;
        } else if (!contrasenaRegex.test(contrasena)) {
            errores.contrasena.textContent = "🔒 Solo letras y números, sin espacios ni símbolos.";
            valido = false;
        } else if (contrasena.length < 6) {
            errores.contrasena.textContent = "🔒 Mínimo 6 caracteres.";
            valido = false;
        }

    });
});
