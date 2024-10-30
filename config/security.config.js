exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next(); // Si l'utilisateur est authentifié, passe au middleware suivant
  } else {
      // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
      return res.redirect('/auth/signin/form'); // Redirection vers la page de connexion
  }
};
