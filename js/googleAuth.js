function handleGoogleCredentialResponse(response) {
  const credential = response.credential;
  const errorMessage = document.getElementById("login-error-message");

  fetch("/php/googleLogin.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: credential }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.data.email,
            username: data.data.username,
          })
        );
        window.location.href = "index.html";
      } else {
        errorMessage.textContent = data.message || "Error al iniciar sesión con Google";
        errorMessage.style.display = "block";
      }
    })
    .catch(() => {
      errorMessage.textContent = "Error de conexión con el servidor.";
      errorMessage.style.display = "block";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleSignInBtn");

  
  google.accounts.id.initialize({
    client_id: "982467957111-cq5e40ir2bg5nu3kt2evbc31s64fkp9e.apps.googleusercontent.com",
    callback: handleGoogleCredentialResponse,
  });

  
  googleBtn?.addEventListener("click", () => {
    google.accounts.id.prompt();
  });
});
