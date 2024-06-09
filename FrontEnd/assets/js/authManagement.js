import { fetchApi } from "./api.js";

// Gestion des liens de connexion/déconnexion
export function manageAuthLinks() {
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
export function showBannerIfValidToken() {
  const banner = document.getElementById("editBanner");
  const iconModify = document.querySelector(".icon-modify");
  const filterButtons = document.getElementById("filter");
  const userToken = localStorage.getItem("token");

  console.log("Token récupéré :", userToken); // Log pour vérifier la récupération du token

  if (userToken) {
    // Affiche la bannière et les éléments administrateur
    if (banner) banner.style.display = "block";
    if (iconModify) iconModify.style.display = "block";
    if (filterButtons) filterButtons.style.display = "none";
  } else {
    // Cache la bannière et les éléments administrateur
    if (banner) banner.style.display = "none";
    if (iconModify) iconModify.style.display = "none";
    if (filterButtons) filterButtons.style.display = "flex";
  }
}

// Gestion du formulaire de connexion
function handleLoginFormSubmission() {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("error-message");

      fetchApi("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then(function (response) {
          if (response && response.token) {
            localStorage.setItem("token", response.token);
            window.location.href = "../../index.html";
          } else {
            errorMessage.textContent =
              "Erreur dans l’identifiant ou le mot de passe";
            errorMessage.style.display = "block";
          }
        })
        .catch(function (error) {
          console.error(
            "Erreur lors de la tentative de connexion :",
            error.message
          );
          errorMessage.textContent =
            "Erreur dans l’identifiant ou le mot de passe";
          errorMessage.style.display = "block";
        });
    });
  }
}

// Initialisation au chargement du document
document.addEventListener("DOMContentLoaded", function () {
  manageAuthLinks();
  showBannerIfValidToken();
  handleLoginFormSubmission();
});
