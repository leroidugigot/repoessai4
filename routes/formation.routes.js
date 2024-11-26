const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/security.config");

const { 
  getAllFormations, 
  getFormationById, 
  getModulesByFormation, 
  getModuleContent,
  inscrireAFormation,
  getLessonOnline, 
  getNextModule, 
  completeModule, 
  getProgression, 
  getModuleStatus 
} = require("../controllers/formation.controller");

// Fonctions pour colorer les logs
const logColor = (message, color) => console.log(`\x1b[${color}m%s\x1b[0m`, message);
const colors = { cyan: 36, magenta: 35, yellow: 33, green: 32, red: 31 };

// Routes avec protection `ensureAuthenticated` pour garantir qu'un utilisateur est authentifié

// Route pour récupérer toutes les formations
router.get("/", ensureAuthenticated, (req, res, next) => {
    logColor("Requête reçue pour récupérer toutes les formations", colors.cyan);
    next();
}, getAllFormations);

// Route pour récupérer une formation spécifique par ID
router.get('/:id', ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour récupérer la formation avec l'ID: ${req.params.id}`, colors.magenta);
    next();
}, getFormationById);

// Route pour inscrire un utilisateur à une formation
router.post('/:formationId/inscription', ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour inscrire un utilisateur à la formation ID: ${req.params.formationId}`, colors.green);
    next();
}, inscrireAFormation);

// Route pour récupérer les modules d'une formation spécifique
router.get("/:formationId/modules", ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour récupérer les modules de la formation ID: ${req.params.formationId}`, colors.magenta);
    next();
}, getModulesByFormation);

// Route pour récupérer le contenu d'un module spécifique
router.get("/:formationId/modules/:moduleId/content", ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour récupérer le contenu du module ID: ${req.params.moduleId} de la formation ID: ${req.params.formationId}`, colors.yellow);
    next();
}, getModuleContent);

// Route pour récupérer les leçons en ligne
router.get('/lesson-online', ensureAuthenticated, (req, res, next) => {
    logColor("Requête reçue pour récupérer les leçons en ligne", colors.cyan);
    next();
}, getLessonOnline);

// Route pour récupérer le module suivant
router.post('/:formationId/modules/:currentModuleId/next', ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour récupérer le module suivant après le module ID: ${req.params.currentModuleId} de la formation ID: ${req.params.formationId}`, colors.green);
    next();
}, getNextModule);

// Route pour marquer un module comme complété
router.post('/:formationId/modules/:moduleId/complete', ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour marquer le module ID: ${req.params.moduleId} comme complété pour la formation ID: ${req.params.formationId}`, colors.green);
    next();
}, completeModule);

// Route pour récupérer la progression d'une formation
router.get('/:formationId/progression', ensureAuthenticated, (req, res, next) => {
    logColor(`Requête reçue pour récupérer la progression de la formation ID: ${req.params.formationId}`, colors.yellow);
    next();
}, getProgression);

// Route pour récupérer le statut d'un module
router.get('/:formationId/modules/:moduleId/status', ensureAuthenticated, async (req, res, next) => {
    // Vérification des ID
    const { formationId, moduleId } = req.params;
    console.log(`Formation ID: ${formationId}, Module ID: ${moduleId}`);

    // Assurez-vous que l'utilisateur est bien authentifié et que les données sont présentes
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Continuer avec le traitement ici
    next();
}, getModuleStatus);





// Route de test (pas protégée)
router.get("/test", (req, res) => {
    logColor("Route de test appelée", colors.green);
    res.send("Route test OK");
});

module.exports = router;
