document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      messageDiv.textContent = '';
      messageDiv.className = '';
  
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          messageDiv.textContent = data.message || 'Login exitoso';
          messageDiv.className = 'text-success';
  
          // Guardar token en localStorage para usarlo en otros endpoints
          if (data.token) localStorage.setItem('token', data.token);
  
          // Redirigir a página principal después de 1 segundo
          setTimeout(() => window.location.href = '/dashboard.html', 1000);
        } else {
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
  