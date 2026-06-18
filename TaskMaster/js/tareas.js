const listaTareas = document.getElementById("listaTareas");
const formTarea = document.getElementById("formTarea");
const subtareasList = document.getElementById("subtareasList");
const btnAgregarSubtarea = document.getElementById("btnAgregarSubtarea");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// 👉 Agregar subtareas dinámicas
btnAgregarSubtarea.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control mt-2 subtarea";
  input.placeholder = "Escribe una subtarea...";
  subtareasList.appendChild(input);
});

// 👉 Guardar tarea
formTarea.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const prioridad = document.getElementById("prioridad").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  const subtareas = Array.from(document.querySelectorAll(".subtarea")).map(s => ({
    texto: s.value,
    completada: false
  }));

  const nuevaTarea = { 
    id: Date.now(), 
    titulo, 
    descripcion, 
    prioridad, 
    fecha, 
    hora, 
    subtareas, 
    completada: false 
  };

  tareas.push(nuevaTarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  showAlert("success", "Tarea agregada correctamente ✅");

  // 👉 Cerrar modal automáticamente
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevaTarea"));
  modal.hide();

  // Resetear formulario
  formTarea.reset();
  subtareasList.innerHTML = "";
  mostrarTareas();
});

// 👉 Mostrar tareas
function mostrarTareas() {
  listaTareas.innerHTML = "";
  tareas.forEach(t => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4";
    card.innerHTML = `
      <div class="card shadow-sm p-3">
        <h5>${t.titulo}</h5>
        <p>${t.descripcion}</p>
        <span class="badge bg-${t.prioridad === "Alta" ? "danger" : t.prioridad === "Media" ? "warning" : "success"}">${t.prioridad}</span>
        <p class="mt-2"><i class="bi bi-calendar-event"></i> ${t.fecha} ${t.hora}</p>
        <button class="btn btn-outline-info btn-sm me-2" onclick="mostrarDetalle(${t.id})"><i class="bi bi-eye"></i></button>
        <button class="btn btn-outline-danger btn-sm" onclick="eliminarTarea(${t.id})"><i class="bi bi-trash"></i></button>
      </div>
    `;
    listaTareas.appendChild(card);
  });
}

// 👉 Eliminar tarea con confirmación
function eliminarTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (confirm(`¿Estás seguro de eliminar la tarea "${tarea.titulo}"?`)) {
    tareas = tareas.filter(t => t.id !== id);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    showAlert("error", "Tarea eliminada ❌");
    mostrarTareas();
  }
}

// 👉 Mostrar detalle de tarea con subtareas, countdown y botón Pomodoro
function mostrarDetalle(id) {
  const tarea = tareas.find(t => t.id === id);
  const detalleBody = document.getElementById("detalleTareaBody");

  // Subtareas interactivas
  let subtareasHTML = "";
  tarea.subtareas.forEach((s, i) => {
    subtareasHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="subtarea-${i}" ${s.completada ? "checked" : ""} onchange="toggleSubtarea(${id}, ${i})">
        <label class="form-check-label" for="subtarea-${i}">${s.texto}</label>
      </div>
    `;
  });

  // Contador regresivo
  const fechaLimite = new Date(`${tarea.fecha}T${tarea.hora}`);
  const ahora = new Date();
  const diff = fechaLimite - ahora;

  let dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  let horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let minutos = Math.floor((diff / (1000 * 60)) % 60);

  detalleBody.innerHTML = `
    <h5>${tarea.titulo}</h5>
    <p>${tarea.descripcion}</p>
    <span class="badge bg-${tarea.prioridad === "Alta" ? "danger" : tarea.prioridad === "Media" ? "warning" : "success"}">${tarea.prioridad}</span>
    <p><i class="bi bi-calendar-event"></i> ${tarea.fecha} ${tarea.hora}</p>
    <hr>
    <h6>Subtareas</h6>
    ${subtareasHTML}
    <hr>
    <h6>Tiempo restante ⏳</h6>
    <p>${dias} días, ${horas} horas, ${minutos} minutos</p>
    <hr>
    <button class="btn btn-outline-success w-100" id="btnPomodoroTarea">
      <i class="bi bi-hourglass-split"></i> Iniciar Pomodoro
    </button>
  `;

  const modal = new bootstrap.Modal(document.getElementById("modalDetalleTarea"));
  modal.show();

  // 👉 Botón Pomodoro con duración de la tarea
  document.getElementById("btnPomodoroTarea").onclick = () => {
    const diffMs = fechaLimite - ahora;
    if (diffMs > 0) {
      localStorage.setItem("pomodoroTiempo", diffMs);
      showAlert("info", `Pomodoro iniciado para "${tarea.titulo}" ⏳`);
      window.location.href = "productividad.html"; // redirige al módulo Pomodoro
    } else {
      showAlert("danger", "La hora de esta tarea ya pasó ❌");
    }
  };
}

// 👉 Toggle subtarea
function toggleSubtarea(idTarea, indexSubtarea) {
  const tarea = tareas.find(t => t.id === idTarea);
  tarea.subtareas[indexSubtarea].completada = !tarea.subtareas[indexSubtarea].completada;

  // Si todas las subtareas están completadas → tarea completada
  if (tarea.subtareas.every(s => s.completada)) {
    tarea.completada = true;
    showAlert("success", `Tarea "${tarea.titulo}" completada 🎉`);
  }

  localStorage.setItem("tareas", JSON.stringify(tareas));
  mostrarTareas();
}

// 👉 Inicializar
mostrarTareas();
