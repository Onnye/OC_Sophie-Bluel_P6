import { host } from "./config.js";

//Fonction utilitaire pour les requêtes fetch.
async function fetchData(endpoint) {
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

// Test
const testWork = {
  id: 1,
  imageUrl: "test.jpg",
  title: "Test Work",
  categoryId: 2,
};
console.log(createWorkFigure(testWork));
