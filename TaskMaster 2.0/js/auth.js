// ============================================================
// AUTH.JS — TaskMaster 2.0
// Control de sesión, protección de páginas y logout
// ============================================================

// Obtener usuario en sesión
const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

// Lista de páginas que NO requieren sesión
const publicPages = ["login.html", "register.html", "index.html"];

// Obtener nombre del archivo actual
const currentPage = window.location.pathname.split("/").pop();

// ============================================================
// 1. PROTEGER PÁGINAS PRIVADAS
// ============================================================

if (!publicPages.includes(currentPage)) {
    // Si NO hay sesión → redirigir al login
    if (!sessionUser) {
        window.location.href = "login.html";
    }
}

// ============================================================
// 2. EVITAR QUE UN USUARIO LOGUEADO ENTRE AL LOGIN O REGISTER
// ============================================================

if (sessionUser && publicPages.includes(currentPage)) {
    window.location.href = "dashboard.html";
}

// ============================================================
// 3. FUNCIÓN DE LOGOUT (para usar en cualquier página)
// ============================================================

function cerrarSesion() {
    localStorage.removeItem("sessionUser");
    window.location.href = "login.html";
}
