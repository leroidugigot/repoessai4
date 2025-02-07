const Formation = require("../database/models/formation.model");
const User = require("../database/models/user.model");

exports.getModulesByFormation = async (req, res) => {
  const { formationId } = req.params;
  try {
    const formation = await Formation.findOne({ _id: formationId });
    if (!formation) {
      return res.status(404).json({ error: "Formation non trouvée" });
    }
    return res.json(formation.modules);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des modules" });
  }
};

exports.getModuleContent = async (req, res) => {
  const { formationId, moduleId } = req.params;
  try {
    const formation = await Formation.findOne({
      _id: formationId,
      "modules._id": moduleId,
    });

    if (!formation) {
      return res
        .status(404)
        .json({ error: "Formation non trouvée pour le module spécifié" });
    }

    const module = formation.modules.find(
      (mod) => mod._id.toString() === moduleId
    );

    if (!module) {
      return res.status(404).json({ error: "Module non trouvé" });
    }

    return res.json({
      title: module.nom,
      description: module.contenu.cours,
      video: module.contenu.video,
      quiz: module.contenu.quiz,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération du contenu du module" });
  }
};

exports.getModuleStatus = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    const formationProgress = user.local.formations.find(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (!formationProgress) {
      return res.json({ isLocked: true });
    }

    const currentModuleIndex = formation.modules.findIndex(
      (m) => m._id.toString() === moduleId
    );

    if (currentModuleIndex === -1) {
      return res.status(404).json({ message: "Module non trouvé" });
    }

    let isLocked =
      currentModuleIndex === 0
        ? false
        : !formationProgress.progression.find(
            (p) =>
              p.module &&
              p.module.toString() ===
                formation.modules[currentModuleIndex - 1]._id.toString() &&
              p.completed
          );

    const moduleProgress = formationProgress.progression.find(
      (p) => p.module && p.module.toString() === moduleId
    );

    res.json({
      isLocked,
      completed: moduleProgress?.completed || false,
      videoWatched: moduleProgress?.videoWatched || false,
      timeSpentReading: moduleProgress?.timeSpentReading || false,
      quizStatus: moduleProgress?.quiz || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
