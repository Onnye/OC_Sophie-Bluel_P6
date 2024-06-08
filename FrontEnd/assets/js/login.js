import { fetchApi } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", async function (event) {
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

        if (response.token) {
          localStorage.setItem("token", response.token);
          window.location.href = "../../index.html";
        } else {
          // Affiche un message d'erreur si le token n'est pas présent
          errorMessage.textContent = "Identifiant ou mot de passe incorrect.";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        // Gestion des erreurs génériques
        console.error("Erreur lors de la tentative de connexion", error);
        errorMessage.textContent =
          "Erreur dans l’identifiant ou le mot de passe";
        errorMessage.style.display = "block";
      }
    });
  }
});
