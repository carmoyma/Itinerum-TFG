function profileSumary(userData) {
    const section = document.createElement("section");
    section.className = "mb-8 opacity-0 transition-opacity duration-500";

    requestAnimationFrame(() => {
        section.classList.add("opacity-100");
    });

    const divAvatarWrapper = document.createElement("div");
    divAvatarWrapper.className = "mb-4";

    const divAvatar = document.createElement("div");
    divAvatar.id = "avatar";
    divAvatar.className =
        "relative w-24 h-24 rounded-full bg-gray-300 text-gray-700 text-3xl font-semibold flex items-center justify-center overflow-hidden";
    divAvatar.setAttribute("aria-label", `Avatar de ${userData.username}`);

    const pInicial = document.createElement("p");
    pInicial.textContent = userData.username.charAt(0).toUpperCase();

    divAvatar.appendChild(pInicial);
    divAvatarWrapper.appendChild(divAvatar);

    const divInfo = document.createElement("div");

    const h1Nombre = document.createElement("h1");
    h1Nombre.className = "text-2xl font-semibold";
    h1Nombre.textContent = userData.username;

    const pEmail = document.createElement("p");
    pEmail.textContent = userData.email;

    divInfo.appendChild(h1Nombre);
    divInfo.appendChild(pEmail);

    section.appendChild(divAvatarWrapper);
    section.appendChild(divInfo);

    return section;
}

