document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Simulación de validación
  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (email === savedEmail && password === savedPassword) {
    showAlert("success", `Bienvenido ${localStorage.getItem("userName")} 👋`);
    setTimeout(() => window.location.href = "index.html", 1500);
  } else {
    showAlert("error", "Correo o contraseña incorrectos ❌");
  }
});
