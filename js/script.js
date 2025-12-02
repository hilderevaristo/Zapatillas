// JavaScript para manejar el menú desplegable
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open'); // 🔥 ESTA LÍNEA OCULTA EL CARRITO
});

document.addEventListener("click", function(e) {
    if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !menuIcon.contains(e.target)
    ) {
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open"); // 🔥 CIERRA EL OCULTAMIENTO
    }
});
