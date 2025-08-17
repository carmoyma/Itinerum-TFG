window.onload = () => {
  const menutoggle = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdownMenu");

  menutoggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  
  document.addEventListener("click", (e) => {
    if (!menutoggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      localStorage.removeItem("user");

      try {
        await fetch("/php/logout.php", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }

      window.location.href = "login.html";
    });
  } else {
    console.warn("Botón de logout no encontrado");
  }
};
window.onload = () => {
  const menutoggle = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdownMenu");

  menutoggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  
  document.addEventListener("click", (e) => {
    if (!menutoggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      localStorage.removeItem("user");

      try {
        await fetch("/php/logout.php", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }

      window.location.href = "login.html";
    });
  } else {
    console.warn("Botón de logout no encontrado");
  }
};
