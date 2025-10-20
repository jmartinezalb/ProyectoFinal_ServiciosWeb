document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('registerForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    messageDiv.textContent = '';
    messageDiv.className = '';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        messageDiv.textContent = data.message || 'Registro exitoso';
        messageDiv.className = 'text-success';

        // Redirigir a login después de 1 segundo
        setTimeout(() => window.location.href = '/login.html', 1000);
      } else {
        // Mostrar errores de validación o servidor
        if (data.errors) {
          messageDiv.textContent = data.errors.map(e => e.msg).join(', ');
        } else {
          messageDiv.textContent = data.error || 'Error desconocido';
        }
        messageDiv.className = 'text-danger';
      }
    } catch (err) {
      messageDiv.textContent = 'Error de conexión con el servidor';
      messageDiv.className = 'text-danger';
      console.error(err);
    }
  });
});
