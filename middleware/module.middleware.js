const User = require("../database/models/user.model");
const Formation = require("../database/models/formation.model");

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
