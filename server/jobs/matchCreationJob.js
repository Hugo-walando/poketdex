const { findAndCreateMatch } = require('../services/matchService');
const { getSocketIO } = require('../socket');

module.exports = (agenda) => {
  agenda.define('create-match', async (job, done) => {
    const { userId, cardId, mode } = job.attrs.data;
    const io = getSocketIO(); // 👈 Récupère l’instance socket.io

    const jobId = job.attrs._id.toString();

    try {
      console.log('🛠️ Job lancé pour', userId, cardId, mode);

      // 🔵 Signale que le job commence
      io.emit('job:started', {
        jobId,
        name: 'create-match',
        userId,
        cardId,
        mode,
      });

      await findAndCreateMatch(userId, cardId, mode);

      // ✅ Signale que le job est terminé
      io.emit('job:finished', {
        jobId,
        name: 'create-match',
        userId,
        cardId,
        mode,
      });

      done();
    } catch (err) {
      console.error('❌ Erreur dans le job create-match :', err);

      // ❌ Signale une erreur
      io.emit('job:failed', {
        jobId,
        name: 'create-match',
        userId,
        cardId,
        mode,
        error: err.message,
      });

      done(err);
    }
  });
};
