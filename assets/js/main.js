document.addEventListener('DOMContentLoaded', () => {


  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // gère l’ouverture/fermeture du menu 
  const toggle = $('.nav__toggle');
  const nav = $('#nav');

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open'); // ajoute/retire la classe "open"
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); // accessibilité
  });

  /* === SCROLL === */
  // défilement vers section 
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); // cible les liens internes
    if (!a) return;

    const t = $(a.getAttribute('href')); // section cible
    if (!t) return;

    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' }); // défilement 

    // Ferme la nav mobile après clic
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });

  /* === ANNÉE  === */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* === ANIMATION SCROLL === */
  const reveals = $$('.reveal');

  // IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        //  visible à l’écran ajout classe "in"
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.1 });

    reveals.forEach((el) => io.observe(el));
  } else {
    // si non supporté affiche tout
    reveals.forEach((el) => el.classList.add('in'));
  }


// retour en haut
document.querySelector('.top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


  /* === FORMULAIRE DE CONTACT === */
  const form = $('#contact-form');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupération et nettoyage des valeurs
    const nom = $('#nom')?.value.trim();
    const prenom = $('#prenom')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();

    // Vérification champ
    if (!nom || !prenom || !email || !message) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Vérification mail
    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValide) {
      alert('Veuillez saisir un email valide.');
      return;
    }

    // envoi via mailto:
    const to = 'abdra.sac@yahoo.com';
    const subject = 'Contact Portfolio';
    const body = encodeURIComponent(
      `Nom: ${nom}\nPrénom: ${prenom}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    // Ouvre le client mail
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
});