let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let ciclosCompletados = JSON.parse(localStorage.getItem("ciclos")) || 0;

const completadas = tareas.filter(t => t.completada).length;
const pendientes = tareas.filter(t => !t.completada).length;

document.getElementById("resumenTareas").textContent = `${pendientes} pendientes, ${completadas} completadas`;
document.getElementById("resumenCalendario").textContent = `${tareas.length} tareas registradas en calendario`;
document.getElementById("resumenProductividad").textContent = `${ciclosCompletados} ciclos Pomodoro`;
document.getElementById("resumenEstadisticas").textContent = `${tareas.length > 0 ? Math.round((completadas / tareas.length) * 100) : 0}% productividad`;
