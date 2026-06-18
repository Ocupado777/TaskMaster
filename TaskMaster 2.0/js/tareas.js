// ============================================================
// TAREAS.JS — TaskMaster 2.0
// CRUD + subtareas + detalles + edición + eliminación
// ============================================================

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let subtareasTemp = [];
let tareaSeleccionadaIndex = null;

// ABRIR MODAL NUEVA TAREA
document.getElementById("btnNuevaTarea").addEventListener("click", () => {
    tareaSeleccionadaIndex = null;
    limpiarFormularioTarea();
    subtareasTemp = [];
    renderSubtareas();
    document.getElementById("modalTareaTitulo").textContent = "Nueva Tarea";
    openModal("modal-tarea");
});

// LIMPIAR FORMULARIO
function limpiarFormularioTarea() {
    document.getElementById("tareaId").value = "";
    document.getElementById("tareaTitulo").value = "";
    document.getElementById("tareaDescripcion").value = "";
    document.getElementById("tareaPrioridad").value = "Alta";
    document.getElementById("tareaFecha").value = "";
    document.getElementById("tareaHora").value = "";
}

// AGREGAR SUBTAREA
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

// RENDER SUBTAREAS EN MODAL NUEVA/EDITAR
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

// MARCAR SUBTAREA EN MODAL NUEVA/EDITAR
document.addEventListener("change", (e) => {
    if (e.target.matches("#subtareasList input[type='checkbox']")) {
        const index = e.target.dataset.index;
        subtareasTemp[index].completada = e.target.checked;
    }
});

// CALCULAR ESTADO AUTOMÁTICO
function calcularEstado(subtareas) {
    if (!subtareas || subtareas.length === 0) return "Pendiente";

    const completadas = subtareas.filter(s => s.completada).length;

    if (completadas === 0) return "Pendiente";
    if (completadas < subtareas.length) return "En progreso";
    return "Completada";
}

// GUARDAR TAREA (NUEVA O EDITADA)
document.getElementById("guardarTareaBtn").addEventListener("click", () => {
    const titulo = document.getElementById("tareaTitulo").value.trim();
    if (titulo === "") {
        showToast("La tarea necesita un título", "error");
        return;
    }

    const nuevaTarea = {
        id: document.getElementById("tareaId").value || Date.now(),
        titulo,
        descripcion: document.getElementById("tareaDescripcion").value,
        prioridad: document.getElementById("tareaPrioridad").value,
        fecha: document.getElementById("tareaFecha").value,
        hora: document.getElementById("tareaHora").value,
        subtareas: subtareasTemp.slice()
    };

    nuevaTarea.estado = calcularEstado(nuevaTarea.subtareas);

    if (tareaSeleccionadaIndex === null) {
        tareas.push(nuevaTarea);
        showToast("Tarea creada con éxito", "success");
    } else {
        tareas[tareaSeleccionadaIndex] = nuevaTarea;
        showToast("Tarea actualizada", "success");
    }

    localStorage.setItem("tareas", JSON.stringify(tareas));

    subtareasTemp = [];
    renderTareas();
    closeModal("modal-tarea");
});

