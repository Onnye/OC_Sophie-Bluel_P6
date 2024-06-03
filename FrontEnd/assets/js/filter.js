import { fetchData } from "./gallery.js";
import { host } from "./config.js";

// Récupère les catégories depuis l'API
export async function getCategoriesFromServer() {
  return await fetchData("/api/categories");
}

// Test - affiche les catégories dans la console
export async function displayCategories() {
  try {
    const categories = await getCategoriesFromServer();
    console.log("Catégories récupérées:", categories);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des catégories :",
      error
    );
  }
}

// Appeler la fonction pour afficher les catégories lors du chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
});
