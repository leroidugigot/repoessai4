exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Non autorisé" });
};

exports.validateModuleAccess = async (req, res, next) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié" });
  }

  try {
    const user = await User.findById(userId);
    const formation = user.local.formations.find(
      (f) => f.formation.toString() === formationId
    );

    if (!formation) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas inscrit à cette formation" });
    }

    // Vérifier si le module précédent est complété
    const moduleIndex = formation.progression.findIndex(
      (p) => p.module.toString() === moduleId
    );

    if (moduleIndex > 0) {
      const previousModule = formation.progression[moduleIndex - 1];
      if (!previousModule?.completed) {
        return res
          .status(403)
          .json({ message: "Vous devez compléter le module précédent" });
      }
    }

    next();
  } catch (error) {
    console.error("Erreur lors de la validation de l'accès au module:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.validateProgressData = (req, res, next) => {
  const { type, value } = req.body;

  if (!type || !["video", "reading", "quiz"].includes(type)) {
    return res.status(400).json({ message: "Type de progression invalide" });
  }

  if (typeof value !== "number" || value < 0) {
    return res.status(400).json({ message: "Valeur de progression invalide" });
  }

  if ((type === "video" || type === "quiz") && value > 100) {
    return res
      .status(400)
      .json({ message: "La valeur ne peut pas dépasser 100%" });
  }

  next();
};
