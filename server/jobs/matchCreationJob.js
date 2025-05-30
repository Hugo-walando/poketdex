const { findAndCreateMatch } = require('../services/matchService');

module.exports = (agenda) => {
  agenda.define('create-match', async (job) => {
    const { userId, cardId, mode } = job.attrs.data;
    console.log('🛠️ Job lancé pour', userId, cardId, mode);
    await findAndCreateMatch(userId, cardId, mode);
  });
};
