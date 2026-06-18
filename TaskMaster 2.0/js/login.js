// ===============================
// LOGIN.JS — TaskMaster 2.0
// ===============================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación básica
    if (email === "" || password === "") {
        showMessage("Por favor completa todos los campos.", "error");
        return;
    }

    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Buscar usuario
    const userFound = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!userFound) {
        showMessage("Correo o contraseña incorrectos.", "error");
        return;
    }

    // Guardar sesión
    localStorage.setItem("sessionUser", JSON.stringify(userFound));

    // Mensaje de éxito
    showMessage("Inicio de sesión exitoso. Redirigiendo...", "success");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 800);
});

// Mostrar mensajes
function showMessage(msg, type) {
    loginMessage.textContent = msg;

    if (type === "error") {
        loginMessage.style.color = "#ff4d4d";
    } else {
        loginMessage.style.color = "#4ade80";
    }
}
