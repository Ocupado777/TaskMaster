// ============================================================
// TAREAS.JS — TaskMaster 2.0
// CRUD de tareas + subtareas infinitas + detalles
// ============================================================

// Lista de tareas guardadas
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Lista temporal de subtareas antes de guardar
let subtareasTemp = [];

// ============================================================
// 1. ABRIR MODAL DE NUEVA TAREA
// ============================================================

document.getElementById("btnNuevaTarea").addEventListener("click", () => {
    subtareasTemp = [];
    renderSubtareas();
    openModal("modal-tarea");
});

// ============================================================
// 2. AGREGAR SUBTAREA
// ============================================================

document.getElementById("addSubtareaBtn").addEventListener("click", () => {
    const input = document.getElementById("subtareaInput");
    const texto = input.value.trim();

    if (texto === "") return;

    subtareasTemp.push({
        texto,
        completada: false
    });

    renderSubtareas();
    input.value = "";
});

// Renderizar subtareas en el modal
function renderSubtareas() {
    const cont = document.getElementById("subtareasList");
    cont.innerHTML = "";

    subtareasTemp.forEach((s, i) => {
        const item = document.createElement("div");
        item.classList.add("subtarea-item");

        item.innerHTML = `
            <input type="checkbox" data-index="${i}" ${s.completada ? "checked" : ""}>
            <span>${s.texto}</span>
        `;

        cont.appendChild(item);
    });
}

// Marcar subtarea
document.addEventListener("change", (e) => {
    if (e.target.matches(".subtarea-item input[type='checkbox']")) {
        const index = e.target.dataset.index;
        subtareasTemp[index].completada = e.target.checked;

        // Si todas están completadas → tarea completada
        if (subtareasTemp.every(s => s.completada)) {
            document.getElementById("tareaEstado").value = "Completada";
        }
    }
});

// ============================================================
// 3. GUARDAR TAREA
// ============================================================

document.getElementById("guardarTareaBtn").addEventListener("click", () => {
    const nuevaTarea = {
        id: Date.now(),
        titulo: document.getElementById("tareaTitulo").value,
        descripcion: document.getElementById("tareaDescripcion").value,
        prioridad: document.getElementById("tareaPrioridad").value,
        estado: document.getElementById("tareaEstado").value,
        fecha: document.getElementById("tareaFecha").value,
        hora: document.getElementById("tareaHora").value,
        subtareas: subtareasTemp
    };

    tareas.push(nuevaTarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));

    subtareasTemp = [];
    renderTareas();
    closeModal("modal-tarea");
});

// ============================================================
// 4. RENDERIZAR LISTA DE TAREAS
// ============================================================

function renderTareas() {
    const cont = document.getElementById("listaTareas");
    if (!cont) return;

    cont.innerHTML = "";

    tareas.forEach((t, i) => {
        cont.innerHTML += `
            <tr onclick="abrirDetalleTarea(${i})">
                <td>${t.titulo}</td>
                <td><span class="tag ${t.prioridad.toLowerCase()}">${t.prioridad}</span></td>
                <td><span class="estado ${t.estado.toLowerCase().replace(" ", "")}">${t.estado}</span></td>
                <td>${t.fecha} ${t.hora}</td>
            </tr>
        `;
    });
}

renderTareas();

// ============================================================
// 5. MODAL DE DETALLES
// ============================================================

function abrirDetalleTarea(index) {
    const t = tareas[index];

    document.getElementById("detalleTitulo").textContent = t.titulo;
    document.getElementById("detalleDescripcion").textContent = t.descripcion;
    document.getElementById("detalleFecha").textContent = t.fecha + " " + t.hora;
    document.getElementById("detalleEstado").textContent = t.estado;

    const cont = document.getElementById("detalleSubtareas");
    cont.innerHTML = "";

    t.subtareas.forEach(s => {
        cont.innerHTML += `
            <p>${s.completada ? "✔" : "✖"} ${s.texto}</p>
        `;
    });

    openModal("modal-detalle");
}

// ============================================================
// 6. FILTROS Y BÚSQUEDA
// ============================================================

document.getElementById("buscarTarea").addEventListener("input", filtrarTareas);
document.getElementById("filtroPrioridad").addEventListener("change", filtrarTareas);
document.getElementById("filtroEstado").addEventListener("change", filtrarTareas);

function filtrarTareas() {
    const texto = document.getElementById("buscarTarea").value.toLowerCase();
    const prioridad = document.getElementById("filtroPrioridad").value;
    const estado = document.getElementById("filtroEstado").value;

    const cont = document.getElementById("listaTareas");
    cont.innerHTML = "";

    tareas
        .filter(t => 
            t.titulo.toLowerCase().includes(texto) &&
            (prioridad === "" || t.prioridad === prioridad) &&
            (estado === "" || t.estado === estado)
        )
        .forEach((t, i) => {
            cont.innerHTML += `
                <tr onclick="abrirDetalleTarea(${i})">
                    <td>${t.titulo}</td>
                    <td><span class="tag ${t.prioridad.toLowerCase()}">${t.prioridad}</span></td>
                    <td><span class="estado ${t.estado.toLowerCase().replace(" ", "")}">${t.estado}</span></td>
                    <td>${t.fecha} ${t.hora}</td>
                </tr>
            `;
        });
}
