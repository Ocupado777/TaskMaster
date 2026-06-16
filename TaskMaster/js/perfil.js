let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let ciclosCompletados = JSON.parse(localStorage.getItem("ciclos")) || 0;

// 👉 Datos de ejemplo (puedes conectarlos con login)
document.getElementById("nombreUsuario").textContent = "Abel";
document.getElementById("emailUsuario").textContent = "abel@taskmaster.com";

// 👉 Resumen
document.getElementById("perfilTareas").textContent = `${tareas.length} tareas creadas`;
document.getElementById("perfilCompletadas").textContent = `${tareas.filter(t => t.completada).length} tareas completadas`;
document.getElementById("perfilPomodoro").textContent = `${ciclosCompletados} ciclos Pomodoro`;

// 👉 Cerrar sesión
function cerrarSesion() {
  localStorage.clear();
  showAlert("info", "Sesión cerrada 🚪");
  window.location.href = "login.html";
}
