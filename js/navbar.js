document.addEventListener("DOMContentLoaded", () => {
  let isLoggedIn = false;
  const header = document.querySelector("header");


  function createNavbarNoLogged() {
  isLoggedIn = false;
  header.innerHTML = "";

  const fragment = document.createDocumentFragment();
  const nav = document.createElement("nav");
  nav.className =
    "w-full px-4 py-4 flex items-center justify-between bg-white";


  const logoDiv = document.createElement("div");
  logoDiv.className = "flex items-center gap-6";
  logoDiv.innerHTML = `
    <a href="/" class="text-base font-bold text-black">
      <img src="../../assets/img/logo.svg" alt="Itinerum logo" class="h-10" />
    </a>`;


  const linksDiv = document.createElement("div");
  linksDiv.className = "flex items-center space-x-5";

  const subscriptionLink = document.createElement("a");
  subscriptionLink.href = "subscriptions.html";
  subscriptionLink.textContent = "Subscriptions";
  subscriptionLink.className = "text-black hover:text-gray-700 hidden md:inline";

  const loginLink = document.createElement("a");
  loginLink.href = "login.html";
  loginLink.textContent = "Log in";
  loginLink.className = "text-black hover:text-gray-700";

  const signupLink = document.createElement("a");
  signupLink.href = "signup.html";
  signupLink.textContent = "Create free account";
  signupLink.className =
    "bg-black text-white hover:bg-[hsl(0,0%,15%)] hover:text-white py-2 px-4 rounded-full";

  const button = document.createElement("button");
  button.setAttribute("aria-label", "Toggle menu");
  button.className = "text-gray-700 hover:text-black";
  button.id = "menu-toggle";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.classList.add("shrink-0");

  const title = document.createElementNS(svgNS, "title");
  title.textContent = "menu icon";
  svg.appendChild(title);

  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute("d", "M3 6.5H17");
  path1.setAttribute("stroke", "currentColor");
  path1.setAttribute("stroke-width", "2");
  path1.setAttribute("stroke-linejoin", "round");

  const path2 = document.createElementNS(svgNS, "path");
  path2.setAttribute("d", "M3 13.5H17");
  path2.setAttribute("stroke", "currentColor");
  path2.setAttribute("stroke-width", "2");
  path2.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path1);
  svg.appendChild(path2);
  button.appendChild(svg);

 
  const dropdownMenu = generarDropdown(false, {}, { loginLink, signupLink });

 
  if (window.innerWidth >= 768) {
    linksDiv.append(subscriptionLink, loginLink, signupLink, button);
  } else {
    linksDiv.append(subscriptionLink, button); 
  }

  nav.appendChild(logoDiv);
  nav.appendChild(linksDiv);
  nav.appendChild(dropdownMenu);
  fragment.appendChild(nav);
  header.appendChild(fragment);
}


  
  function createNavbarLogged(userData) {
    let isLoggedIn = true;
    
    header.innerHTML = "";

    
    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between w-full px-6 py-5 bg-white text-base";

   
    const left = document.createElement("div");
    left.className = "flex items-center gap-6";
    left.innerHTML = `
    <a href="/" class="text-base font-bold text-black">
      <img src="../../assets/img/logo.svg" alt="Itinerum logo" class="h-10" />
    </a>
  `;

   
    const center = document.createElement("div");
    center.className = "hidden md:flex items-center w-full max-w-md mx-auto";
    center.innerHTML = `
    <div class="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-base ml-16" style="width: calc(100% - 2rem)">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" class="h-4 w-4 text-gray-500">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"/>
      </svg>
      <input type="text" placeholder="Search on Web..."
        class="w-full bg-transparent text-base text-gray-600 placeholder-gray-400 outline-none" />
    </div>
  `;

    
    const right = document.createElement("div");
    right.className = "flex items-center gap-4";

    
    const btnBookmarks = document.createElement("button");
    btnBookmarks.className = "hover:opacity-70";
    btnBookmarks.title = "Bookmarks";
    btnBookmarks.setAttribute('onclick', "window.location.href='itinerarioSav.html'");
    btnBookmarks.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
      <path stroke-linecap="round" stroke-linejoin="round"
        stroke-width="2" d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"/>
    </svg>
  `;

    const dropdownMenu = generarDropdown(isLoggedIn, userData);

   
    const getPro = document.createElement("a");
    getPro.href = "subscriptions.html";
    getPro.className =
      "rounded-full bg-blue-600 px-4 py-1 text-base font-semibold text-white hover:bg-blue-700";
    getPro.textContent = "Get Pro";

    
    const avatar = document.createElement("button");
    avatar.className =
      "h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-base font-medium text-gray-700";

    const username = userData?.username || "U";
    avatar.textContent = username.charAt(0).toUpperCase();
    avatar.id = "menu-toggle";

    avatar.addEventListener("click", () => {
      if (dropdownMenu.style.display === "none") {
        dropdownMenu.style.display = "block";
      } else {
        dropdownMenu.style.display = "none";
      }
    });

    
    right.append(btnBookmarks, getPro, avatar);
    div.append(left, center, right, dropdownMenu);
    header.appendChild(div);
  }

  
  createNavbarNoLogged();

  
  fetch("/php/check_session.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        createNavbarLogged(data.user);
      }
    })
    .catch((error) => {
      console.error("Error al obtener el estado de la sesión:", error);
    });
});

generarDropdown = (isLoggedIn, userData = {}) => {
  const fragment = document.createDocumentFragment();

  const dropdownMenu = document.createElement("div");
  dropdownMenu.id = "dropdownMenu";
  dropdownMenu.className = isLoggedIn
    ? "absolute right-5 mt-[26rem] w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-3 hidden z-50"
    : "absolute right-3 mt-[16rem] w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-3 hidden z-50";

  fragment.appendChild(dropdownMenu);

  if (isLoggedIn) {
    const profile = document.createElement("div");
    profile.className = "px-4 pb-3 border-b border-gray-100";

    const profileUserName = document.createElement("div");
    profileUserName.className = "text-sm font-medium text-gray-900";
    profileUserName.textContent = userData.username;

    const profileEmail = document.createElement("div");
    profileEmail.className = "text-sm text-gray-500";
    profileEmail.textContent = userData.email;

    profile.appendChild(profileUserName);
    profile.appendChild(profileEmail);
    dropdownMenu.appendChild(profile);

    const settingsDiv = document.createElement("div");
    settingsDiv.className = "px-4 py-3 border-b border-gray-100";

    const settingsLink = document.createElement("a");
    settingsLink.href = "/settings.html";
    settingsLink.className =
      "flex items-center gap-1 px-2 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full";

    const svg = document.createElement("div");
    svg.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/>
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>
    `;

    const span = document.createElement("span");
    span.textContent = "Settings";

    settingsLink.appendChild(svg);
    settingsLink.appendChild(span);
    settingsDiv.appendChild(settingsLink);
    dropdownMenu.appendChild(settingsDiv);
  }

  
  const themeSwitchContainer = document.createElement("div");
  themeSwitchContainer.className = "px-4 py-3 border-b border-gray-100";

  const themeFlex = document.createElement("div");
  themeFlex.className = "flex items-center justify-between";

  const themeText = document.createElement("span");
  themeText.className = "text-sm font-medium text-gray-700";
  themeText.textContent = "Theme";

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className =
    "flex items-center gap-2 bg-gray-100 p-1 rounded-full";

  const createThemeButton = (title, className, svgHTML) => {
    const btn = document.createElement("button");
    btn.title = title;
    btn.className = `p-2 rounded-full ${className}`;
    btn.innerHTML = svgHTML;
    return btn;
  };

  buttonsWrapper.appendChild(
    createThemeButton(
      "Light",
      "bg-neutral-600 text-white",
      `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1m20 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z"/>
    </svg>`
    )
  );

  buttonsWrapper.appendChild(
    createThemeButton(
      "Dark",
      "text-gray-400",
      `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 1 0 21 12.79z"/>
    </svg>`
    )
  );

  buttonsWrapper.appendChild(
    createThemeButton(
      "System",
      "text-gray-400",
      `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20"/>
    </svg>`
    )
  );

  
function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === 'light') {
    root.classList.remove('dark');
  } else if (mode === 'dark') {
    root.classList.add('dark');
  } else if (mode === 'system') {
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }

  localStorage.setItem('theme', mode);
}


