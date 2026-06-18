const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

document.addEventListener("DOMContentLoaded", () => {
    if (!sessionUser) return;

    const nameElements = document.querySelectorAll(".user-name");
    const roleElements = document.querySelectorAll(".user-role");
    const avatarElements = document.querySelectorAll(".user-avatar");

    nameElements.forEach(el => el.textContent = sessionUser.name);
    roleElements.forEach(el => el.textContent = sessionUser.description || "Usuario");

    const inicial = sessionUser.name.charAt(0).toUpperCase();
    avatarElements.forEach(el => el.textContent = inicial);
});
