import projectsData from '../data/projects.js';

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

  // Galerie
  const galleryMainImg = document.getElementById('gallery-main-img');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const galleryCounter = document.getElementById('gallery-counter');
  const galleryThumbs = document.getElementById('gallery-thumbs');

  // Infos
  const projectDescription = document.getElementById('project-description');
  const projectFeatures = document.getElementById('project-features');
  const projectTechnologies = document.getElementById('project-technologies');
  const projectCode = document.getElementById('project-code');

  // Acquis
  const sectionAcquis = document.getElementById('section-acquis') || null;
  const projectAcquis = document.getElementById('project-acquis') || null;

  let currentProject = null;
  let currentImages = [];
  let currentIndex = 0;

  function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    currentProject = project;
    currentImages = project.images || [];
    currentIndex = 0;

    modalContent.style.display = 'none';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // petit délai pour l’effet (facultatif)
    setTimeout(() => {
      updateModalContent(project);
      modalContent.style.display = 'block';
    }, 150);
  }

  function updateModalContent(project) {
    modalTitle.textContent = project.title || '';
    projectDescription.textContent = project.description || '';

    projectFeatures.innerHTML = '';
    (project.features || []).forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      projectFeatures.appendChild(li);
    });

    if (sectionAcquis && projectAcquis) {
      const txt = (project.acquis || '').trim();
      sectionAcquis.hidden = !txt;
      projectAcquis.textContent = txt;
    }

    projectTechnologies.innerHTML = '';
    (project.technologies || []).forEach((tech) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = tech;
      projectTechnologies.appendChild(span);
    });

    projectCode.href = project.code || '#';
    updateGallery();
  }

  function updateGallery() {
    if (!galleryMainImg || !galleryCounter || !galleryThumbs) return;
    if (!currentImages.length) return;

    galleryMainImg.src = currentImages[currentIndex];
    galleryMainImg.alt = `${currentProject.title} - Image ${currentIndex + 1}`;
    galleryCounter.textContent = `${currentIndex + 1}/${currentImages.length}`;

    galleryThumbs.innerHTML = '';
    currentImages.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.className = `gallery__thumb ${i === currentIndex ? 'active' : ''}`;
      thumb.src = img;
      thumb.alt = `Miniature ${i + 1}`;
      thumb.loading = 'lazy';
      thumb.addEventListener('click', () => {
        currentIndex = i;
        updateGallery();
      });
      galleryThumbs.appendChild(thumb);
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentProject = null;
    currentImages = [];
    currentIndex = 0;
  }

  // Navigation
  galleryPrev?.addEventListener('click', () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateGallery();
  });

  galleryNext?.addEventListener('click', () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateGallery();
  });

  // Fermetures / clavier
  modalClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') galleryPrev?.click();
    if (e.key === 'ArrowRight') galleryNext?.click();
  });

  // Boutons “Voir plus”
  document.querySelectorAll('.js-view-more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });
});
