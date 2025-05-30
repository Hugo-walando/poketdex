const Agenda = require('agenda');
const { MONGODB_URI } = process.env;

const agenda = new Agenda({
  db: {
    address: MONGODB_URI,
    collection: 'agendaJobs',
  },
  processEvery: '30 seconds', // fréquence de scan des jobs
});

module.exports = agenda;
