const switchBtn = document.getElementById("theme-switch");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

// Cargar tema guardado
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    switchBtn.checked = true;
    themeIcon.src = "assets/img/icons/sun.svg";
    themeLabel.textContent = "Modo claro";
}

switchBtn.addEventListener("change", () => {
    if (switchBtn.checked) {
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
        themeIcon.src = "assets/img/icons/sun.svg";
        themeLabel.textContent = "Modo claro";
    } else {
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
        themeIcon.src = "assets/img/icons/moon.svg";
        themeLabel.textContent = "Modo oscuro";
    }
});
