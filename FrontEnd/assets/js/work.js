import { fetchData } from "./api.js";

// Récupère les travaux depuis l'API
export const getWorksFromServer = () => fetchData("/api/works");

// Créer un élément figure pour un projet
export function createWorkFigure(work) {
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

// Ajoute les travaux au DOM
export async function addWorksToDom(documentRoot, selector, works) {
  const gallery = documentRoot.querySelector(selector);
  if (!gallery) {
    console.error(
      `Le sélecteur ${selector} n'a pas trouvé d'élément dans le DOM.`
    );
    return;
  }

  const fragment = document.createDocumentFragment();
  works.forEach((work) => {
    const figure = createWorkFigure(work);
    fragment.appendChild(figure);
  });
  gallery.appendChild(fragment);
}
