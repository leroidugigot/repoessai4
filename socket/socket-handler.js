const Message = require("../database/models/message.model");
const Room = require("../database/models/room.model");
const User = require("../database/models/user.model");
const { UserSimulator } = require('../public/javascripts/userSimulation');

module.exports = (io) => {
  // Créer et démarrer le simulateur
  const userSimulator = new UserSimulator(io);
  userSimulator.startSimulation();

  // État global
  const connectedUsers = new Map();
  const userTypingStatus = new Map();

  // Configuration des salles par défaut
  const defaultRooms = {
    general: {
      name: "Général",
      icon: "users",
      description: "Discussion générale",
    },
    formation: {
      name: "Formation",
      icon: "graduation-cap",
      description: "Échanges sur les formations",
    },
    entraide: {
      name: "Entraide",
      icon: "hands-helping",
      description: "Demandez et offrez de l'aide",
    },
    detente: {
      name: "Détente",
      icon: "coffee",
      description: "Discussions informelles",
    },
    ressources: {
      name: "Ressources",
      icon: "book",
      description: "Partage de ressources",
    },
    evenements: {
      name: "Événements",
      icon: "calendar",
      description: "Annonces d'événements",
    },
  };

  // Fonctions utilitaires
  const getUsersInRoom = (room) => Array.from(connectedUsers.get(room)?.values() || []);

  const disconnectExistingSessions = async (userId) => {
    for (const [room, users] of connectedUsers.entries()) {
      for (const [socketId, user] of users.entries()) {
        if (user.id === userId) {
          users.delete(socketId);
          io.to(room).emit("users-update", getUsersInRoom(room));
        }
      }
    }
  };

  const loadMessageHistory = async (room, limit = 50) => {
    try {
      const messages = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username avatar');
      return messages.reverse();
    } catch (error) {
      console.error('Erreur de chargement des messages:', error);
      return [];
    }
  };

  // Gestionnaire principal de connexion
  io.on("connection", async (socket) => {
    console.log("Nouvelle connexion socket:", socket.id);
    let currentUser = null;
    let currentRoom = "general";

    // Gestion de la connexion utilisateur
    socket.on("user-connect", async ({ userId, username, room = "general" }) => {
      try {
        console.log("Tentative de connexion:", { userId, username, room });

        // Déconnexion des sessions existantes
        await disconnectExistingSessions(userId);

        // Vérification de l'utilisateur
        const user = await User.findById(userId);
        if (!user) throw new Error("Utilisateur non trouvé");

        // Configuration de l'utilisateur courant
        currentUser = {
          id: userId,
          socketId: socket.id,
          username: user.username,
          avatar: user.avatar || "/images/default-profile.svg",
          room,
        };

        // Rejoindre la salle et mettre à jour les listes
        socket.join(room);
        currentRoom = room;

        if (!connectedUsers.has(room)) {
          connectedUsers.set(room, new Map());
        }
        connectedUsers.get(room).set(socket.id, currentUser);

        // Envoyer les données initiales
        const messages = await loadMessageHistory(room);
        socket.emit("message-history", messages);
        socket.emit("rooms-list", Object.entries(defaultRooms).map(([slug, data]) => ({
          slug,
          ...data,
        })));

        // Notifier les autres utilisateurs
        io.to(room).emit("user-connected", {
          username: user.username,
          room,
          users: getUsersInRoom(room),
        });

        console.log(`${username} connecté dans la salle ${room}`);
      } catch (error) {
        console.error("Erreur de connexion:", error);
        socket.emit("error", {
          message: "Erreur de connexion",
          details: error.message,
        });
      }
    });

    // Gestion des messages
    socket.on("chat-message", async (data) => {
      if (!currentUser) return;

      try {
        const messageData = {
          user: currentUser.id,
          room: currentRoom,
          content: data.message,
          timestamp: new Date(),
          reactions: new Map()
        };

        const message = new Message(messageData);
        await message.save();

        const populatedMessage = await Message.findById(message._id)
          .populate("user", "username avatar");

        io.to(currentRoom).emit("chat-message", {
          _id: message._id,
          content: data.message,
          username: currentUser.username,
          timestamp: message.timestamp,
          reactions: {},
          user: {
            _id: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
          },
        });
      } catch (error) {
        console.error("Erreur d'envoi de message:", error);
        socket.emit("error", { message: "Erreur d'envoi de message" });
      }
    });

    // Gestion des réactions aux messages
    socket.on("add-reaction", async ({ messageId, reaction }) => {
      if (!currentUser) return;

      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (!message.reactions) {
          message.reactions = new Map();
        }

        let reactions = message.reactions.get(reaction) || [];
        const userIndex = reactions.indexOf(currentUser.id);

        if (userIndex === -1) {
          reactions.push(currentUser.id);
        } else {
          reactions = reactions.filter(id => id !== currentUser.id);
        }

        if (reactions.length > 0) {
          message.reactions.set(reaction, reactions);
        } else {
          message.reactions.delete(reaction);
        }

        await message.save();

        const reactionsObject = {};
        message.reactions.forEach((users, emoji) => {
          reactionsObject[emoji] = users;
        });

        io.to(currentRoom).emit("reaction-updated", {
          messageId,
          reactions: reactionsObject
        });
      } catch (error) {
        console.error("Erreur de réaction:", error);
        socket.emit("error", { message: "Erreur lors de l'ajout de la réaction" });
      }
    });

    // Gestion de la suppression des messages
    socket.on("delete-message", async ({ messageId }) => {
      if (!currentUser) return;

      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (message.user.toString() === currentUser.id) {
          await Message.deleteOne({ _id: messageId });
          io.to(currentRoom).emit("message-deleted", { messageId });
        }
      } catch (error) {
        console.error("Erreur de suppression:", error);
        socket.emit("error", { message: "Erreur lors de la suppression" });
      }
    });

    // Gestion des changements de salle
    socket.on("join-room", async ({ room }) => {
      if (!currentUser || room === currentRoom) return;

      try {
        socket.leave(currentRoom);
        connectedUsers.get(currentRoom)?.delete(socket.id);
        io.to(currentRoom).emit("users-update", getUsersInRoom(currentRoom));

        socket.join(room);
        currentRoom = room;

        if (!connectedUsers.has(room)) {
          connectedUsers.set(room, new Map());
        }

        currentUser.room = room;
        connectedUsers.get(room).set(socket.id, currentUser);

        const messages = await loadMessageHistory(room);
        socket.emit("message-history", messages);
        io.to(room).emit("users-update", getUsersInRoom(room));

        socket.emit("room-info", {
          name: defaultRooms[room]?.name || room,
          description: defaultRooms[room]?.description || "",
          icon: defaultRooms[room]?.icon || "hashtag"
        });

        console.log(`${currentUser.username} a changé de salle: ${room}`);
      } catch (error) {
        console.error("Erreur de changement de salle:", error);
        socket.emit("error", { message: "Erreur de changement de salle" });
      }
    });

    // Gestion des messages épinglés
    socket.on("pin-message", async ({ messageId }) => {
      if (!currentUser) return;

      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        message.pinned = !message.pinned;
        await message.save();

        io.to(currentRoom).emit("message-pinned", {
          messageId,
          pinned: message.pinned,
          pinnedBy: currentUser.username
        });
      } catch (error) {
        console.error("Erreur d'épinglage:", error);
        socket.emit("error", { message: "Erreur lors de l'épinglage du message" });
      }
    });

    // Gestion du typing
    socket.on("typing", () => {
      if (!currentUser) return;

      userTypingStatus.set(socket.id, true);
      socket.to(currentRoom).emit("user-typing", {
        username: currentUser.username,
        room: currentRoom
      });

      setTimeout(() => {
        if (userTypingStatus.get(socket.id)) {
          userTypingStatus.delete(socket.id);
          socket.to(currentRoom).emit("user-stop-typing", {
            username: currentUser.username,
            room: currentRoom
          });
        }
      }, 3000);
    });

    socket.on("stop-typing", () => {
      if (!currentUser) return;

      userTypingStatus.delete(socket.id);
      socket.to(currentRoom).emit("user-stop-typing", {
        username: currentUser.username,
        room: currentRoom
      });
    });

    // Gestion des notifications
    socket.on("notification", ({ type, message }) => {
      if (!currentUser) return;
      
      io.to(currentRoom).emit("notification", {
        type,
        message,
        username: currentUser.username,
        timestamp: new Date()
      });
    });

    // Gestion des déconnexions
    socket.on("disconnect", () => {
      if (currentUser && currentRoom) {
        connectedUsers.get(currentRoom)?.delete(socket.id);

        io.to(currentRoom).emit("user-disconnected", {
          username: currentUser.username,
          room: currentRoom,
          users: getUsersInRoom(currentRoom)
        });

        userTypingStatus.delete(socket.id);

        console.log(`${currentUser.username} s'est déconnecté`);
      }
    });

    // Gestion des erreurs de socket
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      socket.emit("error", {
        message: "Une erreur est survenue",
        details: process.env.NODE_ENV === "development" ? error.message : null
      });
    });
  });

  // Nettoyage périodique des utilisateurs déconnectés
  setInterval(() => {
    for (const [room, users] of connectedUsers.entries()) {
      const activeUsers = new Map();
      for (const [socketId, user] of users.entries()) {
        if (io.sockets.sockets.has(socketId)) {
          activeUsers.set(socketId, user);
        }
      }
      connectedUsers.set(room, activeUsers);
    }
  }, 30000);

  // API publique du gestionnaire de socket
  return {
    getUsersInRoom,
    getTotalConnectedUsers: () => {
      const uniqueUsers = new Set();
      for (const users of connectedUsers.values()) {
        for (const user of users.values()) {
          uniqueUsers.add(user.id);
        }
      }
      return uniqueUsers.size;
    },
    isUserConnected: (userId) => {
      for (const users of connectedUsers.values()) {
        for (const user of users.values()) {
          if (user.id === userId) return true;
        }
      }
      return false;
    },
    getRoomUsers: (room) => getUsersInRoom(room),
    broadcastToRoom: (room, event, data) => {
      io.to(room).emit(event, data);
    },
    userSimulator
  };
};