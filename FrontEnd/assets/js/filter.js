import { fetchData } from "./utils.js";
import { getWorksFromServer, createWorkFigure } from "./gallery.js";

// Récupère les catégories depuis l'API
export async function getCategoriesFromServer() {
  return await fetchData("/api/categories");
}

// Crée les boutons de filtre de catégorie
export async function createCategoryFilters() {
  try {
    const categories = await getCategoriesFromServer();
    const filterContainer = document.getElementById("filter");
    if (!filterContainer) {
      console.error("Le conteneur de filtres n'a pas été trouvé dans le DOM.");
      return;
    }

    // Ajoute un bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    filterContainer.appendChild(allButton);

    // Crée un bouton pour chaque catégorie
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      filterContainer.appendChild(button);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création des filtres de catégorie :",
      error
    );
  }
}

// Appeler la fonction pour créer les filtres lors du chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  createCategoryFilters();
});
