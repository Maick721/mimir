document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el admin está logueado
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos del DOM
    const clientesTableBody = document.getElementById('clientesTableBody');
    const btnAddCliente = document.getElementById('btnAddCliente');
    const clienteModal = document.getElementById('clienteModal');
    const clienteForm = document.getElementById('clienteForm');
    const modalClose = document.querySelector('.close');
    const btnLogout = document.getElementById('btnLogout');

    // Datos simulados de clientes
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [
        { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', telefono: '123-456-789' },
        { id: 2, nombre: 'María García', email: 'maria@mail.com', telefono: '987-654-321' }
    ];

    // Funciones
    function mostrarClientes() {
        clientesTableBody.innerHTML = '';
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editarCliente(${cliente.id})">Editar</button>
                    <button class="btn-action btn-delete" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                </td>
            `;
            clientesTableBody.appendChild(row);
        });
        guardarClientes();
    }

    function guardarClientes() {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    function limpiarFormulario() {
        clienteForm.reset();
        document.getElementById('clienteId').value = '';
        document.getElementById('modalTitle').textContent = 'Agregar Cliente';
    }

    // Event Listeners
    btnAddCliente.addEventListener('click', () => {
        limpiarFormulario();
        clienteModal.style.display = 'block';
    });

    modalClose.addEventListener('click', () => {
        clienteModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === clienteModal) {
            clienteModal.style.display = 'none';
        }
    };

    clienteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clienteId = document.getElementById('clienteId').value;
        const cliente = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value
        };

        if (clienteId) {
            // Editar cliente existente
            cliente.id = parseInt(clienteId);
            const index = clientes.findIndex(c => c.id === cliente.id);
            clientes[index] = cliente;
        } else {
            // Agregar nuevo cliente
            cliente.id = clientes.length ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
            clientes.push(cliente);
        }

        mostrarClientes();
        clienteModal.style.display = 'none';
    });

    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });

    // Funciones globales para los botones de la tabla
    window.editarCliente = (id) => {
        const cliente = clientes.find(c => c.id === id);
        if (cliente) {
            document.getElementById('clienteId').value = cliente.id;
            document.getElementById('nombre').value = cliente.nombre;
            document.getElementById('email').value = cliente.email;
            document.getElementById('telefono').value = cliente.telefono;
            document.getElementById('modalTitle').textContent = 'Editar Cliente';
            clienteModal.style.display = 'block';
        }
    };

    window.eliminarCliente = (id) => {
        if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
            clientes = clientes.filter(c => c.id !== id);
            mostrarClientes();
        }
    };

    // Inicializar la tabla
    mostrarClientes();
});