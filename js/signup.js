document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) return;

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;

    if (!email || !password) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, introduce un email válido.");
      return;
    }

    
    const captchaToken = grecaptcha.getResponse();
    if (!captchaToken) {
      alert("Por favor, verifica que no eres un robot.");
      return;
    }

    
    fetch("php/signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, captcha: captchaToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Usuario registrado correctamente!");

          const user = {
            name: data.name,
            email: data.email,
            initial: data.name.charAt(0).toUpperCase(),
          };

          localStorage.setItem("user", JSON.stringify(user));
          window.location.href = "index.html";
        } else {
          alert("Error: " + data.message);
          grecaptcha.reset(); 
        }
      })
      .catch(() => {
        alert("Error de conexión con el servidor.");
        grecaptcha.reset();
      });
  });
});
