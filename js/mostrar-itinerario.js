document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("itinerary-list");
  container.className = "flex flex-wrap justify-center gap-6 p-4";

  const idItinerario = sessionStorage.getItem("ultimoItinerarioId");

  if (!idItinerario) {
    const mensaje = document.createElement("p");
    mensaje.className = "text-gray-600 text-center mt-10 w-full";
    mensaje.textContent = "No se encontró un itinerario reciente.";
    container.appendChild(mensaje);
    return;
  }

  try {
    const res = await fetch(`/php/itinerarioDetalle.php?id=${idItinerario}`);
    const lugares = await res.json();

    if (!Array.isArray(lugares) || lugares.length === 0) {
      throw new Error("No se encontraron lugares.");
    }

    lugares.forEach((lugar) => {
      const card = document.createElement("article");
      card.className =
        "w-full sm:w-[45%] max-w-md bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl";

      card.innerHTML = `
        <img src="${lugar.imagen || 'https://via.placeholder.com/400x200'}" alt="${lugar.nombre}" class="w-full h-48 object-cover"/>
        <div class="p-5">
          <h2 class="text-xl font-semibold text-gray-900 mb-1">${lugar.nombre}</h2>
          <p class="text-gray-500 text-sm leading-relaxed">${lugar.descripcion}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    const mensaje = document.createElement("p");
    mensaje.className = "text-red-500 text-center mt-10 w-full";
    mensaje.textContent = `Error al cargar los lugares: ${error.message}`;
    container.appendChild(mensaje);
  }


  const botonWrapper = document.createElement("div");
  botonWrapper.className = "w-full flex justify-center mt-10";

  const botonVolver = document.createElement("button");
  botonVolver.textContent = "Volver";
  botonVolver.className =
    "bg-black text-white text-sm font-medium px-6 py-2 rounded-full shadow hover:shadow-md hover:bg-gray-900 transition-all duration-200";

  botonVolver.addEventListener("click", () => {
    history.back();
  });

  botonWrapper.appendChild(botonVolver);
  container.appendChild(botonWrapper);
});
