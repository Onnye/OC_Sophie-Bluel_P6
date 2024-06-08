import { fetchApi } from "./api.js";

// Gestion des liens de connexion/déconnexion
export function manageAuthLinks() {
  const authLink = document.getElementById("auth-link");
  const token = localStorage.getItem("token");

  if (token) {
    authLink.textContent = "logout";
    authLink.href = "#";
    authLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload(); // Recharge la page pour appliquer les changements
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  manageAuthLinks();
});
