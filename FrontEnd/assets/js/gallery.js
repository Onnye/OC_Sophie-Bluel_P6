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

// Test de réussite
getWorksFromServer()
  .then((works) => console.log(works))
  .catch((err) => console.error(err));
