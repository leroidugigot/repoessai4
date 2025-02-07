exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // Vérifier si la requête attend une réponse JSON (API)
  if (req.xhr || req.path.startsWith("/api/")) {
    return res.status(401).json({
      message: "Authentification requise",
      redirectUrl: "/auth/signin/form",
    });
  }

  // Pour les requêtes normales, rediriger vers la page de connexion
  return res.redirect("/auth/signin/form");
};
