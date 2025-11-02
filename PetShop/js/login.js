document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Por favor ingrese correo y contraseña');
            return;
        }

        alert(`Bienvenido, ${email}`);
        loginForm.reset();
    });

    document.getElementById('forgotLink').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Redirigiendo a recuperación de contraseña...');
    });
});
