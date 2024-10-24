const session = require('express-session');
const MongoStore = require('connect-mongo');
const { clientPromise } = require('../database');

const sessionConfig = (app) => {
  app.use(
    session({
      secret: 'cersei', // Changez cela pour un environnement de production
      resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
      saveUninitialized: false, // Ne pas sauvegarder une session non initialisée
      cookie: {
        httpOnly: true, // Le cookie ne peut pas être accessible via JavaScript
        maxAge: 1000 * 60 * 60 * 24 * 14, // Durée de la session de 14 jours
      },
      store: MongoStore.create({
        clientPromise, // Assurez-vous que clientPromise est une promesse qui résout vers un client MongoDB
        dbName: 'nom_de_votre_base_de_données', // Spécifiez bien votre nom de base de données
    ttl: 14 * 24 * 60 * 60, // Délai d'expiration des sessions en secondes (ici, 14 jours)
    autoRemove: 'native', // Retire automatiquement les sessions expirées
        ttl: 60 * 60 * 24 * 14, // Durée de vie des sessions en secondes
      }),
      
    })
  );
};

module.exports = sessionConfig; // Exporte la fonction pour l'utiliser dans app.js
