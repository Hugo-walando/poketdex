const agenda = require('./agenda');
const matchCreationJob = require('./matchCreationJob');

const startJobs = async () => {
  matchCreationJob(agenda);

  await agenda.start(); // démarre le traitement
  console.log('✅ Agenda démarré');
};

module.exports = { agenda, startJobs };
