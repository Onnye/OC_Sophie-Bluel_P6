import { fetchData } from "./api.js";
import { getWorksFromServer, addWorksToDom } from "./work.js";

// Récupère les catégories depuis l'API
export async function getCategoriesFromServer() {
  return await fetchData("/api/categories");
}

// Fonction pour créer un bouton de filtre
function createFilterButton(category, works, filterContainer) {
  const button = document.createElement("button");

  if (category) {
    button.textContent = category.name;
    button.dataset.categoryId = category.id;
  } else {
    button.textContent = "Tous";
  }

  button.addEventListener("click", function () {
    if (category) {
      filterWorksByCategory(works, category.id);
    } else {
      filterWorksByCategory(works, null);
    }
    setActiveFilter(button);
  });

  filterContainer.appendChild(button);
}

// Crée les boutons de filtre de catégorie
export async function createCategoryFilters(works) {
  try {
    const categories = await getCategoriesFromServer();
    const filterContainer = document.getElementById("filter");
    if (!filterContainer) {
      console.error("Le conteneur de filtres n'a pas été trouvé dans le DOM.");
      return;
    }
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
      "Une erreur s'est produite lors de la création des filtres de catégorie :",
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

// Filtre les travaux par catégorie
async function filterWorksByCategory(works, categoryId) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("La galerie n'a pas été trouvée dans le DOM.");
    return;
  }

  // Vide la galerie
  gallery.innerHTML = "";

  let filteredWorks;
  if (categoryId) {
    filteredWorks = works.filter(function (work) {
      return work.categoryId === categoryId;
    });
  } else {
    filteredWorks = works;
  }

  await addWorksToDom(document, ".gallery", filteredWorks);
}

// Initialisation de l'application
async function initializeApp() {
  try {
    const works = await getWorksFromServer();
    await addWorksToDom(document, ".gallery", works);
    await createCategoryFilters(works);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'initialisation de l'application :",
      error
    );
  }
}

// Appeler la fonction d'initialisation lors du chargement du DOM
document.addEventListener("DOMContentLoaded", initializeApp);
