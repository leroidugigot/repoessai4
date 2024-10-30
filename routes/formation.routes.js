const { ensureAuthenticated } = require("../config/security.config");
const express = require("express");
const router = express.Router();

const { getAllFormations, getModulesByFormation, getModuleContent } = require("../controllers/formation.controller");
const Formation = require("../database/models/formation.model"); // Assurez-vous d'importer votre modèle Formation

// Route pour récupérer toutes les formations
router.get("/", getAllFormations);

// Route pour récupérer les modules d'une formation spécifique
router.get("/:formationId/modules", getModulesByFormation);

// Route pour récupérer le contenu d'un module spécifique d'une formation
router.get("/:formationId/modules/:moduleId", getModuleContent);

router.get("/test", (req, res) => {
    res.send("Route test OK");
});

router.get("/protected", ensureAuthenticated, async (req, res) => {
    try {
        const formations = await Formation.find({});
        const user = req.user; // Assurez-vous que l'utilisateur est bien attaché à la requête
        console.log("Utilisateur:", user);
        console.log("Formations:", formations);
        
        res.render("protected", { user, formations,module });
    } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        res.status(500).send("Erreur lors de la récupération des formations");
    }
});

module.exports = router;
