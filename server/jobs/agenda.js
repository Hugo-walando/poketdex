const Agenda = require('agenda');
const { MONGO_URI } = process.env;

const agenda = new Agenda({
  db: {
    address: MONGO_URI,
    collection: 'agendaJobs',
  },
  processEvery: '30 seconds', // fréquence de scan des jobs
});

module.exports = agenda;
