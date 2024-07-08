import { getWorksFromServer, createWorkFigure } from "./gallery.js";
import { fetchApi } from "./api.js";

// Récupération du token utilisateur depuis le stockage local
const getUserToken = () => localStorage.getItem("token");

class Modal {
  constructor() {
    this.init();
  }

  // Initialisation de la modale
  init() {
    this.createModal();
    this.addEventListeners();
    this.loadProjectsIntoModal();
    this.loadCategoriesIntoSelect();
  }

  // Création de la structure HTML de la modale
  createModal() {
    const modalHTML = `
      <div id="modal" class="modal">
        <div class="modal-content">
          <i class="fa-solid fa-xmark js-modal-close close-icon"></i>
          <div id="modal-view-gallery">
            <h2 class="title-modal-add">Galerie photo</h2>
            <div id="modal-gallery" class="mod-gallery"></div>
            <hr class="modal-divider">
            <button id="add-photo-btn">Ajouter une photo</button>
          </div>
          <div id="modal-view-add-photo" style="display: none;">
            <a href="#" id="back-to-gallery"><i class="fa fa-light fa-arrow-left" aria-hidden="true"></i></a>
            <h2 class="title-modal-add">Ajout photo</h2>
            <form id="add-photo-form">
              <div class="add-picture">
                <i class="fa fa-thin fa-image faAddImgSquare"></i>
                <div id="image-preview-container">
                  <label for="add-photo-input" id="file" class="custom-button-label">
                    <span class="custom-button">+ Ajouter photo</span>
                  </label>
                  <input type="file" id="add-photo-input" name="image" class="custom-button" accept="image/*" required>
                </div>
                <p class="info">jpg, png : 4mo max</p>
              </div>
              <h4>Titre</h4>
              <input type="text" id="title" name="title" required>
              <h4>Catégorie</h4>
              <select id="category" name="category" required>
                <option value="" disabled selected>Sélectionner la catégorie...</option>
              </select>
              <hr class="modal-divider">
              <div id="form-error" style="display: none; color: red;">Veuillez remplir tous les champs.</div>
              <button type="submit" id="valid">Valider</button>
            </form>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // Ajout des écouteurs d'événements pour la modale
  addEventListeners() {
    const modal = document.getElementById("modal");
    const openModalButtons = document.querySelectorAll("[id$='OpenModal']");
    const closeModalIcon = document.querySelector(".close-icon");
    const addPhotoButton = document.getElementById("add-photo-btn");
    const backToGalleryButton = document.getElementById("back-to-gallery");
    const fileInput = document.getElementById("add-photo-input");
    const validForm = document.getElementById("valid");

    openModalButtons.forEach((button) =>
      button.addEventListener("click", openModal)
    );
    closeModalIcon.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    addPhotoButton.addEventListener("click", () => switchModalView(false));
    backToGalleryButton.addEventListener("click", () => switchModalView(true));

    // Ajoute l'image dans la preview
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      displayImagePreview(file);
      document
        .getElementById("file")
        .querySelector(".custom-button").style.display = "none";
    });

    // Écouteur d'événement pour le formulaire de soumission de projet
    validForm.addEventListener("click", (event) =>
      this.handleFormSubmit(event)
    );

    // Écouteurs d'événements pour les champs du formulaire
    ["title", "category", "add-photo-input"].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("input", () => this.checkFormValidity());
    });
  }

  // Gestion soumission du formulaire
  async handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("add-photo-input").files[0];
    const formError = document.getElementById("form-error");

    // Vérification des champs requis
    if (!title || !category || !image) {
      formError.style.display = "block";
      return;
    }

    formError.style.display = "none";

    // Création de l'objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await fetchApi("/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
        body: formData,
      });

      if (!response) {
        throw new Error("Erreur lors de l'ajout du projet.");
      }

      console.log("Le travail a été ajouté avec succès.");

      // Ajouter le nouveau projet à la galerie de la modale
      this.addProjectToModalGallery(response);

      // Ajouter le nouveau projet à la galerie principale
      addProjectToGallery(response);

      // Réinitialisation du formulaire
      this.resetForm();
      switchModalView(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
    }
  }

  // Réinitialisation du formulaire
  resetForm() {
    ["title", "category", "add-photo-input"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.querySelector(".custom-button").style.display = "block";
    document.getElementById("valid").style.backgroundColor = "";
    const previewImage = document.querySelector("#image-preview-container img");
    if (previewImage) {
      previewImage.remove();
    }
  }

  // Vérifie la validité du formulaire
  checkFormValidity() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("add-photo-input").files[0];
    const formError = document.getElementById("form-error");
    const submitButton = document.getElementById("valid");

    if (title && category && image) {
      submitButton.style.backgroundColor = "#1d6154";
      formError.style.display = "none";
    } else {
      submitButton.style.backgroundColor = "grey";
    }
  }

  // Charge les projets dans la modale
  async loadProjectsIntoModal() {
    try {
      const projects = await getWorksFromServer();
      const modalGallery = document.getElementById("modal-gallery");
      modalGallery.innerHTML = "";
      projects.forEach((project) => this.addProjectToModalGallery(project));
    } catch (error) {
      console.error("Erreur lors de la récupération des projets :", error);
    }
  }

  // Ajoute un projet à la galerie de la modale
  addProjectToModalGallery(project) {
    const modalGallery = document.getElementById("modal-gallery");
    const projectFigure = createWorkFigure(project);

    // Supprime le titre pour la modale
    const figcaption = projectFigure.querySelector("figcaption");
    if (figcaption) {
      figcaption.remove();
    }

    // Ajoute les styles spécifiques à la modal
    projectFigure.classList.add("image-container");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-light", "fa-trash-can", "delete-icon");
    deleteIcon.id = `delete-icon-${project.id}`;
    deleteIcon.addEventListener("click", async () => {
      if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
        await this.deleteProject(project.id);
        modalGallery.removeChild(projectFigure);
        const galleryElement = document.getElementById(`figure-${project.id}`);
        if (galleryElement)
          galleryElement.parentNode.removeChild(galleryElement);
      }
    });

    projectFigure.appendChild(deleteIcon);
    modalGallery.appendChild(projectFigure);
  }

  // Fonction pour supprimer un projet du DOM et de l'API
  async deleteProject(projectId) {
    const userToken = getUserToken();
    if (!userToken) {
      console.error("Token d'utilisateur introuvable");
      return;
    }
    try {
      await fetchApi(`/api/works/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log("Succès : Le projet a été supprimé.");
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  }

