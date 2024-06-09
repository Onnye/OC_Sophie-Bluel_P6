import { fetchApi } from "./api.js";

// RÉCUPERATION TOKEN UTILISATEUR
function getUserToken() {
  return localStorage.getItem("token");
}

// URL de l'API pour récupérer les projets
const workApi = "http://localhost:5678/api/works";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalButtons = document.querySelectorAll("[id$='OpenModal']"); // Sélectionne tous les éléments avec 'OpenModal'
  const closeModalIcon = document.querySelector(".close-icon");
  const addPhotoBtn = document.getElementById("add-photo-btn");

  // Ouvre la modale
  openModalButtons.forEach((button) => {
    button.onclick = function () {
      modal.style.display = "block";
    };
  });

  // Ferme la modale
  closeModalIcon.onclick = function () {
    modal.style.display = "none";
  };

  // Ferme la modale si l'utilisateur clique en dehors de la modale
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

// Fonction permettant de générer des projets dans la fenêtre modale
async function generateProjectsInModal(workApi) {
  try {
    const response = await fetch(workApi);
    const data = await response.json();
    const modalGallery = document.getElementById("modal-gallery");

    modalGallery.innerHTML = ""; // Retire les textes liés aux images
    data.forEach((project) => {
      // Génère les images des projets dans la modale
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");
      const imageElement = document.createElement("img");
      imageElement.src = project.imageUrl;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa", "fa-light", "fa-trash-can", "delete-icon");
      deleteIcon.id = `delete-icon-${project.id}`;

      deleteIcon.addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
          deleteProject(project.id);
          modalGallery.removeChild(imageContainer);
        }
      });

      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteIcon);
      modalGallery.appendChild(imageContainer);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}
generateProjectsInModal(workApi);
