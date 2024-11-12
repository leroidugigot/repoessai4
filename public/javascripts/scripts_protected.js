const navbar = document.getElementById('navbarHidden');
const mainContent = document.getElementById('mainContent');
const gptInput = document.getElementById('gptInput');
let lastScrollTop = 0;
let divsHidden = false;

// Gestion du bouton GPT
document.getElementById('gptButton').addEventListener('click', function() {
    // Basculer entre gptInput et mainContent
    mainContent.classList.toggle('hidden');
    gptInput.classList.toggle('hidden');
    
    // Basculer les icônes du bouton
    document.getElementById('gptIconActive').classList.toggle('hidden');
    document.getElementById('gptIconInactive').classList.toggle('hidden');
    
    // Si GPT est activé (affiche gptInput)
    if (!gptInput.classList.contains('hidden')) {
        // Restaurer les divs latérales
        const divsToShow = ['div-parent-left', 'div-parent-right'];
        divsToShow.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.remove('hidden');
            }
        });
        
        // Retirer les classes full-width
        navbar.classList.remove('full-width');
        mainContent.classList.remove('full-width');
        divsHidden = false;
    }
});

// Gestion du défilement pour navbar
function handleScroll() {
    let scrollTop = mainContent.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    lastScrollTop = scrollTop;
}

mainContent.addEventListener('scroll', handleScroll);

// Gestion du bouton toggle pour les divs latérales
document.getElementById('toggleButton').addEventListener('click', function() {
    // Ne rien faire si on est en mode GPT
    if (!gptInput.classList.contains('hidden')) {
        return;
    }

    const divsToHide = ['div-parent-left', 'div-parent-right'];
    
    if (!divsHidden) {
        // Masquer les divs
        divsToHide.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.add('hidden');
            }
        });

        // Élargir la div principale
        mainContent.classList.add('full-width');
        navbar.classList.add('full-width');

        divsHidden = true;
    } else {
        // Afficher les divs
        divsToHide.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.remove('hidden');
            }
        });

        // Réduire la div principale
        mainContent.classList.remove('full-width');
        navbar.classList.remove('full-width');

        divsHidden = false;
    }




    
    
});