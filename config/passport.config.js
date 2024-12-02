require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserPerEmail, createUser } = require("../queries/user.queries");
const { createJwtToken } = require("./jwt.config");

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CONSUMER_KEY, // Utilisation de la clé client Google depuis .env
      clientSecret: process.env.GOOGLE_CONSUMER_SECRET, // Utilisation du secret client Google depuis .env
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Utilisation de l'URL de callback Google depuis .env
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await findUserPerEmail(email);

        if (user) {
          // Si l'utilisateur existe déjà, vérifiez si c'est un utilisateur Google
          if (!user.local.googleId) {
            // Mettre à jour l'utilisateur avec les infos Google
            user.local.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
          }
        } else {
          // Créer un nouvel utilisateur
          user = await createUser({
            username: profile.displayName,
            email: email, // Notez le changement ici
            googleId: profile.id, // Et ici
            avatar: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
