// routes/formation.routes.js
const express = require("express");
const router = express.Router();
const {getAllFormations, getModulesByFormation, getModuleContent} = require("../controllers/formation.controller");

// Route pour récupérer toutes les formations
router.get("/", getAllFormations);

// Route pour récupérer les modules d'une formation spécifique
router.get("/:formationId/modules", getModulesByFormation);

// Route pour récupérer le contenu d'un module spécifique d'une formation
router.get("/:formationId/modules/:moduleId", getModuleContent);

module.exports = router;
