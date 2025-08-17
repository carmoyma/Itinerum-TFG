document.addEventListener("DOMContentLoaded", () => {
  fetch("/php/check_session.php")
    .then((res) => res.json())
    .then((data) => {
      const freeAction = document.getElementById("free-plan-action");
      const proAction = document.getElementById("pro-plan-action");

      if (!data.loggedIn) {
        freeAction.innerHTML = `
          <a href="signup.html" class="inline-flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">Start for free</a>
        `;
        proAction.innerHTML = `
          <a href="signup.html" class="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100">Get Pro</a>
        `;
      } else if (!data.user.isPro) {
        freeAction.innerHTML = `<p class="text-center text-sm font-medium text-green-600">Ya estás suscripto al plan Free</p>`;
        proAction.innerHTML = `
          <button id="pro-btn" class="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100">
            <span id="btn-text">Obtener Pro</span>
            <span id="btn-spinner" class="hidden h-4 w-4 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"></span>
          </button>
        `;
        
        const button = document.getElementById("pro-btn");
        const text = document.getElementById("btn-text");
        const spinner = document.getElementById("btn-spinner");

        button.addEventListener("click", () => {
            text.classList.add("hidden");
            spinner.classList.remove("hidden");

            window.location.href =
            "https://buy.stripe.com/test_6oU4gz8137BY0BjbLefrW00";
        });
        
      } else {
        freeAction.innerHTML = `<p class="text-center text-sm font-medium text-gray-400">Incluido con tu plan Pro</p>`;
        proAction.innerHTML = `<p class="text-center text-sm font-medium text-green-400">Ya estás suscripto al plan Pro</p>`;
      }
    })
    .catch((err) => {
      console.error("Error al obtener estado de usuario:", err);
    });
});
