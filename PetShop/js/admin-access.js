let pressTimer;
let isDragging = false;
let progressBar = null;

document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logoImage');
    if (logo) {
        // Crear la barra de progreso
        progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = '#007bff';
        progressBar.style.width = '0';
        progressBar.style.transition = 'width 0.1s linear';
        progressBar.style.display = 'none';
        logo.parentElement.style.position = 'relative';
        logo.parentElement.appendChild(progressBar);

        // Evento cuando se presiona
        logo.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDragging = false;
            progressBar.style.display = 'block';
            progressBar.style.width = '0';
            
            pressTimer = setInterval(function() {
                const currentWidth = parseFloat(progressBar.style.width) || 0;
                if (currentWidth < 100) {
                    progressBar.style.width = (currentWidth + 3.33) + '%';
                } else {
                    clearInterval(pressTimer);
                    progressBar.style.display = 'none';
                    const accessKey = prompt('Ingrese la clave de acceso:');
                    if (accessKey === 'mimir2023') {
                        window.location.href = 'admin/login.html';
                    } else if (accessKey !== null) {
                        alert('Clave incorrecta');
                    }
                }
            }, 100); // 3 segundos total (30 * 100ms = 3000ms)
        });

        // Evento cuando se mueve el mouse
        logo.addEventListener('mousemove', function() {
            isDragging = true;
        });

        // Eventos cuando se suelta
        function cancelPress() {
            clearInterval(pressTimer);
            progressBar.style.display = 'none';
            progressBar.style.width = '0';
        }

        logo.addEventListener('mouseup', cancelPress);
        logo.addEventListener('mouseleave', cancelPress);
        
        // Prevenir el comportamiento de arrastrar la imagen
        logo.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    }
});