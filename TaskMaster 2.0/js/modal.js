// ============================================================
// MODAL.JS — TaskMaster 2.0
// Control universal de modales
// ============================================================

// Abrir modal
export function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden"; // bloquear scroll
}

// Cerrar modal
export function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("show");
    document.body.style.overflow = ""; // restaurar scroll
}

// Cerrar todos los modales
export function closeAllModals() {
    document.querySelectorAll(".modal.show").forEach(modal => {
        modal.classList.remove("show");
    });
    document.body.style.overflow = "";
}

// ============================================================
// EVENTOS GLOBALES
// ============================================================

// Cerrar al hacer clic fuera del contenido
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.classList.remove("show");
        document.body.style.overflow = "";
    }
});

// Cerrar con botones .close-modal
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-modal")) {
        const modal = e.target.closest(".modal");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }
});

// Cerrar con tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAllModals();
    }
});
