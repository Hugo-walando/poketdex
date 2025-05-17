// socket.js
const { Server } = require('socket.io');

const connectedUsers = new Map();

let ioInstance;

function setupSocket(server, allowedOrigin) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('register-user', (userId) => {
      if (!userId) return;

      connectedUsers.set(userId, socket.id);
      console.log(`✅ Utilisateur ${userId} connecté`);
      logConnectedUsers();

      // 👇 Émettre à tous que cet user est connecté
      socket.broadcast.emit('user-connected', userId);

      // 👇 Envoyer la liste actuelle au nouveau connecté
      const allConnectedIds = Array.from(connectedUsers.keys());
      socket.emit('connected-users', allConnectedIds);
    });

    socket.on('get-connected-users', () => {
      const ids = Array.from(connectedUsers.keys());
      socket.emit('connected-users', ids);
    });

    socket.on('disconnect', () => {
      for (const [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`🔴 Utilisateur ${userId} déconnecté`);

          socket.broadcast.emit('user-disconnected', userId); // 👈 Diffusion aux autres clients
          break;
        }
      }
      logConnectedUsers();
    });
  });

  function logConnectedUsers() {
    const ids = Array.from(connectedUsers.keys());
    console.log(`🧍 Utilisateurs connectés (${ids.length})`);
  }

  return io;
}
function getSocketIO() {
  return ioInstance;
}

function getConnectedUsersMap() {
  return connectedUsers;
}

function getConnectedUserIds() {
  return Array.from(connectedUsers.keys());
}

module.exports = {
  setupSocket,
  getConnectedUserIds,
  getConnectedUsersMap,
  getSocketIO,
};
