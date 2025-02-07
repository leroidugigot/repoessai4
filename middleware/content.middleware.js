const validateProgressData = (req, res, next) => {
  const { type, value, readingTime, scrollPercentage, progress, answers } =
    req.body;

  // Validation pour la progression générale
  if (req.path.includes("/progress")) {
    if (!type || !["video", "reading", "quiz"].includes(type)) {
      return res.status(400).json({ message: "Type de progression invalide" });
    }
    if (typeof value !== "number" || value < 0) {
      return res
        .status(400)
        .json({ message: "Valeur de progression invalide" });
    }
    if ((type === "video" || type === "quiz") && value > 100) {
      return res
        .status(400)
        .json({ message: "La valeur ne peut pas dépasser 100%" });
    }
  }

  // Validation pour la progression vidéo
  else if (req.path.includes("video-progress")) {
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "La progression vidéo doit être un nombre entre 0 et 100",
      });
    }
  }

  // Validation pour la progression de lecture
  else if (req.path.includes("reading-progress")) {
    if (typeof readingTime !== "number" || readingTime < 0) {
      return res.status(400).json({
        message: "Le temps de lecture doit être un nombre positif",
      });
    }
    if (
      typeof scrollPercentage !== "number" ||
      scrollPercentage < 0 ||
      scrollPercentage > 100
    ) {
      return res.status(400).json({
        message:
          "Le pourcentage de défilement doit être un nombre entre 0 et 100",
      });
    }
  }

  // Validation pour les réponses du quiz
  else if (req.path.includes("validate-quiz")) {
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Les réponses doivent être fournies sous forme de tableau",
      });
    }
    if (answers.some((answer) => typeof answer !== "number")) {
      return res.status(400).json({
        message: "Toutes les réponses doivent être des nombres",
      });
    }
  }

  next();
};

const validateIds = (req, res, next) => {
  const { formationId, moduleId } = req.params;

  if (!formationId || !moduleId) {
    return res.status(400).json({
      message: "Les identifiants de formation et de module sont requis",
    });
  }

  // Validation du format MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(formationId) || !objectIdRegex.test(moduleId)) {
    return res.status(400).json({
      message: "Format d'identifiant invalide",
    });
  }

  next();
};

module.exports = {
  validateProgressData,
  validateIds,
};
