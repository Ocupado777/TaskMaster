// ============================================================
// GLOBALUSER.JS — TaskMaster 2.0
// Carga de usuario en header y sidebar
// ============================================================

const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

// Si no hay usuario, no hacemos nada (auth.js ya redirige)
if (sessionUser) {

    // Nombre completo
    const nameElements = document.querySelectorAll(".user-name");
    nameElements.forEach(el => el.textContent = sessionUser.name);

    // Rol o descripción
    const roleElements = document.querySelectorAll(".user-role");
    roleElements.forEach(el => el.textContent = sessionUser.description || "Sin descripción");

    // Avatar con inicial
    const avatarElements = document.querySelectorAll(".user-avatar");
    const initial = sessionUser.name.charAt(0).toUpperCase();

    avatarElements.forEach(el => {
        el.textContent = initial;
    });
}
