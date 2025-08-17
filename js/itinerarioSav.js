document.addEventListener("DOMContentLoaded", async () => {
  const itineraryList = document.getElementById("itineraryList");

  try {
    const response = await fetch("/php/itinerarioSav.php"); 

    if (!response.ok) {
      throw new Error(`Error al cargar itinerarios: ${response.statusText}`);
    }

    const itineraries = await response.json();

    if (!itineraries.length) {
      itineraryList.innerHTML = `<p class="empty-msg">No tienes itinerarios guardados.</p>`;
      return;
    }

    itineraries.forEach(({ id, nombre }) => {
      const card = document.createElement("div");
      card.className = "itinerary-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", "false");

      card.textContent = nombre;

      card.addEventListener("click", () => {
        window.location.href = `/itinerarioDetalle.html?id=${id}`;
      });

      itineraryList.appendChild(card);
    });
  } catch (error) {
    itineraryList.innerHTML = `<p class="empty-msg">Error cargando itinerarios: ${error.message}</p>`;
    console.error(error);
  }
});