  // Charge les catégories dans le sélecteur
  async loadCategoriesIntoSelect() {
    try {
      const categories = await fetchApi("/api/categories");
      const categorySelect = document.getElementById("category");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }
}

// ****************** Fonctions externes ****************** //

// Ouvrir la modale
const openModal = () =>
  (document.getElementById("modal").style.display = "block");

// Fermer la modale
const closeModal = () =>
  (document.getElementById("modal").style.display = "none");

// Basculer entre la vue galerie et la vue ajout photo dans la modale
const switchModalView = (showGallery) => {
  document.getElementById("modal-view-gallery").style.display = showGallery
    ? "block"
    : "none";
  document.getElementById("modal-view-add-photo").style.display = showGallery
    ? "none"
    : "block";
};

// Afficher l'aperçu de l'image sélectionnée
const displayImagePreview = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewImage = document.createElement("img");
      previewImage.alt = "Image Preview";
      previewImage.src = event.target.result;
      document
        .getElementById("add-photo-input")
        .insertAdjacentElement("afterend", previewImage);
    };
    reader.readAsDataURL(file);
  }
};

// Ajouter un projet à la galerie
const addProjectToGallery = (project) => {
  const galleryContainer = document.querySelector(".gallery");
  const projectElement = document.createElement("figure");
  projectElement.classList.add("project");
  projectElement.id = `figure-${project.id}`;
  projectElement.setAttribute("data-category-id", project.categoryId);

  projectElement.innerHTML = `
    <img src="${project.imageUrl}" alt="${project.title}">
    <figcaption>${project.title}</figcaption>`;

  galleryContainer.appendChild(projectElement);
};

// Écouter l'événement DOMContentLoaded pour initialiser la modale
document.addEventListener("DOMContentLoaded", () => {
  new Modal();
});
