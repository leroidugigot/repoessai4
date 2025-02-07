const User = require("../database/models/user.model");

exports.getProgression = async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user.local.formations || user.local.formations.length === 0) {
      return res.json([]);
    }

    const userFormation = user.local.formations.find(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (!userFormation) {
      const newFormationEntry = {
        formation: formationId,
        progression: [],
      };
      user.local.formations.push(newFormationEntry);
      await user.save();
      return res.json([]);
    }

    return res.json(userFormation.progression || []);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de la progression",
      error: error.message,
    });
  }
};

exports.saveProgress = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { type, value } = req.body;
  const userId = req.user._id;

  try {
    // Validation des données
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let formationIndex = user.local.formations.findIndex(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      user.local.formations.push({
        formation: formationId,
        progression: [],
      });
      formationIndex = user.local.formations.length - 1;
    }

    let moduleProgressIndex = user.local.formations[
      formationIndex
    ].progression.findIndex(
      (p) => p.module && p.module.toString() === moduleId
    );

    if (moduleProgressIndex === -1) {
      user.local.formations[formationIndex].progression.push({
        module: moduleId,
        completed: false,
        videoWatched: false,
        timeSpentReading: false,
        quiz: { passed: false, score: 0, attempts: 0 },
        startedAt: new Date(),
      });
      moduleProgressIndex =
        user.local.formations[formationIndex].progression.length - 1;
    }

    let moduleProgress =
      user.local.formations[formationIndex].progression[moduleProgressIndex];

    // Mise à jour de la progression selon le type
    switch (type) {
      case "video":
        moduleProgress.videoProgress = value;
        moduleProgress.videoWatched = value >= 70;
        moduleProgress.lastVideoProgress = new Date();
        break;
      case "reading":
        moduleProgress.readingTime = value;
        moduleProgress.timeSpentReading = value >= 180;
        moduleProgress.lastReadingProgress = new Date();
        break;
      case "quiz":
        moduleProgress.quiz = {
          passed: value === 100,
          score: value,
          attempts: (moduleProgress.quiz?.attempts || 0) + 1,
          lastAttempt: new Date(),
        };
        break;
    }

    // Vérification de la complétion du module
    moduleProgress.completed =
      (moduleProgress.videoWatched || false) &&
      (moduleProgress.timeSpentReading || false) &&
      (moduleProgress.quiz?.passed || false);

    if (moduleProgress.completed && !moduleProgress.completedAt) {
      moduleProgress.completedAt = new Date();
    }

    await user.save();

    return res.json({
      message: "Progression sauvegardée avec succès",
      progress: moduleProgress,
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
    return res.status(500).json({
      message: "Erreur lors de la sauvegarde de la progression",
      error: error.message,
    });
  }
};
