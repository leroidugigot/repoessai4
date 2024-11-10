const Formation = require("../database/models/formation.model");

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    console.log('Requête reçue pour récupérer toutes les formations');
    try {
        
        
        // Récupérer les formations sans métadonnées supplémentaires de Mongoose
        const formations = await Formation.find().lean();  // .lean() retourne un objet JavaScript pur
        console.log(formations);
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

// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
    const { formationId } = req.params;

    try {
        const formation = await Formation.findOne({ _id: formationId }, { "modules.contenu": 0 }); // Exclut le contenu pour n'obtenir que les modules

        if (!formation) {
            return res.status(404).json({ error: "Formation non trouvée" }); // Utilisation de return
        }

        return res.json(formation.modules); // Renvoie les modules en format JSON, utilisation de return
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de la récupération des modules" }); // Utilisation de return
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
