// Cambiar tema global
function setTheme(theme) {
  document.body.className = theme; // 'light', 'dark', 'premium'
  localStorage.setItem('theme', theme); // Guardar preferencia
}

// Cargar tema al iniciar
window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
};

// Ventanas emergentes globales
function showAlert(type, message) {
  // type: 'success' | 'error'
  const icon = type === 'success' ? 'bi-check-circle' : 'bi-x-circle';
  const alertBox = document.createElement('div');
  alertBox.className = `alert alert-${type} d-flex align-items-center position-fixed top-0 end-0 m-3`;
  alertBox.style.zIndex = "9999";
  alertBox.innerHTML = `<i class="bi ${icon} me-2"></i> ${message}`;
  document.body.appendChild(alertBox);

  setTimeout(() => alertBox.remove(), 3000);
}
