const hostUrl = `${window.location.protocol}//${window.location.hostname}:5678`;

// Fonction utilitaire pour les requêtes fetch
export async function fetchApi(endpoint, options = {}) {
  const url = `${hostUrl}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `La requête a échoué avec le statut : ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données depuis ${endpoint}:`,
      error
    );
    throw error;
  }
}
