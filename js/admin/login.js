document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');

    // Credenciales simuladas
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Guardar el estado de la sesión
            sessionStorage.setItem('adminLoggedIn', 'true');
            
            // Redirigir al panel
            window.location.href = 'panel.html';
        } else {
            alert('Credenciales incorrectas');
        }
    });
});