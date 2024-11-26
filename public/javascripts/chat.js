// public/javascripts/chat.js

const socket = io();
const userId = userInfo.id;
const username = userInfo.username;
let currentRoom = "general";

// Configuration des salles
const rooms = {
  general: {
    name: "Général",
    icon: "users",
    description: "Discussion générale pour tous les membres",
  },
  formation: {
    name: "Formation",
    icon: "graduation-cap",
    description: "Échanges sur les formations et cours",
  },
  entraide: {
    name: "Entraide",
    icon: "hands-helping",
    description: "Demandez et offrez de l'aide",
  },
  detente: {
    name: "Détente",
    icon: "coffee",
    description: "Discussions informelles et détente",
  },
  ressources: {
    name: "Ressources",
    icon: "book",
    description: "Partage de ressources et documentation",
  },
  evenements: {
    name: "Événements",
    icon: "calendar",
    description: "Annonces et discussions d'événements",
  },
};

// Fonctions de message
function addMessage(data) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${
    data.username === userInfo.username ? "own-message" : "other-message"
  }`;
  messageElement.dataset.messageId = data._id;

  const messageTime = data.timestamp
    ? new Date(data.timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  const messageContent = data.content || data.message;
  if (!messageContent) {
    console.warn("Message content is missing:", data);
    return;
  }

  messageElement.innerHTML = `
        <div class="message-header">
            <img src="${
              data.user?.avatar || "/images/default-profile.svg"
            }" class="message-avatar">
            <span class="message-username">${data.username}</span>
            <span class="message-time">${messageTime}</span>
        </div>
        <div class="message-content">${messageContent}</div>
        <div class="message-footer">
            <div class="message-reactions" data-message-id="${data._id}"></div>
            <div class="message-actions">
                <button class="reaction-trigger" onclick="showReactionSelector('${
                  data._id
                }')">
                    <i class="far fa-smile"></i>
                </button>
            </div>
        </div>
    `;

  // Ajout du bouton de suppression pour les messages de l'utilisateur connecté
  if (data.username === userInfo.username) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "action-btn delete-btn";
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener("click", () => {
      socket.emit("delete-message", { messageId: data._id });
    });
    messageElement.querySelector(".message-actions").appendChild(deleteButton);
  }

  messagesDiv.appendChild(messageElement);
  updateMessageReactions(data._id, data.reactions || {});
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(message) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className = "system-message";
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function loadMessageHistory(messages) {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";
  messages.forEach((message) => addMessage(message));
}

// Fonctions de salle
function updateRoomsList(rooms) {
  const roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const button = document.createElement("button");
    button.className = `room-btn ${room.slug === currentRoom ? "active" : ""}`;
    button.dataset.room = room.slug;
    button.innerHTML = `
            <i class="fas fa-${room.icon || "hashtag"}"></i>
            ${room.name}
        `;
    button.addEventListener("click", () => changeRoom(room.slug));
    roomList.appendChild(button);
  });
}

function changeRoom(newRoom) {
  if (newRoom === currentRoom) return;

  socket.emit("join-room", { room: newRoom });

  document.querySelectorAll(".room-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.room === newRoom) {
      btn.classList.add("active");
    }
  });

  document.getElementById("current-room-name").textContent =
    rooms[newRoom]?.name || newRoom;
  document.getElementById("room-description").textContent =
    rooms[newRoom]?.description || "";
  document.getElementById("messages").innerHTML = "";
  currentRoom = newRoom;
}

// Fonctions utilisateurs et frappe
function updateUsersList(users) {
  const usersList = document.getElementById("users-list");
  usersList.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.className = "user-item";
    userElement.innerHTML = `
            <img src="${
              user.avatar || "/images/default-profile.svg"
            }" class="user-avatar-small">
            <span>${user.username}</span>
            <span class="user-status"></span>
        `;
    usersList.appendChild(userElement);
  });
  document.getElementById("users-count").textContent = `${
    users.length
  } utilisateur${users.length > 1 ? "s" : ""}`;
}

function showTypingIndicator(username) {
  const typingDiv =
    document.getElementById("typing-indicator") ||
    document.createElement("div");
  typingDiv.id = "typing-indicator";
  typingDiv.className = "typing-indicator";
  typingDiv.textContent = `${username} est en train d'écrire...`;
  document
    .querySelector(".message-input-container")
    .insertBefore(typingDiv, document.getElementById("message-form"));
}

function hideTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

