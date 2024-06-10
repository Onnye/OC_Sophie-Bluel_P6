import { fetchApi } from "./api.js";

// Récupération du token utilisateur depuis le stockage local
function getUserToken() {
  return localStorage.getItem("token");
}

// URL de l'API pour récupérer les projets
const apiBaseUrl = "http://localhost:5678/api/works";

// Fonction pour ouvrir la modale
function openModal() {
  document.getElementById("modal").style.display = "block";
}

// Fonction pour fermer la modale
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Fonction pour basculer entre les vues de la galerie et de l'ajout de photo
function switchModalView(showGallery) {
  const galleryView = document.getElementById("modal-view-gallery");
  const addPhotoView = document.getElementById("modal-view-add-photo");

  if (showGallery) {
    galleryView.style.display = "block";
    addPhotoView.style.display = "none";
  } else {
    galleryView.style.display = "none";
    addPhotoView.style.display = "block";
  }
}

// Fonction pour gérer la prévisualisation de l'image
function displayImagePreview(file) {
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const previewImage = document.createElement("img");
      previewImage.alt = "Image Preview";
      previewImage.src = event.target.result;
      document
        .getElementById("add-photo-input")
        .insertAdjacentElement("afterend", previewImage);
    };
    reader.readAsDataURL(file);
  }
}

// Fonction pour générer les projets dans la modale
async function loadProjectsIntoModal() {
  try {
    const projects = await fetchApi("/api/works");
    const modalGallery = document.getElementById("modal-gallery");
    modalGallery.innerHTML = "";

    projects.forEach(function (project) {
      const projectContainer = document.createElement("div");
      projectContainer.classList.add("image-container");

      const projectImage = document.createElement("img");
      projectImage.src = project.imageUrl;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa", "fa-light", "fa-trash-can", "delete-icon");
      deleteIcon.id = "delete-icon-" + project.id;
      deleteIcon.addEventListener("click", function () {
        if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
          deleteProject(project.id);
          modalGallery.removeChild(projectContainer);
        }
      });

      projectContainer.appendChild(projectImage);
      projectContainer.appendChild(deleteIcon);
      modalGallery.appendChild(projectContainer);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

// Fonction pour supprimer un projet du DOM et du serveur
async function deleteProject(projectId) {
  const userToken = getUserToken();
  if (!userToken) {
    console.error("Token d'utilisateur introuvable");
    return;
  }
  try {
    const response = await fetch(`${apiBaseUrl}/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status === 204) {
      console.log("Succès : Le projet a été supprimé.");
      const projectElement = document.getElementById(`figure-${projectId}`);
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

// Fonction pour récupérer les catégories via l'API
async function loadCategories() {
  const categorySelect = document.getElementById("category");
  try {
    const categories = await fetchApi("/api/categories");
    categories.forEach(function (category) {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const openModalButtons = document.querySelectorAll("[id$='OpenModal']");
  const closeModalIcon = document.querySelector(".close-icon");
  const addPhotoButton = document.getElementById("add-photo-btn");
  const backToGalleryButton = document.getElementById("back-to-gallery");
  const fileInput = document.getElementById("add-photo-input");

  openModalButtons.forEach(function (button) {
    button.onclick = openModal;
  });

  closeModalIcon.onclick = closeModal;

  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  addPhotoButton.onclick = function () {
    switchModalView(false);
  };

  backToGalleryButton.onclick = function () {
    switchModalView(true);
  };

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    displayImagePreview(file);
    document
      .getElementById("file")
      .querySelector(".custom-button").style.display = "none";
  });

  loadCategories();
  loadProjectsIntoModal();
});
