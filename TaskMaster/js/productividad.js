let tiempo = 25 * 60 * 1000; // tiempo en milisegundos (25 min por defecto)
let intervalo = null;
let ciclosCompletados = JSON.parse(localStorage.getItem("ciclos")) || 0;

const timerDisplay = document.getElementById("timer");
const historialHabitos = document.getElementById("historialHabitos");
const logrosDiv = document.getElementById("logros");
const formConfigTimer = document.getElementById("formConfigTimer");

function actualizarDisplay() {
  const horas = Math.floor(tiempo / 3600000);
  const minutos = Math.floor((tiempo % 3600000) / 60000);
  const segundos = Math.floor((tiempo % 60000) / 1000);
  const ms = tiempo % 1000;
  timerDisplay.textContent = 
    `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}

function iniciarPomodoro() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    tiempo -= 10; // restamos cada 10ms
    actualizarDisplay();

    if (tiempo <= 0) {
      clearInterval(intervalo);
      intervalo = null;
      ciclosCompletados++;
      localStorage.setItem("ciclos", ciclosCompletados);
      showAlert("success", "¡Pomodoro completado! 🎉");
      actualizarHistorial();
      actualizarLogros();
    }
  }, 10);
}

function pausarPomodoro() {
  clearInterval(intervalo);
  intervalo = null;
}

function reiniciarPomodoro() {
  clearInterval(intervalo);
  intervalo = null;
  tiempo = 25 * 60 * 1000;
  actualizarDisplay();
}

// 👉 Configuración manual (horas y minutos)
formConfigTimer.addEventListener("submit", (e) => {
  e.preventDefault();
  const horas = parseInt(document.getElementById("horasConfig").value) || 0;
  const minutos = parseInt(document.getElementById("minutosConfig").value) || 0;
  tiempo = (horas * 3600000) + (minutos * 60000);
  actualizarDisplay();
});

function actualizarHistorial() {
  historialHabitos.innerHTML = "";
  for (let i = 1; i <= ciclosCompletados; i++) {
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = `Ciclo ${i} completado ✅`;
    historialHabitos.appendChild(item);
  }
}

function actualizarLogros() {
  logrosDiv.innerHTML = "";
  if (ciclosCompletados >= 5) {
    logrosDiv.innerHTML += `<div class="col-12 col-md-4"><div class="alert alert-info">🏆 Maestro del enfoque (5 ciclos)</div></div>`;
  }
  if (ciclosCompletados >= 10) {
    logrosDiv.innerHTML += `<div class="col-12 col-md-4"><div class="alert alert-success">🔥 Productividad legendaria (10 ciclos)</div></div>`;
  }
}

// 👉 Revisar si viene un Pomodoro desde una tarea
const pomodoroTiempoGuardado = localStorage.getItem("pomodoroTiempo");
if (pomodoroTiempoGuardado) {
  tiempo = parseInt(pomodoroTiempoGuardado);
  localStorage.removeItem("pomodoroTiempo");
  actualizarDisplay();
  iniciarPomodoro();
} else {
  // Inicializar normal
  actualizarDisplay();
}

actualizarHistorial();
actualizarLogros();
