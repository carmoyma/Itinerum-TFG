document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("login-error-message");

  loginForm?.addEventListener("submit", async e => {
    e.preventDefault();

    const email = loginForm.querySelector('input[name="email"]').value.trim();
    const password = loginForm.querySelector('input[name="password"]').value;
    const captchaToken = grecaptcha.getResponse();

    if (!captchaToken) {
      errorMessage.textContent = "Por favor, verifica que no eres un robot.";
      errorMessage.style.display = "block";
      return;
    }

    try {
      const response = await fetch("/php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captcha: captchaToken }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.data.email,
            username: data.data.username,
          })
        );
        window.location.href = data.redirect || '/';
      } else {
        errorMessage.textContent = data.message;
        errorMessage.style.display = "block";
      }
    } catch {
      errorMessage.textContent = "Error de conexión con el servidor.";
      errorMessage.style.display = "block";
    }
  });
});
