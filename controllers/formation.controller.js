const Formation = require("../database/models/formation.model");
const User = require("../database/models/user.model");
const mongoose = require("mongoose");

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.find().lean(); // .lean() retourne un objet JavaScript pur
    if (!res.headersSent) {
      return res.json(formations);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des formations:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Erreur serveur lors de la récupération des formations",
      });
    }
  }
};

// Récupérer une formation par ID
exports.getFormationById = async (req, res) => {
  const formationId = req.params.id;
  try {
    const formation = await Formation.findById(formationId);
    if (formation) {
      return res.json(formation);
    } else {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la formation :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la formation",
      error,
    });
  }
};

// Inscrire un utilisateur à une formation
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

    // Check if the formation already exists in user's formations
    const existingFormationIndex = user.local.formations.findIndex(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (existingFormationIndex !== -1) {
      return res.status(200).json({
        message: "Vous êtes déjà inscrit à cette formation.",
        formation: user.local.formations[existingFormationIndex],
      });
    }

    // Add new formation only if it doesn't exist
    user.local.formations.push({
      formation: formationId,
      progression: [],
    });

    // Add user to formation participants if not already included
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
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription.",
      error: error.message,
    });
  }
};

// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
  const { formationId } = req.params;
  try {
    const formation = await Formation.findOne({ _id: formationId });
    if (!formation) {
      return res.status(404).json({ error: "Formation non trouvée" });
    }
    return res.json(formation.modules);
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des modules" });
  }
};

// Récupérer le contenu d'un module spécifique
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
    console.error(
      "Erreur lors de la récupération du contenu du module:",
      error
    );
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération du contenu du module" });
  }
};

// Obtenir une leçon en ligne
exports.getLessonOnline = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("local.formations");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const currentFormation = user.local.formations.find((formation) =>
      formation.participants.includes(userId)
    );
    if (!currentFormation) {
      return res
        .status(404)
        .json({ message: "Utilisateur non inscrit à une formation" });
    }

    res.render("protected", { user, currentFormation });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la leçon en ligne:",
      error
    );
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la leçon en ligne" });
  }
};

