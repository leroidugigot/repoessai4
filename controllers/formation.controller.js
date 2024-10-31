const Formation = require("../database/models/formation.model");

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find({}, { modules: 0 }); // Exclut les modules pour n'obtenir que les formations
        res.json(formations); // Renvoie les formations en format JSON
    } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des formations" });
    }
};

// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
    const { formationId } = req.params;
    console.log(`Récupération des modules pour la formation ID: ${formationId}`); // Log de l'ID de formation

    try {
        const formation = await Formation.findOne({ _id: formationId }, { "modules.contenu": 0 }); // Exclut le contenu pour n'obtenir que les modules
        console.log('Formation trouvée:', formation); // Log de la formation trouvée

        if (!formation) {
            console.error(`Formation non trouvée pour l'ID: ${formationId}`); // Log d'erreur
            return res.status(404).json({ error: "Formation non trouvée" });
        }

        res.json(formation.modules); // Renvoie les modules en format JSON
        console.log(`Modules renvoyés pour la formation ID ${formationId}:`, formation.modules); // Log des modules renvoyés
    } catch (error) {
        console.error("Erreur lors de la récupération des modules:", error); // Log d'erreur général
        res.status(500).json({ error: "Erreur lors de la récupération des modules" });
    }
};


// Récupérer le contenu d'un module spécifique
// Récupérer le contenu d'un module spécifique
// Récupérer le contenu d'un module spécifique
exports.getModuleContent = async (req, res) => {
    const { formationId, moduleId } = req.params; // Récupérer l'ID de la formation et du module
    console.log(`Récupération du contenu du module. Module ID: ${moduleId}`); // Log de l'ID de module

    try {
        const formation = await Formation.findOne({ _id: formationId, "modules._id": moduleId }); // Assurez-vous de rechercher avec l'ID de la formation

        if (!formation) {
            console.error(`Formation non trouvée pour le Module ID: ${moduleId}`); // Log d'erreur
            return res.status(404).json({ error: "Formation non trouvée pour le module spécifié" });
        }

        const module = formation.modules.find(mod => mod._id.toString() === moduleId);
        if (!module) {
            console.error(`Module non trouvé pour l'ID: ${moduleId}`); // Log d'erreur
            return res.status(404).json({ error: "Module non trouvé" });
        }

        res.json({
            title: module.nom,
            description: module.contenu.cours,
            video: module.contenu.video,
            quiz: module.contenu.quiz
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du contenu du module:", error);
        res.status(500).json({ error: "Erreur lors de la récupération du contenu du module" });
    }
};





