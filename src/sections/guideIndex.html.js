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
    document.querySelectorAll(".menu-main").forEach((el) => {
        el.addEventListener("click", async function (e) {
            e.preventDefault();
            const li = this.parentElement;
            const submenu = li.querySelector(".submenu");
            let label = this.textContent.trim();
            let folderPath = label
                .toLowerCase()
                .replace(/[^a-z0-9\/]+/g, "-")
                .replace(/(\/-+|^-+|-+$)/g, "");
            if (submenu) {
                const isOpen = submenu.style.display === "block";
                submenu.style.display = isOpen ? "none" : "block";
                li.classList.toggle("open", !isOpen);
                // Siempre renderiza la página del menú principal al hacer click, esté abierto o cerrado
                try {
                    const mod = await import(
                        `./content/${folderPath}/${folderPath}.html.js`
                    );
                    console.log(mod);

                    document.querySelector(".guide-content").innerHTML =
                        mod.default;
                } catch (err) {
                    // No mostrar error si solo se quiere abrir/cerrar el submenú
                }
            } else {
                // Si no hay submenú, renderiza normalmente
                try {
                    const mod = await import(
                        `./content/${folderPath}/${folderPath}.html.js`
                    );
                    console.log(mod);
                    document.querySelector(".guide-content").innerHTML =
                        mod.default;
                } catch (err) {
                    // No mostrar error si solo se quiere abrir/cerrar el submenú
                }
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
