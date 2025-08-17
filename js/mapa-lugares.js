window.onload = () => {
    const lugares = [];
    const cardsContainer = document.getElementById("cards-container");
    const filterButtonsContainer = document.getElementById("filter-buttons");
    const btnGenerar = document.getElementById("btn-generar");
    const marcadores = {};
    const seleccionados = new Set();
    let usuarioLogueado = false;
    let lugaresCargados = false;

    
    function actualizarBotonGenerar() {
        const count = seleccionados.size;
        const badge = document.getElementById("contador-generar");

        if (usuarioLogueado && count > 0 && lugaresCargados) {
            btnGenerar.style.display = "inline-flex";
            badge.textContent = count;
        } else {
            btnGenerar.style.display = "none";
        }
    }

    
    function crearCard(lugar) {
        const card = document.createElement("div");
        card.className =
            "border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition p-3 cursor-pointer mt-4";
        card.dataset.tipo = lugar.tipo;
        card.dataset.id = lugar.id;

        card.innerHTML = `
      <img src="${lugar.imagen}" alt="${lugar.nombre}" class="w-full h-32 object-cover rounded-t-lg rounded--lg block" />
      <h3 class="text-sm font-semibold text-gray-800">${lugar.nombre}</h3>
    `;

        card.addEventListener("mouseenter", () => {
            const marker = marcadores[lugar.id];
            if (marker) {
                marker.setIcon({
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new google.maps.Size(40, 40),
                });
                map.panTo(marker.getPosition());
            }
        });

        card.addEventListener("mouseleave", () => {
            const marker = marcadores[lugar.id];
            if (marker) {
                marker.setIcon(null);
            }
        });

        card.addEventListener("click", () => {
            if (seleccionados.has(lugar.id)) {
                seleccionados.delete(lugar.id);
                card.classList.remove("ring-4", "ring-green-400", "ring-opacity-50");
            } else {
                seleccionados.add(lugar.id);
                card.classList.add("ring-4", "ring-green-400", "ring-opacity-50");
            }
            actualizarBotonGenerar();
        });

        return card;
    }

    
    function mostrarCards(filter = "todos") {
        cardsContainer.innerHTML = "";
        const lugaresFiltrados =
            filter === "todos"
                ? lugares
                : lugares.filter((lugar) => lugar.tipo === filter);

        lugaresFiltrados.forEach((lugar) => {
            const card = crearCard(lugar);
            if (seleccionados.has(lugar.id)) {
                card.classList.add("ring-4", "ring-blue-400", "ring-opacity-50");
            }
            cardsContainer.appendChild(card);
        });

        Object.entries(marcadores).forEach(([id, marker]) => {
            const lugar = lugares.find((l) => l.id === id);
            if (filter === "todos" || (lugar && lugar.tipo === filter)) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });
    }

    
    function crearFiltros(tipos) {
        filterButtonsContainer.innerHTML = "";

        tipos.forEach((tipo) => {
            const btn = document.createElement("button");
            btn.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            btn.className =
                "px-3 py-1 rounded-full border border-gray-300 text-gray-600 text-sm font-medium cursor-pointer select-none transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-800";

            if (tipo === "todos") {
                btn.classList.add("bg-gray-200", "text-gray-800", "border-gray-400");
            }

            btn.addEventListener("click", () => {
                filterButtonsContainer.querySelectorAll("button").forEach((b) => {
                    b.classList.remove("bg-gray-200", "text-gray-800", "border-gray-400");
                });
                btn.classList.add("bg-gray-200", "text-gray-800", "border-gray-400");
                mostrarCards(tipo);
            });

            filterButtonsContainer.appendChild(btn);
        });
    }

   
    let map;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 36.7202, lng: -4.4203 },
            zoom: 13,
            streetViewControl: false,
            mapTypeControl: false,
        });

        lugares.forEach((lugar) => {
            const marker = new google.maps.Marker({
                position: { lat: parseFloat(lugar.lat), lng: parseFloat(lugar.lng) },
                map: map,
                title: lugar.nombre,
            });
            marcadores[lugar.id] = marker;
        });
    }

    window.initMap = initMap;


    fetch("/php/check_session.php")
        .then((res) => res.json())
        .then((data) => {
            usuarioLogueado = data.loggedIn;
            if (lugaresCargados) actualizarBotonGenerar();
        })
        .catch((err) => {
            console.error("Error al comprobar sesión:", err);
            usuarioLogueado = false;
            btnGenerar.style.display = "none";
        });


    fetch("/php/lugares.php")
        .then((res) => res.json())
        .then((data) => {
            lugares.push(...data);
            lugaresCargados = true;

            const tiposUnicos = Array.from(new Set(lugares.map((lugar) => lugar.tipo)));
            tiposUnicos.unshift("todos");

            crearFiltros(tiposUnicos);
            mostrarCards();
            initMap();

            if (usuarioLogueado) actualizarBotonGenerar();
        })
        .catch((err) => {
            console.error("Error cargando los lugares:", err);
            alert("No se pudieron cargar los lugares.");
        });


    btnGenerar.addEventListener("click", () => {
        const ids = Array.from(seleccionados);

        fetch("/php/procesar_itinerario.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lugares_seleccionados: ids }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const texto = await response.text();
                    throw new Error(`Error ${response.status}: ${texto}`);
                }
                return response.json();
            })
            .then((data) => {

                sessionStorage.setItem("ultimoItinerarioId", data.id_itinerario);
                window.location.href = "itinerario.html";
            })
            .catch((err) => {
                console.error("Error enviando los datos:", err);
                alert("Hubo un error al enviar los datos.");
            });
    });
};
