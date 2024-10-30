// controllers/formation.controller.js
const Formation = require("../database/models/formation.model");

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find({}, { modules: 0 }); // Exclut les modules pour n'obtenir que les formations
        res.status(200).json(formations);
    } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des formations" });
    }
};

// Récupérer les modules d'une formation spécifique
exports.getModulesByFormation = async (req, res) => {
    const { formationId } = req.params;
    try {
        const formation = await Formation.findOne({ formationId }, { "modules.contenu": 0 }); // Exclut le contenu pour n'obtenir que les modules
        if (!formation) return res.status(404).json({ error: "Formation non trouvée" });
        
        res.status(200).json(formation.modules);
    } catch (error) {
        console.error("Erreur lors de la récupération des modules:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des modules" });
    }
};

// Récupérer le contenu d'un module spécifique
exports.getModuleContent = async (req, res) => {
    const { formationId, moduleId } = req.params;
    try {
        const formation = await Formation.findOne({ formationId });
        if (!formation) return res.status(404).json({ error: "Formation non trouvée" });

        const module = formation.modules.find(mod => mod.moduleId === moduleId);
        if (!module) return res.status(404).json({ error: "Module non trouvé" });

        res.status(200).json(module.contenu);
    } catch (error) {
        console.error("Erreur lors de la récupération du contenu du module:", error);
        res.status(500).json({ error: "Erreur lors de la récupération du contenu du module" });
    }
};
