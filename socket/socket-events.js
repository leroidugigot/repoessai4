// socket/socket-events.js

const MESSAGE_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    USER_CONNECT: 'user-connect',
    USER_DISCONNECT: 'user-disconnected',
    CHAT_MESSAGE: 'chat-message',
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    TYPING: 'typing',
    STOP_TYPING: 'stop-typing',
    PIN_MESSAGE: 'pin-message',
    MESSAGE_PINNED: 'message-pinned',
    ADD_REACTION: 'add-reaction',
    REACTION_ADDED: 'reaction-added',
    MESSAGE_HISTORY: 'message-history',
    USERS_UPDATE: 'users-update'
  };
  
  module.exports = {
    MESSAGE_EVENTS
  };