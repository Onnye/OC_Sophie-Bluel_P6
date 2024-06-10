import { fetchApi } from "./api.js";

// RÉCUPERATION TOKEN UTILISATEUR
function getUserToken() {
  return localStorage.getItem("token");
}

// URL de l'API pour récupérer les projets
const workApi = "http://localhost:5678/api/works";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalButtons = document.querySelectorAll("[id$='OpenModal']"); // Sélectionne tous les éléments se terminant par 'OpenModal'
  const closeModalIcon = document.querySelector(".close-icon");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const backToGalleryBtn = document.getElementById("back-to-gallery");
  const modalViewGallery = document.getElementById("modal-view-gallery");
  const modalViewAddPhoto = document.getElementById("modal-view-add-photo");

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

  // Change vers la vue Ajout de Photo
  addPhotoBtn.onclick = function () {
    modalViewGallery.style.display = "none";
    modalViewAddPhoto.style.display = "block";
  };

  // Retour à la vue Galerie
  backToGalleryBtn.onclick = function () {
    modalViewAddPhoto.style.display = "none";
    modalViewGallery.style.display = "block";
  };
});

// Fonction pour générer les projets dans la modale
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

// Fonction pour supprimer un projet du DOM et du serveur
async function deleteProject(itemId) {
  const userToken = getUserToken();
  if (!userToken) {
    console.error("Token d'utilisateur introuvable");
    return;
  }
  try {
    const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
    });
    if (response.status === 204) {
      console.log("Succès : Le projet a été supprimé.");
      // Supprimer l'élément du DOM
      const projectElement = document.getElementById(`figure-${itemId}`);
      if (projectElement) {
        projectElement.parentNode.removeChild(projectElement);
      }
    } else {
      console.error("Erreur : Échec de la suppression du projet.");
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
}