function personalDetails(userData) {
    const section = document.createElement("section");
    section.className = "mb-8 opacity-0 transition-opacity duration-500";

    requestAnimationFrame(() => {
        section.classList.add("opacity-100");
    });

    const h2Titulo = document.createElement("h2");
    h2Titulo.className = "mb-4 text-2xl font-semibold";
    h2Titulo.textContent = "Personal details";
    section.appendChild(h2Titulo);

    const divContenedor = document.createElement("div");

    function createEditableBlock(labelText, valueText, fieldKey) {
        const divBloque = document.createElement("div");
        divBloque.className = "flex items-center justify-between border-b border-gray-300 pb-4 mb-4";
        divBloque.style.alignItems = "flex-start";

        const divTexto = document.createElement("div");
        divTexto.style.display = "flex";
        divTexto.style.flexDirection = "column";
        divTexto.style.flexGrow = "1";

        const h2Label = document.createElement("h2");
        h2Label.textContent = labelText;
        h2Label.className = "text-black";

        const h3Value = document.createElement("h3");
        
        h3Value.textContent = fieldKey === "password" ? "" : valueText;
        h3Value.className = "text-sm text-gray-600";

        divTexto.appendChild(h2Label);
        divTexto.appendChild(h3Value);
        divBloque.appendChild(divTexto);

        const btnEditCancel = document.createElement("button");
        btnEditCancel.className = "hover:underline text-black font-medium text-sm";
        btnEditCancel.textContent = "Edit";

        divBloque.appendChild(btnEditCancel);

        let formDiv = null;

        btnEditCancel.addEventListener("click", () => {
            if (btnEditCancel.textContent === "Edit") {
                h2Label.textContent = "Edit " + labelText;
                h3Value.textContent = fieldKey === "password" ? "Enter a new password below" : "This will be visible on your profile";
                h3Value.className = "text-xs text-gray-500 mt-1";

                if (!formDiv) {
                    formDiv = document.createElement("div");
                    formDiv.className = "transition-all duration-300 ease-in-out opacity-0 scale-95 mt-1";

                    const form = document.createElement("form");
                    form.className = "flex flex-col";

                    if (fieldKey === "password") {
                        
                        const inputsRow = document.createElement("div");
                        inputsRow.style.display = "flex";
                        inputsRow.style.gap = "0.5rem";

                        const inputNew = document.createElement("input");
                        inputNew.type = "password";
                        inputNew.placeholder = "New password";
                        inputNew.className = "bg-gray-200 rounded-xl p-2 border border-gray-300 focus:border-black focus:border-[2px] focus:outline-none text-black text-sm";
                        inputNew.style.flex = "1"; 

                        const inputConfirm = document.createElement("input");
                        inputConfirm.type = "password";
                        inputConfirm.placeholder = "Confirm password";
                        inputConfirm.className = "bg-gray-200 rounded-xl p-2 border border-gray-300 focus:border-black focus:border-[2px] focus:outline-none text-black text-sm";
                        inputConfirm.style.flex = "1";

                        inputsRow.appendChild(inputNew);
                        inputsRow.appendChild(inputConfirm);

                        const btnSubmit = document.createElement("button");
                        btnSubmit.type = "submit";
                        btnSubmit.textContent = "Save";
                        btnSubmit.className = "mt-4 bg-black text-white hover:bg-[hsl(0,0%,15%)] py-2 px-4 rounded-full self-start";

                        form.appendChild(inputsRow);
                        form.appendChild(btnSubmit);

                        form.addEventListener("submit", async (e) => {
                            e.preventDefault();

                            const newPass = inputNew.value.trim();
                            const confirmPass = inputConfirm.value.trim();

                            if (!newPass || !confirmPass) {
                                alert("Please fill in both fields.");
                                return;
                            }

                            if (newPass.length < 8) {
                                alert("Password must be at least 8 characters.");
                                return;
                            }

                            if (newPass !== confirmPass) {
                                alert("Passwords do not match.");
                                return;
                            }

                            try {
                                const response = await fetch("/php/update_user.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ field: fieldKey, value: newPass }),
                                });

                                const result = await response.json();

                                if (result.success) {
                                    location.reload();
                                } else {
                                    alert("Error updating password: " + (result.message || "Unknown error"));
                                }
                            } catch (error) {
                                alert("Network or server error: " + error.message);
                            }
                        });
                    } else {
                        const input = document.createElement("input");
                        input.type = "text";
                        input.value = valueText;
                        input.className = "bg-gray-200 rounded-xl p-2 border border-gray-300 focus:border-black focus:border-[2px] focus:outline-none text-black text-sm w-full";

                        const btnSubmit = document.createElement("button");
                        btnSubmit.type = "submit";
                        btnSubmit.textContent = "Save";
                        btnSubmit.className = "mt-4 bg-black text-white hover:bg-[hsl(0,0%,15%)] py-2 px-4 rounded-full self-start";

                        form.appendChild(input);
                        form.appendChild(btnSubmit);

                        form.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            if (!input.value.trim()) return;

                            try {
                                const response = await fetch("/php/update_user.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ field: fieldKey, value: input.value.trim() }),
                                });

                                const result = await response.json();

                                if (result.success) {
                                    location.reload();
                                } else {
                                    alert("Error updating data: " + (result.message || "Unknown error"));
                                }
                            } catch (error) {
                                alert("Network or server error: " + error.message);
                            }
                        });
                    }

                    formDiv.appendChild(form);
                    divTexto.appendChild(formDiv);

                    requestAnimationFrame(() => {
                        formDiv.classList.remove("opacity-0", "scale-95");
                        formDiv.classList.add("opacity-100", "scale-100");
                    });
                }

                btnEditCancel.textContent = "Cancel";
            } else {
                if (formDiv) {
                    formDiv.classList.remove("opacity-100", "scale-100");
                    formDiv.classList.add("opacity-0", "scale-95");

                    setTimeout(() => {
                        formDiv.remove();
                        formDiv = null;
                    }, 300);
                }

                h3Value.textContent = fieldKey === "password" ? "" : valueText;
                h3Value.className = "text-sm text-gray-600";
                h2Label.textContent = labelText;
                btnEditCancel.textContent = "Edit";
            }
        });

        return divBloque;
    }

    const divNombre = createEditableBlock("Name", userData.username, "username");
    const divEmail = createEditableBlock("Email address", userData.email, "email");
    const divPassword = createEditableBlock("Password", "", "password");

    divContenedor.appendChild(divNombre);
    divContenedor.appendChild(divEmail);
    divContenedor.appendChild(divPassword);

    section.appendChild(divContenedor);

    return section;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/php/check_session.php")
        .then((response) => response.json())
        .then((data) => {
            if (data.loggedIn) {
                const main = document.getElementById("main-content");
                const manageAccount = document.getElementById("manage-account");

                if (!main) {
                    console.error("No se encontró el elemento <main> con id 'main-content'");
                    return;
                }

                const user = data.user;

                const resumenPerfil = profileSumary(user);
                const detalles = personalDetails(user);

                if (manageAccount) {
                    main.insertBefore(resumenPerfil, manageAccount);
                    main.insertBefore(detalles, manageAccount);
                } else {
                    main.appendChild(resumenPerfil);
                    main.appendChild(detalles);
                }
            } else {
                console.log("Usuario no logueado");
            }
        })
        .catch((error) => {
            console.error("Error al obtener el estado de la sesión:", error);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openDeleteModal");
    const modal = document.getElementById("deleteModal");
    const modalContent = document.getElementById("deleteModalContent");
    const cancelBtn = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    if (openBtn && modal && cancelBtn && modalContent) {
        openBtn.addEventListener("click", () => {
            modal.classList.remove("hidden");
            setTimeout(() => {
                modalContent.classList.remove("scale-95", "opacity-0");
                modalContent.classList.add("scale-100", "opacity-100");
            }, 10);
        });

        cancelBtn.addEventListener("click", () => {
            modalContent.classList.remove("scale-100", "opacity-100");
            modalContent.classList.add("scale-95", "opacity-0");
            setTimeout(() => {
                modal.classList.add("hidden");
            }, 300);
        });

        confirmDelete.addEventListener("click", async () => {
            try {
                const response = await fetch('/php/eliminar.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ delete: true })
                });

                const result = await response.json();

                if (result.success) {
                    window.location.href = 'bye.html';
                } else {
                    alert("Error: " + result.message);
                }
            } catch (err) {
                console.error(err);
                alert("Error deleting account.");
            }
        });
    }
});
