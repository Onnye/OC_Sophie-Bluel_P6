const hostUrl = "http://localhost:5678";

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
    // Vérifie si la réponse contient un corps avant d'essayer de le parser
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return null; // Retourne null si la réponse n'a pas de contenu JSON
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données depuis ${endpoint}:`,
      error
    );
    throw error;
  }
}
