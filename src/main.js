import "./style.css";
import homeSection from "./sections/home.html.js";
import guideIndex from "./sections/guideIndex.html.js";

function renderMain() {
    document.querySelector("#app").innerHTML = homeSection;
    history.replaceState({}, "", "/");
    setTimeout(setupNavigation, 0);
}

function renderGuide() {
    document.querySelector("#app").innerHTML = guideIndex;
    history.replaceState({}, "", "/guide");
    // Importa y ejecuta el setup del menú lateral
    import("./sections/guideIndex.html.js").then((mod) => {
        if (mod.setupGuideMenu) mod.setupGuideMenu();
    });
    setTimeout(setupNavigation, 0);
}

// Manejo de navegación
function setupNavigation() {
    const homeLink = document.querySelector(".navbar-link[href='#home']");
    const guideLink = document.querySelector(".navbar-link[href='#guide']");
    if (homeLink) {
        homeLink.onclick = (e) => {
            e.preventDefault();
            renderMain();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }
    if (guideLink) {
        guideLink.onclick = (e) => {
            e.preventDefault();
            renderGuide();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }
}

// Render principal al cargar y enlazar navegación
renderMain();