// Fonctions de réaction
function showReactionSelector(messageId) {
  const quickReactions = ["👍", "❤️", "😊", "😮", "😢", "👏"];

  const existingSelector = document.querySelector(".reaction-selector");
  if (existingSelector) {
    existingSelector.remove();
  }

  const selector = document.createElement("div");
  selector.className = "reaction-selector";
  selector.innerHTML = quickReactions
    .map(
      (emoji) =>
        `<button class="quick-reaction" onclick="addReaction('${messageId}', '${emoji}')">${emoji}</button>`
    )
    .join("");

  const messageElement = document.querySelector(
    `[data-message-id="${messageId}"]`
  );
  const actionsElement = messageElement.querySelector(".message-actions");
  actionsElement.appendChild(selector);

  document.addEventListener("click", function closeSelector(e) {
    if (
      !e.target.closest(".reaction-selector") &&
      !e.target.closest(".reaction-trigger")
    ) {
      selector.remove();
      document.removeEventListener("click", closeSelector);
    }
  });
}

function addReaction(messageId, emoji) {
  socket.emit("add-reaction", { messageId, reaction: emoji });

  const selector = document.querySelector(".reaction-selector");
  if (selector) {
    selector.remove();
  }
}

function updateMessageReactions(messageId, reactions) {
  const container = document.querySelector(
    `.message-reactions[data-message-id="${messageId}"]`
  );
  if (!container) return;

  container.innerHTML = Object.entries(reactions)
    .map(([emoji, users]) => {
      const count = Array.isArray(users) ? users.length : 0;
      const hasReacted = Array.isArray(users) && users.includes(userInfo.id);
      return `
            <button class="reaction-btn ${hasReacted ? "user-reacted" : ""}"
                    onclick="addReaction('${messageId}', '${emoji}')">
                ${emoji} ${count}
            </button>
        `;
    })
    .join("");
}

// Initialisation et configuration
function initializeChat() {
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const emojiButton = document.getElementById("emoji-button");
  const emojiPicker = document.getElementById("emoji-picker");
  const themeToggle = document.getElementById("theme-toggle");

  // Configuration du picker d'emoji
  const picker = document.createElement("emoji-picker");
  emojiPicker.appendChild(picker);

  // Event listeners pour les emojis
  emojiButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    emojiPicker.classList.toggle("hidden");
  });

  picker.addEventListener("emoji-click", (event) => {
    const emoji = event.detail.unicode;
    const cursorPos = messageInput.selectionStart;

    messageInput.value =
      messageInput.value.slice(0, cursorPos) +
      emoji +
      messageInput.value.slice(cursorPos);

    messageInput.focus();
    messageInput.selectionStart = cursorPos + emoji.length;
    messageInput.selectionEnd = cursorPos + emoji.length;
    emojiPicker.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#emoji-picker") &&
      !e.target.closest("#emoji-button")
    ) {
      emojiPicker.classList.add("hidden");
    }
  });

  // Event listeners pour le chat
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("chat-message", {
        room: currentRoom,
        message,
        timestamp: new Date(),
      });
      messageInput.value = "";
    }
  });

  let typingTimer;
  messageInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    socket.emit("typing", { room: currentRoom });
    typingTimer = setTimeout(() => {
      socket.emit("stop-typing", { room: currentRoom });
    }, 1000);
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  });
}

function setupSocketEvents() {
  socket.emit("user-connect", {
    userId,
    username,
    room: currentRoom,
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    addSystemMessage(`Erreur: ${error.message}`);
  });

  socket.on("chat-message", (data) => addMessage(data));
  socket.on("message-history", (messages) => loadMessageHistory(messages));
  socket.on("rooms-list", (rooms) => updateRoomsList(rooms));
  socket.on("reaction-updated", ({ messageId, reactions }) =>
    updateMessageReactions(messageId, reactions)
  );

  socket.on("user-connected", (data) => {
    addSystemMessage(
      `${data.username} a rejoint ${rooms[data.room]?.name || data.room}`
    );
    updateUsersList(data.users);
  });

  socket.on("user-disconnected", (data) => {
    addSystemMessage(
      `${data.username} a quitté ${rooms[data.room]?.name || data.room}`
    );
    updateUsersList(data.users);
  });

  socket.on("user-typing", (data) => {
    if (data.username !== username) {
      showTypingIndicator(data.username);
    }
  });

  socket.on("user-stop-typing", () => {
    hideTypingIndicator();
  });

  socket.on("message-deleted", (data) => {
    const messageElement = document.querySelector(
      `[data-message-id="${data.messageId}"]`
    );
    if (messageElement) {
      messageElement.remove();
    }
  });
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  initializeChat();
  setupSocketEvents();
});
