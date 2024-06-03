import { host } from "./config.js";

//Fonction utilitaire pour les requêtes fetch.
export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${host}${endpoint}`);
    if (!response.ok) {
      throw new Error(
        `La requête a échoué avec le statut : ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données depuis ${endpoint}:`,
      error
    );
    throw error;
  }
}

//Récupère les travaux depuis l'API
export const getWorksFromServer = () => fetchData("/api/works");

//Créer un élément figure pour un projet
function createWorkFigure(work) {
  const figure = document.createElement("figure");
  figure.id = `figure-${work.id}`;
  figure.dataset.categoryId = work.categoryId;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

//Ajoute les travaux au DOM
export async function addWorksToDom(documentRoot, selector) {
  const gallery = documentRoot.querySelector(selector);
  if (!gallery) {
    console.error(
      `Le sélecteur ${selector} n'a pas trouvé d'élément dans le DOM.`
    );
    return;
  }

  try {
    const works = await getWorksFromServer();
    const fragment = document.createDocumentFragment();
    works.forEach((work) => {
      const figure = createWorkFigure(work);
      fragment.appendChild(figure);
    });
    gallery.appendChild(fragment);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'affichage des travaux : ",
      error
    );
  }
}

// Affiche tous les travaux au chargement initial et logue le résultat
document.addEventListener("DOMContentLoaded", () => {
  addWorksToDom(document, ".gallery")
    .then(() => {
      console.log(document.querySelector(".gallery").innerHTML);
    })
    .catch((err) => console.error(err));
});
