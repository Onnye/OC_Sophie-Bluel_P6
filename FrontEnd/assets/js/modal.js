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

// Fonction pour réinitialiser les champs de la modale d'ajout de photo
function resetAddPhotoModal() {
  document.getElementById("title").value = "";
  document.getElementById("category").value = "";
  document.getElementById("add-photo-input").value = "";
  document.getElementById("valid").disabled = true;
  document.getElementById("valid").style.backgroundColor = "";

  // Supprimer l'image de prévisualisation si elle existe
  const previewImage = document.querySelector("#add-photo-input + img");
  if (previewImage) {
    previewImage.remove();
  }

  // Réafficher le bouton personnalisé pour le fichier
  document
    .getElementById("file")
    .querySelector(".custom-button").style.display = "block";
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

// Fonction de validation du formulaire et mise à jour de l'état du bouton de soumission
function validateForm() {
  const title = document.getElementById("title").value;
  const categoryId = document.getElementById("category").value;
  const imageInput = document.getElementById("add-photo-input").files[0];
  const submitButton = document.getElementById("valid");

  if (title && categoryId && imageInput) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#1d6154";
  } else {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "";
  }
}

// Fonction pour ajouter une nouvelle image
async function addNewImage() {
  const submitButton = document.getElementById("valid");

  // événement de clic au bouton de validation
  submitButton.addEventListener("click", async function (event) {
    event.preventDefault();

    // Récupère les valeurs des champs du formulaire
    const title = document.getElementById("title").value;
    const categoryId = document.getElementById("category").value;
    const imageInput = document.getElementById("add-photo-input");

    // Validation des champs du formulaire
    if (!title || !categoryId || !imageInput.files[0]) {
      console.error("Veuillez remplir tous les champs.");
      return;
    }

    // Récupère le premier fichier du champ de type fichier
    const imageFile = imageInput.files[0];
    // Construire un objet FormData pour envoyer le fichier au serveur
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", imageFile);

    try {
      const response = await fetch(`${apiBaseUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
        body: formData,
      });

      // Vérifie si la requête a réussi
      if (response.ok) {
        const newProject = await response.json();
        console.log("Le travail a été ajouté avec succès.");

        loadProjectsIntoModal(); // permet d'afficher les projets sans rafraîchir la page (modal)
        addProjectToGallery(newProject); // permet d'afficher les projets sans rafraîchir la page (page d'accueil)

        // Réinitialise les champs de la modale après l'ajout
        resetAddPhotoModal();
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  });
}

// Fonction pour ajouter un projet à la galerie (DOM)
function addProjectToGallery(project) {
  const galleryContainer = document.querySelector(".gallery");
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.innerHTML = `
    <img src="${project.imageUrl}" alt="${project.title}">
    <h3>${project.title}</h3>
  `;
  galleryContainer.appendChild(projectElement);
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

  // Ajout des écouteurs d'événements pour la validation du formulaire
  document.getElementById("title").addEventListener("input", validateForm);
  document.getElementById("category").addEventListener("change", validateForm);
  document
    .getElementById("add-photo-input")
    .addEventListener("change", validateForm);

  loadCategories();
  loadProjectsIntoModal();
  addNewImage(); // Appeler la fonction pour ajouter une nouvelle image
});
