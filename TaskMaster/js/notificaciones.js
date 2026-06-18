const btnNotificaciones = document.getElementById("btnNotificaciones");
const contadorNotificaciones = document.getElementById("contadorNotificaciones");
const listaNotificaciones = document.getElementById("listaNotificaciones");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let notificaciones = [];

// 👉 Generar notificaciones según fecha límite
function generarNotificaciones() {
  notificaciones = [];
  const ahora = new Date();

  tareas.forEach(t => {
    const fechaLimite = new Date(`${t.fecha}T${t.hora}`);
    const diff = fechaLimite - ahora;

    if (!t.completada) {
      if (diff <= 0) {
        notificaciones.push({ tipo: "danger", mensaje: `La tarea "${t.titulo}" está vencida ❌` });
        mostrarAlertaFullscreen("danger", `La tarea "${t.titulo}" está vencida ❌`);
      } else if (diff <= 1000 * 60 * 60) { // menos de 1 hora
        notificaciones.push({ tipo: "warning", mensaje: `La tarea "${t.titulo}" vence en menos de 1 hora ⏳` });
        mostrarAlertaFullscreen("warning", `La tarea "${t.titulo}" vence en menos de 1 hora ⏳`);
      }
    }
  });

  contadorNotificaciones.textContent = notificaciones.length;
}

// 👉 Mostrar lista en modal
btnNotificaciones.addEventListener("click", () => {
  listaNotificaciones.innerHTML = notificaciones.length === 0 
    ? "<p>No hay notificaciones 📭</p>" 
    : notificaciones.map(n => `
      <div class="alert alert-${n.tipo} d-flex align-items-center mb-2">
        <i class="bi ${n.tipo === "danger" ? "bi-x-circle" : "bi-exclamation-triangle"} me-2"></i>
        ${n.mensaje}
      </div>
    `).join("");

  const modal = new bootstrap.Modal(document.getElementById("modalNotificaciones"));
  modal.show();
});

// 👉 Alertas fullscreen
function mostrarAlertaFullscreen(tipo, mensaje) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} text-center position-fixed top-0 start-0 w-100 p-3`;
  alerta.style.zIndex = "9999";
  alerta.innerHTML = `<strong>${mensaje}</strong>`;
  document.body.appendChild(alerta);

  setTimeout(() => alerta.remove(), 4000);
}

// 👉 Inicializar cada cierto tiempo
setInterval(generarNotificaciones, 30000); // cada 30 segundos
generarNotificaciones();
