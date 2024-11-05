const { ensureAuthenticated } = require("../config/security.config");
const express = require("express");
const router = express.Router();

const { getAllFormations, getModulesByFormation, getModuleContent } = require("../controllers/formation.controller");
const Formation = require("../database/models/formation.model"); // Assurez-vous d'importer votre modèle Formation

// Fonctions pour colorer les logs
const logColor = (message, color) => console.log(`\x1b[${color}m%s\x1b[0m`, message);
const colors = {
    cyan: 36,
    magenta: 35,
    yellow: 33
};

// Route pour récupérer toutes les formations
router.get("/", (req, res, next) => {
    logColor("Requête reçue pour récupérer toutes les formations", colors.cyan); // Log en cyan
    next(); // Appelle le prochain middleware
}, getAllFormations);

// Route pour récupérer les modules d'une formation spécifique
router.get("/:formationId/modules", (req, res, next) => {
    logColor(`Requête reçue pour récupérer les modules de la formation ID: ${req.params.formationId}`, colors.magenta); // Log en magenta
    next(); // Appelle le prochain middleware
}, getModulesByFormation);

// Route pour récupérer le contenu d'un module spécifique d'une formation
router.get("/:formationId/modules/:moduleId/content", (req, res, next) => {
    logColor(`Requête reçue pour récupérer le contenu du module ID: ${req.params.moduleId} de la formation ID: ${req.params.formationId}`, colors.yellow); // Log en jaune
    next(); // Appelle le prochain middleware
}, getModuleContent);

// Route de test
router.get("/test", (req, res) => {
    res.send("Route test OK");
});

// Route protégée (doit être authentifiée)
router.get("/protected", ensureAuthenticated, async (req, res) => {
    try {
        // Récupérer toutes les formations de la base de données
        const formations = await Formation.find({});
        const user = req.user; // Récupérer l'utilisateur authentifié depuis la requête
        console.log("Utilisateur:", user);
        console.log("Formations:", formations);
        
        // Extraire les modules uniquement
        const modules = formations.flatMap(formation => formation.modules); // Fusionne les modules de toutes les formations en un seul tableau
        console.log("Modules:", modules);

        // Exemple de récupération d'un module spécifique (par exemple, premier module de la première formation)
        const module = formations[0]?.modules[0] || null;
        console.log("Module sélectionné:", module);

        // Rendre la vue 'protected' avec les données nécessaires
        res.render("protected", { user, formations, module, modules });
    } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        res.status(500).send("Erreur lors de la récupération des formations");
    }
});

module.exports = router;
