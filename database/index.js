const mongoose = require('mongoose');

// Assurez-vous que NODE_ENV est défini, sinon utilisez une valeur par défaut
const env = process.env.NODE_ENV ? require(`../environment/${process.env.NODE_ENV}`) : require('../environment/development');

// Écoutez l'événement de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose est connecté Db/models/index.js');
});
mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose est déconnecté');
});

// Établissez la connexion à la base de données
exports.clientPromise = mongoose.connect(env.dbUrl)
  .then(() => console.log('Connexion DB OK !'))
  .catch(err => console.log(err));
