const Formation = require("../database/models/formation.model");
const mongoose = require("mongoose");

exports.getNextModule = async (req, res) => {
  try {
    const { formationId, currentModuleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({ message: "formationId invalide" });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    // Trouver l'index du module actuel en utilisant _id
    const currentIndex = formation.modules.findIndex(
      (module) => module._id.toString() === currentModuleId
    );

    if (currentIndex === -1) {
      return res.status(404).json({ message: "Module non trouvé" });
    }

    // Vérifier s'il y a un module suivant
    if (currentIndex + 1 >= formation.modules.length) {
      return res.status(404).json({ message: "Aucun module suivant" });
    }

    // Retourner le module suivant
    const nextModule = formation.modules[currentIndex + 1];
    res.status(200).json(nextModule);
  } catch (error) {
    console.error("Erreur dans getNextModule:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
