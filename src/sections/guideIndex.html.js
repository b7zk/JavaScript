import menuData from "../assets/json/guide-menu.json";

function renderMenu(menuArr) {
    return menuArr
        .map((item, idx) => {
            if (item.submenu) {
                // Mostrar parentModule en consola si existe
                if (item.parentModule) {
                    console.log("parentModule:", item.parentModule);
                }
                return `
          <li class="has-submenu">
            <a href="#" class="menu-main" data-idx="${idx}" data-parent-module="${
                    item.parentModule || ""
                }">${item.label}</a>
            <ul class="submenu" style="display:none;">
              ${renderMenu(item.submenu)}
            </ul>
          </li>
        `;
            } else {
                // Mostrar parentModule en consola si existe
                if (item.parentModule) {
                    console.log("parentModule:", item.parentModule);
                }
                return `<li><a href="${
                    item.anchor || "#"
                }" class="submenu-link" data-module="${
                    item.module || ""
                }" data-parent-module="${item.parentModule || ""}">${
                    item.label
                }</a></li>`;
            }
        })
        .join("");
}

const html = `
<div class="guide-index-card">
  <aside class="guide-sidebar">
    <nav>
      <ul id="guide-menu">
        ${renderMenu(menuData.menu)}
      </ul>
    </nav>
  </aside>
  <section class="guide-content">
    <h2>Guía principal</h2>
    <p>¡Bienvenido a la sección de la guía! Aquí puedes agregar el contenido de tu guía.</p>
  </section>
</div>

`;

// Mostrar/ocultar submenú dinámicamente (esto debe ejecutarse tras el render)
export function setupGuideMenu() {
    // Usar import.meta.glob para soportar rutas anidadas con Vite
    const modules = import.meta.glob("./content/**/*.html.js");
    document.querySelectorAll(".menu-main").forEach((el) => {
        el.addEventListener("click", async function (e) {
            e.preventDefault();
            const li = this.parentElement;
            const submenu = li.querySelector(".submenu");
            let pathParts = [];
            let currentLi = li;
            while (currentLi) {
                // Buscar solo el primer hijo .menu-main (no usar selector de hijo directo)
                const mainLink = currentLi.querySelector(".menu-main");
                if (mainLink) pathParts.unshift(mainLink.textContent.trim());
                currentLi = currentLi.parentElement
                    ? currentLi.parentElement.closest("li.has-submenu")
                    : null;
            }
            let folderPath = pathParts
                .map((p) =>
                    p
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                )
                .join("/");
            // Desplegar/cerrar submenú si existe
            if (submenu) {
                const isOpen = submenu.style.display === "block";
                submenu.style.display = isOpen ? "none" : "block";
                li.classList.toggle("open", !isOpen);
            }
            // Renderizar siempre el archivo correspondiente al menú principal
            const fileName = pathParts[pathParts.length - 1]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            const route = `./content/${folderPath}/${fileName}.html.js`;
            console.log("Ruta del archivo:", route);

            if (modules[route]) {
                try {
                    const mod = await modules[route]();
                    document.querySelector(".guide-content").innerHTML =
                        mod.default;
                } catch (err) {
                    document.querySelector(
                        ".guide-content"
                    ).innerHTML = `<p style=\"color:#c00\">No se pudo cargar el contenido: ${route}</p>`;
                }
            } else {
                document.querySelector(
                    ".guide-content"
                ).innerHTML = `<p style=\"color:#c00\">No se encontró el archivo: ${route}</p>`;
            }
        });
    });
    // Manejo de carga dinámica de contenido modular
    document.querySelectorAll(".submenu-link").forEach((link) => {
        link.addEventListener("click", async function (e) {
            const moduleName = this.dataset.module;

            // Mostrar parentModule en consola si existe

            // Obtener el label del padre (li.has-submenu > a.menu-main)
            let label = "";
            let parentLi = this.closest(".has-submenu");
            if (parentLi) {
                const mainLink = parentLi.querySelector(".menu-main");
                if (mainLink) label = mainLink.textContent.trim();
            } else {
                // Si no es submenú, buscar el li > a
                label = this.textContent.trim();
            }
            // Normalizar label para carpeta (puedes ajustar esto si usas números)
            const labelFolder = label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            if (moduleName) {
                e.preventDefault();
                // Separa la ruta en variables
                let partialRoute = `${labelFolder}/${moduleName}.html.js`;

                if (this.dataset.parentModule) {
                    partialRoute = `${this.dataset.parentModule}/${partialRoute}`;
                }
                try {
                    const mod = await import(
                        /*@vite-ignore*/ `./content/${partialRoute}`
                    );
                    document.querySelector(".guide-content").innerHTML =
                        mod.default;
                } catch (err) {
                    console.log(err);
                    document.querySelector(
                        ".guide-content"
                    ).innerHTML = `<p style=\"color:#c00\">No se pudo cargar el contenido: ${partialRoute}</p>`;
                }
            }
        });
    });
}

export default html;
