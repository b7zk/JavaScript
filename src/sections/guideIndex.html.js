import menuData from "../assets/json/guide-menu.json";

function renderMenu(menuArr) {
    return menuArr
        .map((item, idx) => {
            if (item.submenu) {
                return `
          <li class="has-submenu">
            <a href="#" class="menu-main" data-idx="${idx}">${item.label}</a>
            <ul class="submenu" style="display:none;">
              ${renderMenu(item.submenu)}
            </ul>
          </li>
        `;
            } else {
                return `<li><a href="${
                    item.anchor || "#"
                }" class="submenu-link" data-module="${item.module || ""}">${
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
        el.addEventListener("click", function (e) {
            e.preventDefault();
            const li = this.parentElement;
            const submenu = li.querySelector(".submenu");
            if (submenu) {
                const isOpen = submenu.style.display === "block";
                submenu.style.display = isOpen ? "none" : "block";
                li.classList.toggle("open", !isOpen);
            }
        });
    });
    // Manejo de carga dinámica de contenido modular
    document.querySelectorAll(".submenu-link").forEach((link) => {
        link.addEventListener("click", async function (e) {
            const moduleName = this.dataset.module;
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
                try {
                    const mod = await import(
                        `./content/${labelFolder}/${moduleName}.html.js`
                    );
                    document.querySelector(".guide-content").innerHTML =
                        mod.default;
                } catch (err) {
                    document.querySelector(
                        ".guide-content"
                    ).innerHTML = `<p style="color:#c00">No se pudo cargar el contenido: ${labelFolder}/${moduleName}</p>`;
                }
            }
        });
    });
}

export default html;
