const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require("passport");
const { findUserPerEmail } = require("../queries/user.queries"); 


//verife
exports.signinForm = (req, res, next) => {
  res.render("signin", { error: null });
};


//verifié
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect('/protected');
      } else {
        res.render('signin', { error: 'Wrong password' });
      }
    } else {
      res.render('signin', { error: 'User not found' });
    }
  } catch(e) {
    next(e);
  }

}
   //authetification avec google passport.authtificate mais pas de bdd

   exports.sessionCreate = (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err); // Gérer les erreurs d'authentification
      } 
  
      if (!user) {
        return res.render("signin", { error: info.message }); // Utilisateur non trouvé ou mauvais mot de passe
      }
  
      // Si l'authentification est réussie
      // Générer un token JWT avec les infos utilisateur
      const token = jwt.sign({ id: user._id, email: user.email }, 'a2463421-b798-470a-b4ee-fd23783ec69d', { expiresIn: '1h' });
  
      // Stocker le token JWT dans un cookie sécurisé (optionnel, sinon utiliser Authorization header)
      res.cookie('jwt', token, {
        httpOnly: true, // Empêche l'accès au cookie via JavaScript (CSRF protection)
        secure: true,   // Utilise HTTPS (mettre à true en production)
        maxAge: 3600000 // Expire dans 1 heure
      });
  
      // Rediriger vers la page protégée
      return res.redirect('/protected');
    })(req, res, next);
  };


exports.sessionNew = (req, res, next) => {
  res.render('signin', { error: null });
};



exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  })(req, res, next);
};

exports.googleAuthCb = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: '/auth/signin/form',
  })(req, res, next);
};


exports.signout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
      return res.redirect('/'); 
    }

    // Réinitialiser les informations de connexion liées à Passport
    req.session.passport = null;

    // Détruire la session complète
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la destruction de la session:', err);
        return res.redirect('/'); // Redirection en cas d'erreur
      }
      
      res.clearCookie('connect.sid'); // Effacer le cookie de session côté client

      return res.redirect('/');
    });
  });
};

/*exports.signout = (req, res) => {
  req.logout((err) => {
      if (err) {
          return res.status(500).json({ message: 'Logout failed', error: err });
      }
      // Redirection ou réponse après la déconnexion réussie
      res.status(200).json({ message: 'Logged out successfully' });
  });
};
*/ 
