// ===============================
// REGISTER.JS — TaskMaster 2.0
// ===============================

const registerForm = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación básica
    if (name === "" || email === "" || password === "") {
        showMessage("Por favor completa todos los campos.", "error");
        return;
    }

    // Obtener usuarios existentes
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el correo ya existe
    const emailExists = users.some((u) => u.email === email);

    if (emailExists) {
        showMessage("Este correo ya está registrado.", "error");
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        name,
        email,
        password,
        role: "Usuario",
        description: "Sin descripción"
    };

    // Guardar usuario
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Mensaje de éxito
    showMessage("Cuenta creada exitosamente. Redirigiendo...", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);
});

// Mostrar mensajes
function showMessage(msg, type) {
    registerMessage.textContent = msg;

    if (type === "error") {
        registerMessage.style.color = "#ff4d4d";
    } else {
        registerMessage.style.color = "#4ade80";
    }
}
