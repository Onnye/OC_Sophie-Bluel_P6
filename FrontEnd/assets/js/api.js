import { host } from "./config.js";

// Fonction utilitaire pour les requêtes fetch.
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
