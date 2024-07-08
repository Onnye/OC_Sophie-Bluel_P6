import { fetchApi } from "./api.js";

// Gestion des liens de connexion/déconnexion
function manageAuthLinks() {
  const authLink = document.getElementById("auth-link");
  const token = localStorage.getItem("token");

  if (token) {
    authLink.textContent = "logout";
    authLink.href = "#";
    authLink.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload(); // Recharge la page pour appliquer les changements
    });
  }
}

// Fonction pour afficher la bannière si le token est valide
function showBannerIfValidToken() {
  const banner = document.getElementById("editBanner");
  const iconModify = document.querySelector(".icon-modify");
  const filterButtons = document.getElementById("filter");
  const userToken = localStorage.getItem("token");
  const header = document.querySelector("header");

  console.log("Token récupéré :", userToken); // Log pour vérifier la récupération du token

  if (userToken) {
    // Affiche la bannière et les éléments administrateur
    if (banner) banner.style.display = "flex";
    if (iconModify) iconModify.style.display = "block";
    if (filterButtons) filterButtons.style.display = "none";
    if (header) header.style.marginTop = "90px"; // Ajuste la marge du header
  } else {
    // Cache la bannière et les éléments administrateur
    if (banner) banner.style.display = "none";
    if (iconModify) iconModify.style.display = "none";
    if (filterButtons) filterButtons.style.display = "flex";
    if (header) header.style.marginTop = "50px"; // Réinitialise la marge du header
  }
}

// Gestion du formulaire de connexion
function handleLoginFormSubmission() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      const response = await fetchApi("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        window.location.href = "../../index.html";
      } else {
        throw new Error("Erreur dans l’identifiant ou le mot de passe");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la tentative de connexion :",
        error.message
      );
      errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
      errorMessage.style.display = "block";
    }
  });
}

// Initialisation au chargement du document
document.addEventListener("DOMContentLoaded", function () {
  manageAuthLinks();
  showBannerIfValidToken();
  handleLoginFormSubmission();
});
