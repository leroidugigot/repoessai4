const Formation = require("../database/models/formation.model");
const User = require('../database/models/user.model');
const mongoose = require('mongoose');

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find().lean(); // .lean() retourne un objet JavaScript pur
        if (!res.headersSent) {
            return res.json(formations);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des formations' });
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
            return res.status(404).json({ message: 'Formation non trouvée' });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la formation :", error);
        return res.status(500).json({ message: 'Erreur lors de la récupération de la formation', error });
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

        const existingFormation = user.local.formations.find(f =>
            f.formation && f.formation.toString() === formationId
        );

        if (existingFormation) {
            return res.status(200).json({ message: "Vous êtes déjà inscrit à cette formation." });
        }

        user.local.formations.push({
            formation: formationId,
            progression: []
        });

        if (!formation.participants.includes(userId)) {
            formation.participants.push(userId);
            await formation.save();
        }

        await user.save();
        return res.status(200).json({ message: "Inscription réussie à la formation." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
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
        console.error('Erreur lors de la récupération des modules:', error);
        return res.status(500).json({ error: "Erreur lors de la récupération des modules" });
    }
};

// Récupérer le contenu d'un module spécifique
exports.getModuleContent = async (req, res) => {
    const { formationId, moduleId } = req.params;
    try {
        const formation = await Formation.findOne({ _id: formationId, "modules._id": moduleId });
        if (!formation) {
            return res.status(404).json({ error: "Formation non trouvée pour le module spécifié" });
        }

        const module = formation.modules.find(mod => mod._id.toString() === moduleId);
        if (!module) {
            return res.status(404).json({ error: "Module non trouvé" });
        }

        return res.json({
            title: module.nom,
            description: module.contenu.cours,
            video: module.contenu.video,
            quiz: module.contenu.quiz
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du contenu du module:", error);
        return res.status(500).json({ error: "Erreur lors de la récupération du contenu du module" });
    }
};

// Obtenir une leçon en ligne
exports.getLessonOnline = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('local.formations');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const currentFormation = user.local.formations.find(formation => formation.participants.includes(userId));
        if (!currentFormation) {
            return res.status(404).json({ message: 'Utilisateur non inscrit à une formation' });
        }

        res.render('protected', { user, currentFormation });
    } catch (error) {
        console.error('Erreur lors de la récupération de la leçon en ligne:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération de la leçon en ligne' });
    }
};


  // Obtenir le prochain module
  exports.getNextModule = async (req, res) => {
    console.log('[getNextModule] Fonction appelée avec req.params:', req.params);
    try {
        const { formationId, currentModuleId } = req.params;

        // Vérification si l'ID de la formation est valide
        if (!mongoose.Types.ObjectId.isValid(formationId)) {
            console.error('[getNextModule] formationId invalide:', formationId);
            return res.status(400).json({ message: 'formationId invalide' });
        }

        const formation = await Formation.findById(formationId).populate('modules');
        if (!formation) {
            console.error('[getNextModule] Formation non trouvée pour ID:', formationId);
            return res.status(404).json({ message: 'Formation non trouvée' });
        }

        const currentModule = formation.modules.find(module => module.moduleId === currentModuleId);
        if (!currentModule) {
            console.error('[getNextModule] Module non trouvé pour ID:', currentModuleId);
            return res.status(404).json({ message: 'Module non trouvé' });
        }

        const currentIndex = formation.modules.indexOf(currentModule);
        const nextModule = formation.modules[currentIndex + 1];
        if (!nextModule) {
            console.error('[getNextModule] Aucun module suivant pour le module:', currentModuleId);
            return res.status(404).json({ message: 'Aucun module suivant' });
        }

        console.log('[getNextModule] Prochain module trouvé:', nextModule);
        res.status(200).json(nextModule);
    } catch (error) {
        console.error('[getNextModule] Erreur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer un module comme complété
exports.completeModule = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;

  try {
      const user = await User.findById(userId);
      
      // Trouver l'index de la formation dans le tableau des formations de l'utilisateur
      const formationIndex = user.local.formations.findIndex(f => 
          f.formation && f.formation.toString() === formationId
      );

      if (formationIndex === -1) {
          return res.status(404).json({ message: "Formation non trouvée" });
      }

      // Vérifier si le module existe déjà dans la progression
      let moduleProgress = user.local.formations[formationIndex].progression.find(
          p => p.module && p.module.toString() === moduleId
      );

      if (moduleProgress) {
          moduleProgress.completed = true;
          moduleProgress.completedAt = new Date();
      } else {
          // Si le module n'existe pas dans la progression, l'ajouter
          user.local.formations[formationIndex].progression.push({
              module: moduleId,
              completed: true,
              completedAt: new Date()
          });
      }

      await user.save();
      res.json({ 
          message: "Module complété avec succès",
          progression: user.local.formations[formationIndex].progression
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
          console.log("[getProgression] Aucune formation trouvée pour l'utilisateur");
          return res.json([]); // Retourner un tableau vide si pas de formations
      }

      // Trouver la formation spécifique
      const userFormation = user.local.formations.find(f => 
          f.formation && f.formation.toString() === formationId
      );

      if (!userFormation) {
          console.log("[getProgression] Formation non trouvée pour l'utilisateur");
          // Créer une nouvelle entrée de formation pour l'utilisateur
          const newFormationEntry = {
              formation: formationId,
              progression: []
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
          error: error.message
      });
  }
};

// Obtenir le statut d'un module
exports.getModuleStatus = async (req, res) => {
  const { formationId, moduleId } = req.params;
  const userId = req.user._id;
  console.log("[getModuleStatus] Fonction appelée avec req.params:", req.params);

  try {
      const user = await User.findById(userId);
      console.log("[getModuleStatus] Utilisateur trouvé:", user);

      // Rechercher la formation dans le tableau des formations de l'utilisateur
      const formationProgress = user.local.formations.find(f => 
          f.formation && f.formation.toString() === formationId
      );

      if (!formationProgress) {
          return res.status(404).json({ message: "Formation non trouvée dans la progression" });
      }

      // Rechercher le module dans la progression
      const moduleProgress = formationProgress.progression.find(p => 
          p.module && p.module.toString() === moduleId
      );

      // Si aucune progression n'existe pour ce module, renvoyer un statut par défaut
      if (!moduleProgress) {
          return res.json({
              completed: false,
              completedAt: null,
              isLocked: true, // Par défaut, le module est verrouillé
              quizStatus: null
          });
      }

      // Renvoyer le statut complet du module
      res.json({
          completed: moduleProgress.completed,
          completedAt: moduleProgress.completedAt,
          isLocked: !moduleProgress.completed, // Le module est déverrouillé une fois complété
          quizStatus: moduleProgress.quiz
      });
  } catch (error) {
      console.log("[getModuleStatus] Erreur:", error);
      res.status(500).json({ message: "Erreur lors de la récupération du statut du module" });
  }
};


