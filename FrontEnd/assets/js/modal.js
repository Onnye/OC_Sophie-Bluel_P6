import { fetchApi } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const btn = document.querySelector(".js-modal-trigger");
  const span = document.getElementsByClassName("close-icon")[0];

  // Ouvre la modale
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // Ferme la modale
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Ferme la modale si l'utilisateur clique en dehors de la modale
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
