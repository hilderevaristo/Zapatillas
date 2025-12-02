function validateLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMessage = document.getElementById('error-message');
  const welcomeMessage = document.getElementById('welcome-message');

  // Ocultar mensajes previos
  errorMessage.style.display = 'none';
  welcomeMessage.style.display = 'none';

  // Validar campos vacíos
  if (!email || !password) {
    errorMessage.textContent = 'Todos los campos son obligatorios.';
    errorMessage.style.display = 'block';
    return;
  }

  // Validar formato del correo
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorMessage.textContent = 'Ingresa un correo válido.';
    errorMessage.style.display = 'block';
    return;
  }

  // Obtener nombre antes del @
  const userName = email.split('@')[0];

  // Guardar sesión
  localStorage.setItem('loggedInUser', userName);

  showUserName(userName);

  welcomeMessage.textContent = `¡Bienvenido, ${userName}!`;
  welcomeMessage.style.display = 'block';

  document.getElementById('loginForm').reset();
}

// Mostrar nombre del usuario en el menú
function showUserName(userName) {
  const loginItem = document.getElementById('login-item');
  const userNameElement = document.getElementById('user-name');

  if (!loginItem || !userNameElement) return;

  loginItem.classList.add('hidden');
  userNameElement.classList.remove('hidden');
  userNameElement.textContent = `👤 ${userName}`;

  userNameElement.onclick = () => {
    const confirmar = confirm('¿Deseas cerrar sesión?');
    if (confirmar) {
      localStorage.removeItem('loggedInUser');
      window.location.reload();
    }
  };
}

// Mantener sesión en cualquier página
document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('loggedInUser');
  if (userName) {
    showUserName(userName);
  }
});