document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(storedTheme);
});


const themeButtons = buttonsWrapper.querySelectorAll('button');

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const title = btn.title.toLowerCase();
    applyTheme(title);

    
    themeButtons.forEach((b) =>
      b.classList.remove('bg-neutral-600', 'text-white')
    );
    btn.classList.add('bg-neutral-600', 'text-white');
  });
});


  themeFlex.appendChild(themeText);
  themeFlex.appendChild(buttonsWrapper);
  themeSwitchContainer.appendChild(themeFlex);
  dropdownMenu.appendChild(themeSwitchContainer);

  const linksContainer = document.createElement("div");
  linksContainer.className =
    "mt-2 space-y-1 px-4 pb-3 border-b border-gray-100";

  const dropdownLinks = [
    { text: "Contact", href: "mailto:contactitinerum@gmail.com" },
  ];

  dropdownLinks.forEach(({ text, href }) => {
    const a = document.createElement("a");
    a.className =
      "flex items-center justify-between gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full";
    a.href = href;

    
    const span = document.createElement("span");
    span.textContent = text;
    a.appendChild(span);

    
    const icon = document.createElement("span");
    icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
         stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 7l-10 10"/>
      <path d="M8 7l9 0l0 9"/>
    </svg>
  `;
    a.appendChild(icon);

    linksContainer.appendChild(a);
  });

  if (isLoggedIn) {
    const logout = document.createElement("div");
    logout.id = "logoutButton";
    logout.className =
      "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full cursor-pointer";

    const logoutText = document.createElement("span");
    logoutText.textContent = "Log out";

    logout.appendChild(logoutText);
    logout.addEventListener("click", async () => {
      localStorage.removeItem("user");
      try {
        await fetch("php/logout.php", { method: "POST" });
      } catch (error) {
        console.warn("Error al cerrar sesión en el servidor:", error);
      }
      window.location.href = "index.html";
    });

    linksContainer.appendChild(logout);
  }

  dropdownMenu.appendChild(linksContainer);

  const footerContainer = document.createElement("div");
  const footerFlex = document.createElement("div");
  footerFlex.className =
    "flex items-center justify-between px-4 py-2 text-gray-500 text-[11px]";

  const footerLinks = document.createElement("div");
  footerLinks.className = "flex space-x-4";

  const links = [
    { text: "Privacy", href: "privacy.html" },
    { text: "Terms", href: "terms.html" },
    { text: "Copyright", href: "copyright.html" }, 
  ];

  links.forEach(({ text, href }) => {
    const a = document.createElement("a");
    a.href = href;
    a.className = "hover:underline hover:text-black";
    a.textContent = text;
    footerLinks.appendChild(a);
  });

  const svgLink = document.createElement("a");
  svgLink.href = "https://x.com/@PlanItinerum";
  svgLink.className = "text-gray-500 hover:text-black";
  svgLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
    </svg>
  `;

  footerFlex.appendChild(footerLinks);
  footerFlex.appendChild(svgLink);
  footerContainer.appendChild(footerFlex);
  dropdownMenu.appendChild(footerContainer);

  return fragment.firstChild;
};
