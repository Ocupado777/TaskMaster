const calendar = document.getElementById("calendar");
const formCalendario = document.getElementById("formCalendario");
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let fechaSeleccionada = null;

// 👉 Generar calendario del mes actual
function generarCalendario() {
  calendar.innerHTML = "";
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth();

  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const totalDias = ultimoDia.getDate();

  for (let dia = 1; dia <= totalDias; dia++) {
    const fechaStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const tareasDia = tareas.filter(t => t.fecha === fechaStr);

    let tareasHTML = "";
    tareasDia.forEach(t => {
      const color = t.prioridad === "Alta" ? "danger" : t.prioridad === "Media" ? "warning" : "success";
      tareasHTML += `<span class="badge bg-${color} d-block mb-1"><i class="bi bi-check2-square"></i> ${t.titulo}</span>`;
    });

    const card = document.createElement("div");
    card.className = "col-12 col-md-3 col-lg-2 border p-2 text-center";
    card.innerHTML = `
      <div class="day-card" onclick="mostrarDia('${fechaStr}')">
        <h6>${dia}</h6>
        ${tareasHTML || "<small class='text-muted'>Sin tareas</small>"}
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="abrirModalAgregar('${fechaStr}')">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    `;
    calendar.appendChild(card);
  }
}

// 👉 Mostrar tareas del día en modal
function mostrarDia(fecha) {
  const tareasDia = tareas.filter(t => t.fecha === fecha);
  const detalleBody = document.getElementById("detalleDiaBody");

  if (tareasDia.length === 0) {
    detalleBody.innerHTML = "<p>No hay tareas para este día 📭</p>";
  } else {
    detalleBody.innerHTML = tareasDia.map(t => `
      <div class="card p-2 mb-2">
        <h6>${t.titulo}</h6>
        <p>${t.descripcion}</p>
        <span class="badge bg-${t.prioridad === "Alta" ? "danger" : t.prioridad === "Media" ? "warning" : "success"}">${t.prioridad}</span>
        <p><i class="bi bi-clock"></i> ${t.hora}</p>
      </div>
    `).join("");
  }

  const modal = new bootstrap.Modal(document.getElementById("modalDia"));
  modal.show();
}

// 👉 Abrir modal para agregar tarea
function abrirModalAgregar(fecha) {
  fechaSeleccionada = fecha;
  const modal = new bootstrap.Modal(document.getElementById("modalAgregarTarea"));
  modal.show();
}

// 👉 Guardar tarea desde el modal
formCalendario.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("tituloCalendario").value;
  const descripcion = document.getElementById("descripcionCalendario").value;
  const prioridad = document.getElementById("prioridadCalendario").value;
  const hora = document.getElementById("horaCalendario").value;

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion,
    prioridad,
    fecha: fechaSeleccionada,
    hora,
    subtareas: [],
    completada: false
  };

  tareas.push(nuevaTarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  showAlert("success", "Tarea agregada correctamente ✅");

  // 👉 Cerrar modal automáticamente
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarTarea"));
  modal.hide();

  formCalendario.reset();
  generarCalendario();
});

// 👉 Inicializar
generarCalendario();
