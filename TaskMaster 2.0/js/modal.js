// ============================================================
// MODAL.JS — TaskMaster 2.0
// Control universal de modales
// ============================================================

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function closeAllModals() {
    document.querySelectorAll(".modal.show").forEach(modal => {
        modal.classList.remove("show");
    });
    document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.classList.remove("show");
        document.body.style.overflow = "";
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-modal")) {
        const modal = e.target.closest(".modal");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAllModals();
    }
});
