let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let ciclosCompletados = JSON.parse(localStorage.getItem("ciclos")) || 0;
let historialProductividad = JSON.parse(localStorage.getItem("historialProductividad")) || {};

const totalTareasElem = document.getElementById("totalTareas");
const productividadElem = document.getElementById("productividad");
const subtareasCompletadasElem = document.getElementById("subtareasCompletadas");

// 👉 Calcular métricas
const totalTareas = tareas.length;
const completadas = tareas.filter(t => t.completada).length;
const pendientes = tareas.filter(t => !t.completada).length;
const vencidas = tareas.filter(t => new Date(`${t.fecha}T${t.hora}`) < new Date() && !t.completada).length;

const productividad = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;
const subtareasCompletadas = tareas.reduce((acc, t) => acc + t.subtareas.filter(s => s.completada).length, 0);

// 👉 Guardar productividad diaria
const hoy = new Date().toISOString().split("T")[0];
if (!historialProductividad[hoy]) {
  historialProductividad[hoy] = { tareasCompletadas: completadas, ciclosPomodoro: ciclosCompletados };
} else {
  historialProductividad[hoy].tareasCompletadas = completadas;
  historialProductividad[hoy].ciclosPomodoro = ciclosCompletados;
}
localStorage.setItem("historialProductividad", JSON.stringify(historialProductividad));

// 👉 Mostrar KPIs
totalTareasElem.textContent = totalTareas;
productividadElem.textContent = productividad + "%";
subtareasCompletadasElem.textContent = subtareasCompletadas;

// 👉 Gráfico de tareas
new Chart(document.getElementById("graficoTareas"), {
  type: "doughnut",
  data: {
    labels: ["Completadas ✅", "Pendientes ⏳", "Vencidas ❌"],
    datasets: [{
      data: [completadas, pendientes, vencidas],
      backgroundColor: ["#198754", "#ffc107", "#dc3545"]
    }]
  }
});

// 👉 Gráfico de prioridades
const altas = tareas.filter(t => t.prioridad === "Alta").length;
const medias = tareas.filter(t => t.prioridad === "Media").length;
const bajas = tareas.filter(t => t.prioridad === "Baja").length;

new Chart(document.getElementById("graficoPrioridades"), {
  type: "bar",
  data: {
    labels: ["Alta 🔴", "Media 🟡", "Baja 🟢"],
    datasets: [{
      label: "Cantidad de tareas",
      data: [altas, medias, bajas],
      backgroundColor: ["#dc3545", "#ffc107", "#198754"]
    }]
  }
});

// 👉 Gráfico de productividad a lo largo del tiempo
const fechas = Object.keys(historialProductividad).sort();
const tareasPorDia = fechas.map(f => historialProductividad[f].tareasCompletadas);
const ciclosPorDia = fechas.map(f => historialProductividad[f].ciclosPomodoro);

new Chart(document.getElementById("graficoProductividad"), {
  type: "line",
  data: {
    labels: fechas,
    datasets: [
      {
        label: "Tareas completadas por día ✅",
        data: tareasPorDia,
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.2)",
        fill: true,
        tension: 0.3
      },
      {
        label: "Ciclos Pomodoro 🎯",
        data: ciclosPorDia,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.2)",
        fill: true,
        tension: 0.3
      }
    ]
  }
});
