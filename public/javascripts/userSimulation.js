// Créer un fichier userSimulation.js

const mockUsers = [
    { id: 'sim1', username: 'Emma_Martin', avatar: '/images/default-profile.svg' },
    { id: 'sim2', username: 'Lucas_Bernard', avatar: '/images/default-profile.svg' },
    { id: 'sim3', username: 'Léa_Dubois', avatar: '/images/default-profile.svg' },
    { id: 'sim4', username: 'Hugo_Lambert', avatar: '/images/default-profile.svg' },
    { id: 'sim5', username: 'Chloé_Moreau', avatar: '/images/default-profile.svg' },
    { id: 'sim6', username: 'Jules_Robert', avatar: '/images/default-profile.svg' },
    { id: 'sim7', username: 'Manon_Simon', avatar: '/images/default-profile.svg' },
    { id: 'sim8', username: 'Louis_Michel', avatar: '/images/default-profile.svg' },
    { id: 'sim9', username: 'Alice_Durand', avatar: '/images/default-profile.svg' },
    { id: 'sim10', username: 'Thomas_Petit', avatar: '/images/default-profile.svg' }
  ];
  
  class UserSimulator {
    constructor(io, defaultRoom = 'general') {
      this.io = io;
      this.defaultRoom = defaultRoom;
      this.connectedUsers = new Map();
      this.simulationInterval = null;
    }
  
    // Démarrer la simulation
    startSimulation() {
      // Connecter initialement quelques utilisateurs aléatoires
      this.initialConnections();
  
      // Configurer les intervalles de simulation
      this.simulationInterval = setInterval(() => {
        this.simulateRandomActivity();
      }, 5000); // Toutes les 5 secondes
    }
  
    // Arrêter la simulation
    stopSimulation() {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
      }
    }
  
    // Connexions initiales
    initialConnections() {
      const initialCount = Math.floor(Math.random() * 5) + 3; // 3-7 utilisateurs initiaux
      for (let i = 0; i < initialCount; i++) {
        this.connectRandomUser();
      }
    }
  
    // Simuler une activité aléatoire
    simulateRandomActivity() {
      const random = Math.random();
      
      if (this.connectedUsers.size < 3) {
        // Garantir un minimum d'utilisateurs connectés
        this.connectRandomUser();
      } else if (random < 0.5 && this.connectedUsers.size < mockUsers.length) {
        // 50% de chance de connecter un nouvel utilisateur
        this.connectRandomUser();
      } else if (random >= 0.5 && this.connectedUsers.size > 0) {
        // 50% de chance de déconnecter un utilisateur
        this.disconnectRandomUser();
      }
    }
  
    // Connecter un utilisateur aléatoire
    connectRandomUser() {
      const availableUsers = mockUsers.filter(
        user => !this.connectedUsers.has(user.id)
      );
      
      if (availableUsers.length > 0) {
        const user = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        this.connectedUsers.set(user.id, user);
        
        // Émettre l'événement de connexion
        this.io.to(this.defaultRoom).emit('user-connected', {
          username: user.username,
          room: this.defaultRoom,
          users: Array.from(this.connectedUsers.values())
        });
  
        console.log(`Simulation: ${user.username} s'est connecté`);
      }
    }
  
    // Déconnecter un utilisateur aléatoire
    disconnectRandomUser() {
      const connectedUserIds = Array.from(this.connectedUsers.keys());
      if (connectedUserIds.length > 0) {
        const randomId = connectedUserIds[Math.floor(Math.random() * connectedUserIds.length)];
        const user = this.connectedUsers.get(randomId);
        this.connectedUsers.delete(randomId);
  
        // Émettre l'événement de déconnexion
        this.io.to(this.defaultRoom).emit('user-disconnected', {
          username: user.username,
          room: this.defaultRoom,
          users: Array.from(this.connectedUsers.values())
        });
  
        console.log(`Simulation: ${user.username} s'est déconnecté`);
      }
    }
  
    // Obtenir la liste des utilisateurs connectés
    getConnectedUsers() {
      return Array.from(this.connectedUsers.values());
    }
  }
  
  module.exports = { UserSimulator, mockUsers };