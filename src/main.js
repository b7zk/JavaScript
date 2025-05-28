import "./style.css";

import mainSection from "./sections/main.html.js";
document.querySelector("#app").innerHTML = mainSection;

setupCounter(document.querySelector("#counter"));
