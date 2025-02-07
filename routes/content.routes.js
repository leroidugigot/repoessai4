const express = require("express");
const router = express.Router();
const contentController = require("../controllers/content.controller");
const { ensureAuthenticated } = require("../config/security.config");
const {
  validateProgressData,
  validateIds,
} = require("../middleware/content.middleware");

// Routes protégées par authentification
router.use(ensureAuthenticated);

// Middleware de validation des IDs pour toutes les routes avec formationId et moduleId
router.use("/:formationId/modules/:moduleId", validateIds);

// Obtenir l'état actuel d'un module
router.get(
  "/:formationId/modules/:moduleId/state",
  contentController.getCurrentState
);

// Vérifier le statut de verrouillage d'un module
router.get(
  "/:formationId/modules/:moduleId/lock-status",
  contentController.getModuleLockStatus
);

// Mettre à jour la progression vidéo
router.post(
  "/:formationId/modules/:moduleId/video-progress",
  validateProgressData,
  contentController.updateVideoProgress
);

// Mettre à jour la progression de lecture
router.post(
  "/:formationId/modules/:moduleId/reading-progress",
  validateProgressData,
  contentController.updateReadingProgress
);

// Valider un quiz
router.post(
  "/:formationId/modules/:moduleId/validate-quiz",
  validateProgressData,
  contentController.validateQuiz
);

// Sauvegarder la progression générale
router.post(
  "/:formationId/modules/:moduleId/progress",
  validateProgressData,
  contentController.saveProgress
);

module.exports = router;
