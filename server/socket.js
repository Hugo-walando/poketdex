// socket.js
const { Server } = require('socket.io');

const connectedUsers = new Map();

function setupSocket(server, allowedOrigin) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 Nouveau client connecté :', socket.id);

    socket.on('register-user', (userId) => {
      if (!userId) return;
      connectedUsers.set(userId, socket.id);
      console.log(`✅ Utilisateur ${userId} connecté`);
      logConnectedUsers();
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
          break;
        }
      }
      logConnectedUsers();
    });
  });

  function logConnectedUsers() {
    const ids = Array.from(connectedUsers.keys());
    console.log(`🧍 Utilisateurs connectés (${ids.length}) :`, ids);
  }

  return io;
}

function getConnectedUserIds() {
  return Array.from(connectedUsers.keys());
}

module.exports = {
  setupSocket,
  getConnectedUserIds,
};
