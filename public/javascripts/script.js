window.addEventListener("load", handleScroll); // Appliquer les styles au chargement de la page

// JavaScript to toggle modal visibility
document
  .getElementById("toggleModalBtn")
  .addEventListener("click", function () {
    const modal = document.getElementById("modal");
    modal.classList.toggle("hidden");
  });
// JavaScript to close modal with the close button
document.getElementById("closeModalBtn").addEventListener("click", function () {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
});

// changer la couleur de la topbar sur le défilement
window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll); // Appliquer les styles au chargement de la page

function handleScroll() {
  const header = document.querySelector("header");
  const scrollPosition = window.scrollY;
  const headerItems = document.querySelectorAll(".change-color-on-scroll");

  if (scrollPosition > 0) {
    header.classList.add("bg-white");
    header.classList.remove("bg-black");
    headerItems.forEach((item) => {
      item.classList.add("text-black");
      item.classList.remove("text-white");
    });
  } else {
    header.classList.add("bg-black");
    header.classList.remove("bg-white");
    headerItems.forEach((item) => {
      item.classList.add("text-white");
      item.classList.remove("text-black");
    });
  }
}

document.getElementById("burgerMenu").addEventListener("click", function () {
  var mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("hidden");
});

//--------------------------------------------------------------------------

// Fonction pour afficher le bouton après 1 secondes
function showButtonAfterDelay(card) {
  const button = card.querySelector(".btn-en-savoir-plus");
  setTimeout(() => {
    button.style.opacity = "1";
  }, 1000); // Délai de 3 secondes
}

// Ajoute un écouteur pour le hover de la carte
const flipCards = document.querySelectorAll(".flip-card");

flipCards.forEach((card) => {
  card.addEventListener("mouseover", () => {
    showButtonAfterDelay(card);
  });

  card.addEventListener("mouseout", () => {
    const button = card.querySelector(".btn-en-savoir-plus");
    button.style.opacity = "0"; // Cache le bouton lorsque la souris quitte la carte
  });
});

function handleClickConnexion() {
  window.location.href = "/auth/signin/form";
}

function handleClickCommencer() {
  window.location.href = "/users/new";
}


document.addEventListener('DOMContentLoaded', function () {
  // Sélectionne tous les liens des formations avec la classe 'formation-link'
  const formationLinks = document.querySelectorAll('.formation-link');
  
  // Attache un event listener à chaque lien
  formationLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Empêche le rechargement de la page

      // Récupère le nom de la formation à partir de l'attribut data-formation
      const formation = this.getAttribute('data-formation');
      
      // Utilise Fetch API pour charger dynamiquement le contenu
      fetch(`/formations/${formation}`)
        .then(response => response.text())
        .then(html => {
          // Injecte le contenu récupéré dans la div avec l'id 'contenu-formation'
          document.getElementById('contenu-formation').innerHTML = html;
        })
        .catch(error => {
          console.error('Erreur lors du chargement de la formation :', error);
        });
    });
  });
});


