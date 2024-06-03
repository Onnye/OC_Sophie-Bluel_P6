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
    allButton.addEventListener("click", () => {
      filterWorksByCategory(null);
      setActiveFilter(allButton);
    });
    filterContainer.appendChild(allButton);

    // Crée un bouton pour chaque catégorie
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      button.addEventListener("click", () => {
        filterWorksByCategory(category.id);
        setActiveFilter(button);
      });
      filterContainer.appendChild(button);
    });

    // Définir le bouton "Tous" comme actif par défaut
    setActiveFilter(allButton);
    // Afficher tous les projets par défaut
    filterWorksByCategory(null);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création des filtres de catégorie :",
      error
    );
  }
}

// Définit le bouton de filtre actif
function setActiveFilter(activeButton) {
  const buttons = document.querySelectorAll("#filter button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

// Filtre les travaux par catégorie
async function filterWorksByCategory(categoryId) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("La galerie n'a pas été trouvée dans le DOM.");
    return;
  }

  // Vide la galerie
  gallery.innerHTML = "";

  try {
    const works = await getWorksFromServer();
    const filteredWorks = categoryId
      ? works.filter((work) => work.categoryId === categoryId)
      : works;
    const fragment = document.createDocumentFragment();
    filteredWorks.forEach((work) => {
      const figure = createWorkFigure(work);
      fragment.appendChild(figure);
    });
    gallery.appendChild(fragment);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du filtrage des travaux :",
      error
    );
  }
}

// Appeler la fonction pour créer les filtres lors du chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  createCategoryFilters();
});
