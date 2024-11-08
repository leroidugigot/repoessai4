const Formation = require("../database/models/formation.model");

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find({}, { modules: 0 }); // Exclut les modules pour n'obtenir que les formations
        res.json(formations); // Renvoie les formations en format JSON
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des formations" });
    }
};

// formation.controller.js
exports.getFormationById = async (req, res) => {
    const formationId = req.params.id;

    try {
        // Utilisez _id pour chercher par ID MongoDB
        const formation = await Formation.findById(formationId);

        if (formation) {
            res.json(formation);
        } else {
            res.status(404).json({ message: 'Formation non trouvée' });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la formation :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la formation', error });
    }
};






// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
    const { formationId } = req.params;

    try {
        const formation = await Formation.findOne({ _id: formationId }, { "modules.contenu": 0 }); // Exclut le contenu pour n'obtenir que les modules

        if (!formation) {
            return res.status(404).json({ error: "Formation non trouvée" });
        }

        res.json(formation.modules); // Renvoie les modules en format JSON
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des modules" });
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

        res.json({
            title: module.nom,
            description: module.contenu.cours,
            video: module.contenu.video,
            quiz: module.contenu.quiz
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du contenu du module" });
    }
};
