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

// Fonction pour afficher la bannière si le token est valide
export function showBannerIfValidToken() {
  const banner = document.getElementById("editBanner");
  const iconModify = document.querySelector(".icon-banner");
  const userToken = localStorage.getItem("token");

  // Log pour vérifier la récupération du token
  console.log("Token récupéré :", userToken);

  if (userToken) {
    // Affiche la bannière et les éléments administrateur
    if (banner) banner.style.display = "block";
    if (iconModify) iconModify.style.display = "block";
  } else {
    // Cache la bannière et les éléments administrateur
    if (banner) banner.style.display = "none";
    if (iconModify) iconModify.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  manageAuthLinks();
  showBannerIfValidToken();
});
