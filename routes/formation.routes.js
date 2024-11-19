
const express = require("express");
const router = express.Router();
const { getAllFormations, getFormationById, getModulesByFormation, getModuleContent ,inscrireAFormation ,getLessonOnline  ,getNextModule } = require("../controllers/formation.controller");

// Fonctions pour colorer les logs
const logColor = (message, color) => console.log(`\x1b[${color}m%s\x1b[0m`, message);
const colors = { cyan: 36, magenta: 35, yellow: 33 };

// Route pour récupérer toutes les formations
router.get("/", (req, res, next) => {
    logColor("Requête reçue pour récupérer toutes les formations", colors.cyan);
    next();
}, getAllFormations);

// Route pour obtenir une formation par son ID
router.get('/:id', getFormationById);

router.post('/:formationId/inscription', inscrireAFormation, );

// Route pour récupérer les modules d'une formation spécifique
router.get("/:formationId/modules", (req, res, next) => {
    logColor(`Requête reçue pour récupérer les modules de la formation ID: ${req.params.formationId}`, colors.magenta);
    next();
}, getModulesByFormation);

// Route pour récupérer le contenu d'un module spécifique d'une formation
router.get("/:formationId/modules/:moduleId/content", (req, res, next) => {
    logColor(`Requête reçue pour récupérer le contenu du module ID: ${req.params.moduleId} de la formation ID: ${req.params.formationId}`, colors.yellow);
    next();
}, getModuleContent);

router.get('/lesson-online',getLessonOnline);

router.post('/formations/:formationId/modules/:currentModuleId/next', getNextModule);





 


// Route de test
router.get("/test", (req, res) => {
    res.send("Route test OK");
});

module.exports = router;
