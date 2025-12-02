
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartBtn = document.getElementById('empty-cart');
    const cartCount = document.getElementById('cart-count');
    const buyCartBtn = document.getElementById('buy-cart');

    // Cargar el carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para guardar el carrito en localStorage
    const saveCart = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    // Función para agregar productos al carrito
    const addToCart = (producto, precio, cantidad) => {
        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        // Verificar si el producto ya está en el carrito
        const itemIndex = carrito.findIndex(item => item.producto === producto);
        if (itemIndex !== -1) {
            carrito[itemIndex].cantidad += cantidad;
        } else {
            carrito.push({ producto, precio, cantidad });
        }
        
        saveCart(); 
        updateCart();
    };

    // Actualizar el carrito y el total
    const updateCart = () => {
        cartItems.innerHTML = '';
        let total = 0;
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <div class="cart-column name">${item.producto}</div>
                <div class="cart-column quantity">${item.cantidad}</div>
                <div class="cart-column price">${item.precio.toFixed(2)}</div>
                <div class="cart-column total">${(item.precio * item.cantidad).toFixed(2)}</div>
                <div class="cart-column actions">
                    <button class="btn-remove" data-producto="${item.producto}">Eliminar</button>
                </div>
            `;
            cartItems.appendChild(li);
            total += item.precio * item.cantidad;
        });
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = carrito.length;
    };

    // Delegación de eventos para añadir al carrito
    document.addEventListener('click', (event) => {
        // Manejar añadir al carrito
        if (event.target.classList.contains('btn-add-to-cart')) {
            const button = event.target;
            const producto = button.getAttribute('data-producto');
            const precio = parseFloat(button.getAttribute('data-precio'));
            const inputCantidad = button.closest('.buttons').previousElementSibling.querySelector('input');
            const cantidad = parseInt(inputCantidad.value);
            
            if (cantidad <= 0) {
                alert('La cantidad debe ser mayor a 0');
                inputCantidad.value = 1;
                return;
            }
            
            addToCart(producto, precio, cantidad);
        }
        
        // Manejar botón "Comprar ya"
        if (event.target.classList.contains('btn-nov')) {
            const button = event.target;
            const producto = button.getAttribute('data-producto');
            const precio = parseFloat(button.getAttribute('data-precio'));
            
            // Añadir un solo producto inmediatamente
            addToCart(producto, precio, 1);
        }
        
        // Manejar eliminación de productos del carrito
        if (event.target.classList.contains('btn-remove')) {
            const producto = event.target.getAttribute('data-producto');
            carrito = carrito.filter(item => item.producto !== producto);
            saveCart();
            updateCart();
        }
    });

    // Vaciar el carrito
    emptyCartBtn.addEventListener('click', () => {
        carrito = [];
        saveCart();
        updateCart();
    });

    buyCartBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agrega productos para comprar.');
        } else {
            alert('¡Compra realizada con éxito!');
            carrito = [];
            saveCart();
            updateCart();
        }
    });

    // Mostrar el modal al hacer clic en el ícono del carrito
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Cargar el carrito al iniciar
    updateCart();
});
