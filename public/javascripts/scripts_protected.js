const navbar = document.getElementById('navbarHidden');
const mainContent = document.getElementById('mainContent');
const gptInput = document.getElementById('gptInput');
let lastScrollTop = 0;
let divsHidden = false;
let isProfileVisible = false;

// Profile Management
function loadProfile() {
    fetch('/users/profile')
        .then(response => response.text())
        .then(html => {
            mainContent.dataset.previousContent = mainContent.innerHTML;
            mainContent.innerHTML = html;
            
            // Initialize chart after content is loaded
            const ctx = document.getElementById('activityChart')?.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                        datasets: [{
                            label: 'Heures d\'apprentissage',
                            data: [2.5, 3.2, 1.8, 4.0, 2.8, 1.5, 2.0],
                            backgroundColor: '#3B82F6',
                            borderRadius: 6,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: '#9CA3AF'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: '#9CA3AF'
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error loading profile:', error));
}

// Profile Toggle Button Event Listener
document.addEventListener('DOMContentLoaded', function() {
    const toggleProfileButton = document.getElementById('toggleProfileButton');
    if (toggleProfileButton) {
        toggleProfileButton.addEventListener('click', function() {
            if (!isProfileVisible) {
                if (!gptInput.classList.contains('hidden')) {
                    // If GPT is active, deactivate it first
                    document.getElementById('gptButton').click();
                }
                loadProfile();
                toggleProfileButton.innerHTML = '<i class="fas fa-times mr-2"></i>Fermer Profil';
                isProfileVisible = true;
            } else {
                mainContent.innerHTML = mainContent.dataset.previousContent;
                toggleProfileButton.innerHTML = '<i class="fas fa-user-circle mr-2"></i>Voir Profil';
                isProfileVisible = false;
            }
        });
    }
});

// GPT Button Event Listener
document.getElementById('gptButton').addEventListener('click', function() {
    if (isProfileVisible) {
        // If profile is visible, close it first
        document.getElementById('toggleProfileButton').click();
    }
    
    mainContent.classList.toggle('hidden');
    gptInput.classList.toggle('hidden');
    
    document.getElementById('gptIconActive').classList.toggle('hidden');
    document.getElementById('gptIconInactive').classList.toggle('hidden');
    
    if (!gptInput.classList.contains('hidden')) {
        const divsToShow = ['div-parent-left', 'div-parent-right'];
        divsToShow.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.remove('hidden');
            }
        });
        
        navbar.classList.remove('full-width');
        mainContent.classList.remove('full-width');
        divsHidden = false;
    }
});

// Scroll Handler
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

// Toggle Button Event Listener
document.getElementById('toggleButton').addEventListener('click', function() {
    if (!gptInput.classList.contains('hidden')) {
        return;
    }
    
    const divsToHide = ['div-parent-left', 'div-parent-right'];
    
    if (!divsHidden) {
        divsToHide.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.add('hidden');
            }
        });
        
        mainContent.classList.add('full-width');
        navbar.classList.add('full-width');
        
        divsHidden = true;
    } else {
        divsToHide.forEach(divId => {
            const div = document.getElementById(divId);
            if (div) {
                div.classList.remove('hidden');
            }
        });
        
        mainContent.classList.remove('full-width');
        navbar.classList.remove('full-width');
        
        divsHidden = false;
    }
});