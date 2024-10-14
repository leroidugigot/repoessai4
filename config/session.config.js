const session = require('express-session');
const MongoStore = require('connect-mongo');
const { clientPromise } = require('../database'); // clientPromise vient du fichier de connexion
const mongoose = require('mongoose'); // Import de mongoose
const { app } = require('../app');
require('dotenv').config();

// Middleware pour gérer les erreurs de connexion
const handleMongoConnection = async () => {
  try {
    await clientPromise; // Attendre que la promesse se résolve
    console.log('Connexion à MongoDB est recu dans session.config.');
    
    // Assurez-vous que mongoose.connection est valide
    const client = mongoose.connection.getClient();
    
    if (!client) {
      console.error('Le client MongoDB est indéfini. Vérifiez la connexion.');
      throw new Error('Client MongoDB est indéfini');
    }
    
    return client; // Retourner le client MongoDB
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB:', error);
    throw error; // Relancer l'erreur pour éviter que l'application ne continue
  }
};

const sessionSecret = process.env.SESSION_SECRET;


app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // Durée de vie du cookie de session : 1 heure avec deconnection
    },
    store: MongoStore.create({
      clientPromise: handleMongoConnection(), // Fonction pour gérer la connexion à MongoDB
      dbName: 'test', // Assurez-vous de spécifier le nom de la base de données
      ttl: 60 * 60 * 24 * 365, // Durée de vie de la session dans le store : 1 an avant effacement donnee de l'user de la bdd
    }),
  })
);

// Log pour vérifier que la session est correctement configurée
app.use((req, res, next) => { 
  console.log('Contenu de la session:', req.session);
  next();
});
// Log d'erreur pour la session
app.use((err, req, res, next) => {
  console.error('Erreur dans le middleware de session:', err);
  res.status(500).send('Une erreur est survenue');
});

// Log pour suivre l'état de la connexion Mongoose
mongoose.connection.on('connected', () => {
  console.log('Mongoose est connecté à la base de données.');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose a été déconnecté de la base de données.');
});

mongoose.connection.on('error', (error) => {
  console.error('Erreur de connexion Mongoose:', error);
});
