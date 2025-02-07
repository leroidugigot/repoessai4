const Formation = require("../database/models/formation.model");
const User = require("../database/models/user.model");

exports.inscrireAFormation = async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const existingFormationIndex = user.local.formations.findIndex(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (existingFormationIndex !== -1) {
      return res.status(200).json({
        message: "Vous êtes déjà inscrit à cette formation.",
        formation: user.local.formations[existingFormationIndex],
      });
    }

    user.local.formations.push({
      formation: formationId,
      progression: [],
    });

    if (!formation.participants.includes(userId)) {
      formation.participants.push(userId);
      await formation.save();
    }

    await user.save();
    return res.status(200).json({
      message: "Inscription réussie à la formation.",
      formation: user.local.formations[user.local.formations.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription.",
      error: error.message,
    });
  }
};
