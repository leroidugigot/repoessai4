const session = require('express-session');
const MongoStore = require('connect-mongo');
const { clientPromise } = require('../database'); // clientPromise vient du fichier de connexion
const mongoose = require('mongoose'); // Import de mongoose
const { app } = require('../app');

app.use(
  session({
    secret: 'cersei',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // session de 14 jours
    },
    store: MongoStore.create({
      clientPromise: clientPromise.then(() => mongoose.connection.getClient()), // Correction ici
      ttl: 60 * 60 * 24 * 14, // session de 14 jours
    }),
  })
);
