document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log("ID obtenido:", id);

  const container = document.getElementById("itinerary-list");

  if (!id) {
    container.innerHTML = `<p class="text-gray-600 text-center mt-10">ID de itinerario no especificado.</p>`;
    return;
  }

  try {
    console.log("Fetching datos para id:", id);
    const response = await fetch(`/php/itinerarioDetalle.php?id=${id}`);
    console.log("Response status:", response.status);

    if (!response.ok) throw new Error("Error al cargar el itinerario.");

    
    const text = await response.text();
    console.log("Respuesta cruda:", text);

    
    const lugares = JSON.parse(text);
    console.log("Lugares recibidos:", lugares);

    if (!Array.isArray(lugares) || lugares.length === 0) {
      container.innerHTML = `<p class="text-gray-600 text-center mt-10">Este itinerario no tiene lugares.</p>`;
      return;
    }

    lugares.forEach((lugar) => {
      const card = document.createElement("article");
      card.className =
        "w-full sm:w-[45%] max-w-md bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl";

      card.innerHTML = `
        <img src="${lugar.imagen}" alt="${lugar.nombre}" class="w-full h-48 object-cover"/>
        <div class="p-5">
          <h2 class="text-xl font-semibold text-gray-900 mb-1">${lugar.nombre}</h2>
          <p class="text-gray-700 text-sm mb-1"><strong>Dirección:</strong> ${lugar.direccion}</p>
          <p class="text-gray-700 text-sm mb-2"><strong>Horario:</strong> ${lugar.horario}</p>
          <p class="text-gray-500 text-sm leading-relaxed">${lugar.descripcion}</p>
        </div>
      `;

      container.appendChild(card);
    });

    
    const backWrapper = document.createElement("div");
    backWrapper.className = "w-full flex justify-center mt-10";

    const backButton = document.createElement("button");
    backButton.textContent = "Volver";
    backButton.className =
      "bg-black text-white text-sm font-medium px-6 py-2 rounded-full shadow hover:shadow-md hover:bg-gray-900 transition-all duration-200";

    backButton.addEventListener("click", () => {
      history.back();
    });

    backWrapper.appendChild(backButton);
    container.appendChild(backWrapper);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-red-600 text-center mt-10">Error al mostrar el itinerario.</p>`;
  }
});
