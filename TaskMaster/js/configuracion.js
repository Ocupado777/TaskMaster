function cambiarTema(tema) {
  document.body.className = tema;
  localStorage.setItem("tema", tema);
  showAlert("info", `Tema cambiado a ${tema} 🎨`);
}

// 👉 Recuperar tema guardado
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado) {
  document.body.className = temaGuardado;
}

// 👉 Cambiar tamaño de fuente
const fontSizeRange = document.getElementById("fontSizeRange");
fontSizeRange.addEventListener("input", () => {
  document.body.style.fontSize = fontSizeRange.value + "px";
  localStorage.setItem("fontSize", fontSizeRange.value);
});

// 👉 Recuperar tamaño guardado
const fontSizeGuardado = localStorage.getItem("fontSize");
if (fontSizeGuardado) {
  document.body.style.fontSize = fontSizeGuardado + "px";
  fontSizeRange.value = fontSizeGuardado;
}

// 👉 Resetear datos
function resetDatos() {
  if (confirm("¿Seguro que quieres resetear todos los datos?")) {
    localStorage.clear();
    showAlert("danger", "Todos los datos fueron reseteados ❌");
    window.location.reload();
  }
}
