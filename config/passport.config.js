require('dotenv').config();  // Charge les variables d'environnement depuis le fichier .env
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findUserPerEmail, createUser } = require('../queries/user.queries');
const { createJwtToken } = require('./jwt.config');


// Configure Google OAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CONSUMER_KEY,  // Utilisation de la clé client Google depuis .env
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,  // Utilisation du secret client Google depuis .env
    callbackURL: process.env.GOOGLE_CALLBACK_URL,  // Utilisation de l'URL de callback Google depuis .env
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await findUserPerEmail(email);

    if (!user) {
      // Si l'utilisateur n'existe pas, création d'un nouvel utilisateur avec les données Google
      user = await createUser({
        username: profile.displayName,
        email: email,
        googleId: profile.id,  // Stocke l'ID Google
        avatar: profile.photos[0].value  // Stocke l'avatar Google
      });
    }

    // Générer un token JWT pour l'utilisateur
    const token = createJwtToken({ user });

    // Passe uniquement l'utilisateur à Passport (et non l'objet { user, token })
    return done(null, user);  // Appel correct de la fonction done
  } catch (error) {
    return done(error);  // Passe l'erreur à Passport
  }
}));

module.exports = passport;
