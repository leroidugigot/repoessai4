const passport = require('passport');
const { app } = require('../app'); // Assurez-vous que app est exporté correctement depuis app.js
const User = require('../database/models/user.model');

const YahooStrategy = require('passport-yahoo-oauth2').Strategy; // Assurez-vous d'installer cette dépendance
const {
  findUserPerEmail,
  findUserPerYahooId, // Remplacez par une fonction qui recherche par Yahoo ID
} = require('../queries/user.queries');
const util = require('util');

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Désérialisation de l'utilisateur de la session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

// Configuration de la stratégie Yahoo
passport.use(
  'yahoo',
  new YahooStrategy(
    {
      consumerKey: "dj0yJmk9bldyTVJrSUNWYU0wJmQ9WVdrOVpraFpUMlpYWTFnbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWQz", // Votre clé client Yahoo
      consumerSecret: "848c081d3c54d78b0d76e10949fed340fcdea54d", // Votre secret client Yahoo
      callbackURL: "/auth/yahoo/cb", // L'URL de rappel à utiliser après l'authentification
    },
    async (accessToken, refreshToken, profile, done) => {
      // Log du profil pour déboguer (optionnel)
      // console.log(util.inspect(profile, { compact: true, depth: 5, breakLength: 80 }));
      try {
        const user = await findUserPerYahooId(profile.id); // Recherche par Yahoo ID
        if (user) {
          done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            local: {
              yahooId: profile.id, // Assurez-vous que le modèle d'utilisateur prend en charge yahooId
              email: profile.emails[0].value,
            },
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);
