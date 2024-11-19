const Formation = require("../database/models/formation.model");
const User = require('../database/models/user.model')
const mongoose = require('mongoose');


// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    console.log('Requête reçue pour récupérer toutes les formations');
    try {
        
        
        // Récupérer les formations sans métadonnées supplémentaires de Mongoose
        const formations = await Formation.find().lean();  // .lean() retourne un objet JavaScript pur
        
        // Vérifier si la réponse a déjà été envoyée
        if (!res.headersSent) {
            return res.json(formations);  // Renvoie les formations en JSON
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        
        // Vérifier si la réponse a déjà été envoyée
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des formations' });
        }
    }
};

// Récupérer une formation par ID
exports.getFormationById = async (req, res) => {
    const formationId = req.params.id;
    
    try {
        
        // Utilisez _id pour chercher par ID MongoDB
        const formation = await Formation.findById(formationId);
       

        if (formation) {
            return res.json(formation); // Utilisation de return pour empêcher toute réponse suivante
        } else {
            return res.status(404).json({ message: 'Formation non trouvée' }); // Utilisation de return
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la formation :", error);
        return res.status(500).json({ message: 'Erreur lors de la récupération de la formation', error }); // Utilisation de return
    }
};


exports.inscrireAFormation = async (req, res) => {
    const { formationId } = req.params; // Récupérer l'ID de la formation depuis les paramètres de l'URL
    const userId = req.user?._id; // Supposons que l'ID de l'utilisateur est stocké dans req.user après l'authentification

    try {
        // Vérification de l'existence de l'utilisateur
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        // Vérifier si la formation existe
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({ message: "Formation non trouvée." });
        }

        // Vérifier si le tableau participants est défini et si l'utilisateur y est déjà inscrit
        if (formation.participants && formation.participants.includes(userId)) {
            return res.status(200).json({ message: "Vous êtes déjà inscrit à cette formation. Accès autorisé." });
        }

        // Ajouter l'utilisateur à la liste des participants
        formation.participants = formation.participants || []; // Initialiser si indéfini
        formation.participants.push(userId);
        await formation.save();

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Ajouter la formation au tableau des formations de l'utilisateur
        user.local.formations = user.local.formations || []; // Initialiser si indéfini
        if (!user.local.formations.includes(formationId)) {
            user.local.formations.push(formationId);
        }
        await user.save();

        return res.status(200).json({ message: "Inscription réussie à la formation." });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};





// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
    const { formationId } = req.params;

    try {
        console.log('Formation ID:', formationId); // Log de l'ID de la formation
        const formation = await Formation.findOne({ _id: formationId });

        if (!formation) {
            console.log('Formation non trouvée'); // Log si la formation n'est pas trouvée
            return res.status(404).json({ error: "Formation non trouvée" });
        }

        console.log('Modules récupérés:', formation.modules); // Log des modules récupérés
        return res.json(formation.modules);
    } catch (error) {
        console.error('Erreur lors de la récupération des modules:', error); // Log de l'erreur
        return res.status(500).json({ error: "Erreur lors de la récupération des modules" });
    }
};








// Récupérer le contenu d'un module spécifique
exports.getModuleContent = async (req, res) => {
    const { formationId, moduleId } = req.params;

    try {
        const formation = await Formation.findOne({ _id: formationId, "modules._id": moduleId });

        if (!formation) {
            return res.status(404).json({ error: "Formation non trouvée pour le module spécifié" }); // Utilisation de return
        }

        const module = formation.modules.find(mod => mod._id.toString() === moduleId);
        if (!module) {
            return res.status(404).json({ error: "Module non trouvé" }); // Utilisation de return
        }

        return res.json({
            title: module.nom,
            description: module.contenu.cours,
            video: module.contenu.video,
            quiz: module.contenu.quiz
        }); // Utilisation de return
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de la récupération du contenu du module" }); // Utilisation de return
    }
};

// in your controller.formation.js file
exports.getLessonOnline = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('local.formations');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const currentFormation = user.local.formations.find(formation => formation.participants.includes(userId));
  
      if (!currentFormation) {
        return res.status(404).json({ message: 'User is not enrolled in any formation' });
      }
  
      res.render('protected', { user, currentFormation });
    } catch (error) {
      console.error('Error getting lesson online:', error);
      return res.status(500).json({ message: 'Error getting lesson online' });
    }
  };




  exports.getNextModule = async (req, res) => {
    try {
        const { formationId, currentModuleId } = req.params;
        console.log('Formation ID reçu:', formationId); // Log des paramètres
        console.log('Module actuel ID reçu:', currentModuleId); // Log des paramètres

        // Vérification si l'ID de la formation est valide
        if (!mongoose.Types.ObjectId.isValid(formationId)) {
            console.error('formationId invalide:', formationId); // Log si l'ID de formation est invalide
            return res.status(400).json({ message: 'formationId invalide' });
        }

        // Récupérer la formation
        const formation = await Formation.findById(formationId).populate('modules');
        if (!formation) {
            console.error('Formation non trouvée pour ID:', formationId); // Log si la formation n'est pas trouvée
            return res.status(404).json({ message: 'Formation non trouvée' });
        }

        // Trouver le module actuel
        const currentModule = formation.modules.find(module => module.moduleId === currentModuleId);
        if (!currentModule) {
            console.error('Module non trouvé pour ID:', currentModuleId); // Log si le module actuel n'est pas trouvé
            return res.status(404).json({ message: 'Module non trouvé' });
        }

        // Trouver le prochain module
        const currentIndex = formation.modules.indexOf(currentModule);
        const nextModule = formation.modules[currentIndex + 1];
        if (!nextModule) {
            console.error('Aucun module suivant trouvé pour le module:', currentModuleId); // Log si aucun module suivant n'est trouvé
            return res.status(404).json({ message: 'Aucun module suivant' });
        }

        // Retourner le prochain module
        res.status(200).json(nextModule);
    } catch (error) {
        console.error('Erreur lors de la récupération du module suivant:', error); // Log d'erreur général
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

