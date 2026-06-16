document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const savedEmail = localStorage.getItem("userEmail");

  if (email === savedEmail) {
    showAlert("error", "Correo ya registrado ❌");
  } else {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    showAlert("success", "Usuario registrado con éxito ✅");
    setTimeout(() => window.location.href = "login.html", 1500);
  }
});