// Obtenir le prochain module
exports.getNextModule = async (req, res) => {
  console.log("[getNextModule] Fonction appelée avec req.params:", req.params);
  try {
    const { formationId, currentModuleId } = req.params;

    // Vérification si l'ID de la formation est valide
    if (!mongoose.Types.ObjectId.isValid(formationId)) {
      console.error("[getNextModule] formationId invalide:", formationId);
      return res.status(400).json({ message: "formationId invalide" });
    }

    const formation = await Formation.findById(formationId).populate("modules");
    if (!formation) {
      console.error(
        "[getNextModule] Formation non trouvée pour ID:",
        formationId
      );
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    const currentModule = formation.modules.find(
      (module) => module.moduleId === currentModuleId
    );
    if (!currentModule) {
      console.error(
        "[getNextModule] Module non trouvé pour ID:",
        currentModuleId
      );
      return res.status(404).json({ message: "Module non trouvé" });
    }

    const currentIndex = formation.modules.indexOf(currentModule);
    const nextModule = formation.modules[currentIndex + 1];
    if (!nextModule) {
      console.error(
        "[getNextModule] Aucun module suivant pour le module:",
        currentModuleId
      );
      return res.status(404).json({ message: "Aucun module suivant" });
    }

    console.log("[getNextModule] Prochain module trouvé:", nextModule);
    res.status(200).json(nextModule);
  } catch (error) {
    console.error("[getNextModule] Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Marquer un module comme complété
exports.completeModule = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Trouver l'index de la formation dans le tableau des formations de l'utilisateur
    const formationIndex = user.local.formations.findIndex(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (formationIndex === -1) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    // Vérifier si le module existe déjà dans la progression
    let moduleProgress = user.local.formations[formationIndex].progression.find(
      (p) => p.module && p.module.toString() === moduleId
    );

    if (moduleProgress) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = new Date();
    } else {
      // Si le module n'existe pas dans la progression, l'ajouter
      user.local.formations[formationIndex].progression.push({
        module: moduleId,
        completed: true,
        completedAt: new Date(),
      });
    }

    await user.save();
    res.json({
      message: "Module complété avec succès",
      progression: user.local.formations[formationIndex].progression,
    });
  } catch (error) {
    console.error("Erreur lors de la completion du module:", error);
    res.status(500).json({ message: "Erreur lors de la completion du module" });
  }
};

// Obtenir la progression d'une formation
exports.getProgression = async (req, res) => {
  const { formationId } = req.params;
  const userId = req.user._id;
  console.log("[getProgression] Fonction appelée avec req.params:", req.params);
  console.log("[getProgression] User ID:", userId);

  try {
    // Rechercher l'utilisateur et populer les formations
    const user = await User.findById(userId);
    console.log("[getProgression] Utilisateur trouvé:", user);

    // Vérifier si l'utilisateur a des formations
    if (!user.local.formations || user.local.formations.length === 0) {
      console.log(
        "[getProgression] Aucune formation trouvée pour l'utilisateur"
      );
      return res.json([]); // Retourner un tableau vide si pas de formations
    }

    // Trouver la formation spécifique
    const userFormation = user.local.formations.find(
      (f) => f.formation && f.formation.toString() === formationId
    );

    if (!userFormation) {
      console.log("[getProgression] Formation non trouvée pour l'utilisateur");
      // Créer une nouvelle entrée de formation pour l'utilisateur
      const newFormationEntry = {
        formation: formationId,
        progression: [],
      };

      // Ajouter la nouvelle formation à l'utilisateur
      user.local.formations.push(newFormationEntry);
      await user.save();

      return res.json([]); // Retourner un tableau vide pour la nouvelle formation
    }

    // S'assurer que la progression existe
    const progression = userFormation.progression || [];
    console.log("[getProgression] Progression trouvée:", progression);

    return res.json(progression);
  } catch (error) {
    console.error("[getProgression] Erreur:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la progression",
      error: error.message,
    });
  }
};
// Sauvegarder la progression d'un module
// Dans formation.controller.js, modifier la fonction saveProgress :

exports.saveProgress = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const { type, value } = req.body;
  const userId = req.user._id;

  console.log("[saveProgress] Requête reçue:", {
    formationId,
    moduleId,
    type,
    value,
  });
  console.log("[saveProgress] ID Utilisateur:", userId);

  try {
    // Vérifier que les IDs sont valides
    console.log("[saveProgress] Vérification des IDs", {
      isFormationValid: mongoose.Types.ObjectId.isValid(formationId),
      isModuleValid: mongoose.Types.ObjectId.isValid(moduleId),
    });

    if (
      !mongoose.Types.ObjectId.isValid(formationId) ||
      !mongoose.Types.ObjectId.isValid(moduleId)
    ) {
      console.log("[saveProgress] IDs invalides détectés");
      return res
        .status(400)
        .json({ message: "IDs de formation ou module invalides" });
    }

    const user = await User.findById(userId);
    console.log("[saveProgress] Recherche utilisateur:", { userFound: !!user });

    if (!user) {
      console.log("[saveProgress] Utilisateur non trouvé:", userId);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Trouver l'index de la formation
    let formationIndex = user.local.formations.findIndex(
      (f) => f.formation && f.formation.toString() === formationId
    );
    console.log("[saveProgress] Recherche formation:", {
      formationIndex,
      formationFound: formationIndex !== -1,
    });

    // Si la formation n'existe pas dans la progression de l'utilisateur, l'ajouter
    if (formationIndex === -1) {
      console.log("[saveProgress] Création nouvelle formation:", formationId);
      user.local.formations.push({
        formation: new mongoose.Types.ObjectId(formationId),
        progression: [],
      });
      formationIndex = user.local.formations.length - 1;
    }

    // Trouver l'index du module dans la progression
    let moduleProgressIndex = user.local.formations[
      formationIndex
    ].progression.findIndex(
      (p) => p.module && p.module.toString() === moduleId
    );
    console.log("[saveProgress] Recherche module:", {
      moduleProgressIndex,
      moduleFound: moduleProgressIndex !== -1,
    });

    // Si le module n'existe pas dans la progression, l'ajouter
    if (moduleProgressIndex === -1) {
      console.log("[saveProgress] Création nouveau module:", moduleId);
      user.local.formations[formationIndex].progression.push({
        module: new mongoose.Types.ObjectId(moduleId),
        completed: false,
        quiz: {
          passed: false,
          score: 0,
          attempts: 0,
        },
      });
      moduleProgressIndex =
        user.local.formations[formationIndex].progression.length - 1;
    }

    // Référence à la progression du module
    let moduleProgress =
      user.local.formations[formationIndex].progression[moduleProgressIndex];
    console.log("[saveProgress] État actuel du module:", moduleProgress);

    // Mettre à jour la progression selon le type
    console.log("[saveProgress] Mise à jour type:", { type, value });

    switch (type) {
      case "video":
        moduleProgress.videoWatched = value >= 70;
        console.log("[saveProgress] Mise à jour vidéo:", {
          videoWatched: moduleProgress.videoWatched,
        });
        break;
      case "reading":
        moduleProgress.timeSpentReading = value >= 30;
        console.log("[saveProgress] Mise à jour lecture:", {
          timeSpentReading: moduleProgress.timeSpentReading,
        });
        break;
      case "quiz":
        moduleProgress.quiz = {
          passed: value === 100,
          score: value,
          attempts: (moduleProgress.quiz?.attempts || 0) + 1,
        };
        console.log("[saveProgress] Mise à jour quiz:", moduleProgress.quiz);
        break;
    }

    // Vérifier si toutes les conditions sont remplies
    moduleProgress.completed =
      (moduleProgress.videoWatched || false) &&
      (moduleProgress.timeSpentReading || false) &&
      (moduleProgress.quiz?.passed || false);

    console.log("[saveProgress] Vérification completion:", {
      videoWatched: moduleProgress.videoWatched || false,
      timeSpentReading: moduleProgress.timeSpentReading || false,
      quizPassed: moduleProgress.quiz?.passed || false,
      isCompleted: moduleProgress.completed,
    });

    if (moduleProgress.completed && !moduleProgress.completedAt) {
      moduleProgress.completedAt = new Date();
      console.log(
        "[saveProgress] Module complété:",
        moduleProgress.completedAt
      );
    }

    // Sauvegarder les modifications
    console.log("[saveProgress] Tentative de sauvegarde...");
    await user.save();
    console.log("[saveProgress] Sauvegarde réussie");

    return res.json({
      message: "Progression sauvegardée avec succès",
      progress: moduleProgress,
    });
  } catch (error) {
    console.error("[saveProgress] Erreur:", error);
    return res.status(500).json({
      message: "Erreur lors de la sauvegarde de la progression",
      error: error.message,
    });
  }
};
exports.getModuleStatus = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  // Logs initiaux améliorés
  console.log("[getModuleStatus] Requête reçue avec params:", {
    params: req.params,
    formationId,
    moduleId,
    isModuleIdNull: moduleId === null,
    isModuleIdUndefined: moduleId === undefined,
  });
  console.log("[getModuleStatus] ID utilisateur:", userId);

  // Validation précoce
  if (!moduleId || moduleId === "null") {
    console.error("[getModuleStatus] ModuleId invalide détecté", { moduleId });
    return res.status(400).json({ message: "ID de module invalide" });
  }

  try {
    const user = await User.findById(userId);
    console.log("[getModuleStatus] Utilisateur trouvé:", {
      found: !!user,
      userId,
      hasFormations: user?.local?.formations?.length > 0,
    });

    const formation = await Formation.findById(formationId);
    console.log("[getModuleStatus] Formation trouvée:", {
      found: !!formation,
      formationId,
      moduleCount: formation?.modules?.length,
    });

    if (!formation) {
      console.error("[getModuleStatus] Formation non trouvée", { formationId });
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    const formationProgress = user.local.formations.find(
      (f) => f.formation && f.formation.toString() === formationId
    );
    console.log("[getModuleStatus] Progression de la formation:", {
      found: !!formationProgress,
      formationId,
      progressionCount: formationProgress?.progression?.length,
    });

    if (!formationProgress) {
      console.log("[getModuleStatus] Formation non trouvée ou verrouillée.");
      return res.json({ isLocked: true });
    }

    const currentModuleIndex = formation.modules.findIndex(
      (m) => m._id.toString() === moduleId
    );
    console.log("[getModuleStatus] Index du module actuel:", {
      moduleId,
      currentModuleIndex,
      isFound: currentModuleIndex !== -1,
    });

    if (currentModuleIndex === -1) {
      console.error("[getModuleStatus] Module non trouvé dans la formation", {
        moduleId,
      });
      return res.status(404).json({ message: "Module non trouvé" });
    }

    let isLocked = true;
    if (currentModuleIndex === 0) {
      console.log("[getModuleStatus] Premier module, pas verrouillé.");
      isLocked = false;
    } else {
      const previousModule = formation.modules[currentModuleIndex - 1];
      console.log("[getModuleStatus] Module précédent:", {
        moduleId: previousModule._id,
        index: currentModuleIndex - 1,
      });

      const previousModuleProgress = formationProgress.progression.find(
        (p) => p.module && p.module.toString() === previousModule._id.toString()
      );
      console.log("[getModuleStatus] Progression du module précédent:", {
        found: !!previousModuleProgress,
        completed: previousModuleProgress?.completed,
      });
      isLocked = !previousModuleProgress?.completed;
    }

    const moduleProgress = formationProgress.progression.find(
      (p) => p.module && p.module.toString() === moduleId
    );
    console.log("[getModuleStatus] Progression du module actuel:", {
      found: !!moduleProgress,
      moduleId,
      progress: {
        completed: moduleProgress?.completed || false,
        videoWatched: moduleProgress?.videoWatched || false,
        timeSpentReading: moduleProgress?.timeSpentReading || false,
        quizStatus: moduleProgress?.quiz || null,
      },
    });

    res.json({
      isLocked,
      completed: moduleProgress?.completed || false,
      videoWatched: moduleProgress?.videoWatched || false,
      timeSpentReading: moduleProgress?.timeSpentReading || false,
      quizStatus: moduleProgress?.quiz || null,
    });
  } catch (error) {
    console.error("[getModuleStatus] Erreur détaillée:", {
      message: error.message,
      stack: error.stack,
      params: { formationId, moduleId, userId },
    });
    res.status(500).json({ message: "Erreur serveur" });
  }
};