// RENDER LISTA DE TAREAS
function renderTareas() {
    const cont = document.getElementById("listaTareas");
    if (!cont) return;

    cont.innerHTML = "";

    tareas.forEach((t, i) => {
        const estadoClass = t.estado.toLowerCase().replace(" ", "");
        const prioridadClass = t.prioridad.toLowerCase();

        cont.innerHTML += `
            <tr>
                <td onclick="abrirDetalleTarea(${i})">${t.titulo}</td>
                <td onclick="abrirDetalleTarea(${i})"><span class="tag ${prioridadClass}">${t.prioridad}</span></td>
                <td onclick="abrirDetalleTarea(${i})"><span class="estado ${estadoClass}">${t.estado}</span></td>
                <td onclick="abrirDetalleTarea(${i})">${t.fecha} ${t.hora}</td>
                <td>
                    <div class="tarea-actions">
                        <button class="action-btn edit" onclick="editarTarea(${i}); event.stopPropagation();">✏️</button>
                        <button class="action-btn delete" onclick="eliminarTarea(${i}); event.stopPropagation();">🗑</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

renderTareas();

// ABRIR DETALLE TAREA
function abrirDetalleTarea(index) {
    tareaSeleccionadaIndex = index;
    const t = tareas[index];

    document.getElementById("detalleTitulo").textContent = t.titulo;
    document.getElementById("detalleDescripcion").textContent = t.descripcion || "Sin descripción";
    document.getElementById("detalleFecha").textContent = `${t.fecha} ${t.hora}`;
    document.getElementById("detalleEstado").textContent = t.estado;

    const cont = document.getElementById("detalleSubtareas");
    cont.innerHTML = "";

    if (!t.subtareas || t.subtareas.length === 0) {
        cont.innerHTML = "<p>Esta tarea no tiene subtareas.</p>";
    } else {
        t.subtareas.forEach((s, i) => {
            const item = document.createElement("div");
            item.classList.add("subtarea-item");

            item.innerHTML = `
                <input type="checkbox" data-index="${i}" ${s.completada ? "checked" : ""}>
                <span>${s.texto}</span>
            `;

            cont.appendChild(item);
        });
    }

    openModal("modal-detalle");
}

// MARCAR SUBTAREAS DESDE DETALLE
document.addEventListener("change", (e) => {
    if (e.target.closest("#detalleSubtareas") && e.target.type === "checkbox") {
        const index = e.target.dataset.index;
        const t = tareas[tareaSeleccionadaIndex];
        t.subtareas[index].completada = e.target.checked;

        t.estado = calcularEstado(t.subtareas);
        document.getElementById("detalleEstado").textContent = t.estado;

        localStorage.setItem("tareas", JSON.stringify(tareas));
        renderTareas();
    }
});

// EDITAR DESDE DETALLE
document.getElementById("btnEditarDesdeDetalle").addEventListener("click", () => {
    if (tareaSeleccionadaIndex === null) return;
    editarTarea(tareaSeleccionadaIndex);
    closeModal("modal-detalle");
});

// ELIMINAR DESDE DETALLE
document.getElementById("btnEliminarDesdeDetalle").addEventListener("click", () => {
    if (tareaSeleccionadaIndex === null) return;
    eliminarTarea(tareaSeleccionadaIndex);
    closeModal("modal-detalle");
});

// EDITAR TAREA (MISMO MODAL)
function editarTarea(index) {
    tareaSeleccionadaIndex = index;
    const t = tareas[index];

    document.getElementById("modalTareaTitulo").textContent = "Editar Tarea";
    document.getElementById("tareaId").value = t.id;
    document.getElementById("tareaTitulo").value = t.titulo;
    document.getElementById("tareaDescripcion").value = t.descripcion;
    document.getElementById("tareaPrioridad").value = t.prioridad;
    document.getElementById("tareaFecha").value = t.fecha;
    document.getElementById("tareaHora").value = t.hora;

    subtareasTemp = t.subtareas ? t.subtareas.slice() : [];
    renderSubtareas();

    openModal("modal-tarea");
}

// ELIMINAR TAREA
function eliminarTarea(index) {
    const t = tareas[index];
    if (!confirm(`¿Eliminar la tarea "${t.titulo}"?`)) return;

    tareas.splice(index, 1);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    renderTareas();
    showToast("Tarea eliminada", "error");
}

// FILTROS Y BÚSQUEDA
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
            const estadoClass = t.estado.toLowerCase().replace(" ", "");
            const prioridadClass = t.prioridad.toLowerCase();

            cont.innerHTML += `
                <tr>
                    <td onclick="abrirDetalleTarea(${i})">${t.titulo}</td>
                    <td onclick="abrirDetalleTarea(${i})"><span class="tag ${prioridadClass}">${t.prioridad}</span></td>
                    <td onclick="abrirDetalleTarea(${i})"><span class="estado ${estadoClass}">${t.estado}</span></td>
                    <td onclick="abrirDetalleTarea(${i})">${t.fecha} ${t.hora}</td>
                    <td>
                        <div class="tarea-actions">
                            <button class="action-btn edit" onclick="editarTarea(${i}); event.stopPropagation();">✏️</button>
                            <button class="action-btn delete" onclick="eliminarTarea(${i}); event.stopPropagation();">🗑</button>
                        </div>
                    </td>
                </tr>
            `;
        });
}
