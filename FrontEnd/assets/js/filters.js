import { fetchApi } from "./api.js";
import { getWorksFromServer, addWorksToDom } from "./work.js";

async function loadContent() {
  try {
    const works = await getWorksFromServer();
    await addWorksToDom(".gallery", works);
    await createCategoryFilters(works);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application :", error);
  }
}

async function createCategoryFilters(works) {
  try {
    const categories = await fetchApi("/api/categories");
    const filterContainer = document.getElementById("filter");
    if (!filterContainer) {
      console.error("Le conteneur de filtres n'a pas été trouvé dans le DOM.");
      return;
    }
    filterContainer.innerHTML = ""; // Clear existing filters
    // Ajoute un bouton "Tous"
    createFilterButton(null, works, filterContainer);
    // Crée un bouton pour chaque catégorie
    categories.forEach(function (category) {
      createFilterButton(category, works, filterContainer);
    });
    // Définir le bouton "Tous" comme actif par défaut
    const allButton = filterContainer.querySelector("button");
    setActiveFilter(allButton);
    // Afficher tous les projets par défaut
    filterWorksByCategory(works, null);
  } catch (error) {
    console.error(
      "Erreur lors de la création des filtres de catégorie :",
      error
    );
  }
}

// Définit le bouton de filtre actif
function setActiveFilter(activeButton) {
  const buttons = document.querySelectorAll("#filter button");
  buttons.forEach(function (button) {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

function createFilterButton(category, works, container) {
  const button = document.createElement("button");
  if (category) {
    button.textContent = category.name;
  } else {
    button.textContent = "Tous";
  }
  button.addEventListener("click", () => {
    if (category) {
      filterWorksByCategory(works, category.id);
    } else {
      filterWorksByCategory(works, null);
    }
    setActiveFilter(button);
  });
  container.appendChild(button);
}

async function filterWorksByCategory(works, categoryId) {
  let filteredWorks;
  if (categoryId) {
    filteredWorks = works.filter(function (work) {
      return work.categoryId === categoryId;
    });
  } else {
    filteredWorks = works;
  }
  await addWorksToDom(".gallery", filteredWorks);
}

document.addEventListener("DOMContentLoaded", loadContent);
