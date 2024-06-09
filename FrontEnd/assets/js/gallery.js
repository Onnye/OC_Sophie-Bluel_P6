import { fetchApi } from "./api.js";

// Récupère les travaux depuis l'API
export function getWorksFromServer() {
  return fetchApi("/api/works");
}

function createWorkFigure(work) {
  var figure = document.createElement("figure");
  figure.id = "figure-" + work.id;
  figure.dataset.categoryId = work.categoryId;
  var img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  var figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

// Ajoute les travaux au DOM
export async function addWorksToDom(selector, works) {
  var gallery = document.querySelector(selector);
  if (!gallery) {
    console.error(
      "Le sélecteur " + selector + " n'a pas trouvé d'élément dans le DOM."
    );
    return;
  }

  gallery.innerHTML = "";
  var fragment = document.createDocumentFragment();
  works.forEach(function (work) {
    var figure = createWorkFigure(work);
    fragment.appendChild(figure);
  });
  gallery.appendChild(fragment);
}

async function loadContent() {
  try {
    var works = await getWorksFromServer();
    await addWorksToDom(".gallery", works);
    await createCategoryFilters(works);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application :", error);
  }
}

async function createCategoryFilters(works) {
  var categories = await fetchApi("/api/categories");
  var filterContainer = document.getElementById("filter");
  if (!filterContainer) {
    console.error("Le conteneur de filtres n'a pas été trouvé dans le DOM.");
    return;
  }
  filterContainer.innerHTML = "";
  // Ajoute un bouton "Tous"
  createFilterButton(null, works, filterContainer);
  // Crée un bouton pour chaque catégorie
  categories.forEach(function (category) {
    createFilterButton(category, works, filterContainer);
  });
  // Définit le bouton "Tous" comme actif par défaut
  var allButton = filterContainer.querySelector("button");
  // Afficher tous les projets par défaut
  setActiveFilter(allButton);
  filterWorksByCategory(works, null);
}

// Définit le bouton de filtre actif
function setActiveFilter(activeButton) {
  var buttons = document.querySelectorAll("#filter button");
  buttons.forEach(function (button) {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

function createFilterButton(category, works, container) {
  var button = document.createElement("button");
  if (category) {
    button.textContent = category.name;
  } else {
    button.textContent = "Tous";
  }
  button.addEventListener("click", function () {
    filterWorksByCategory(works, category ? category.id : null);
    setActiveFilter(button);
  });
  container.appendChild(button);
}

async function filterWorksByCategory(works, categoryId) {
  var filteredWorks;
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
