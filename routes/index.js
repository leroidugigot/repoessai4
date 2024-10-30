// index.js
const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const formationRoutes = require("./formation.routes");
const router = require("express").Router();
const { ensureAuthenticated } = require("../config/security.config");
const User = require("../database/models/user.model");
const Formation = require('../database/models/formation.model'); // Chemin vers votre modèle Formation

require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/formations", formationRoutes);

// Route protégée, accessible uniquement aux utilisateurs authentifiés
router.get("/protected", ensureAuthenticated, async (req, res) => {
    try {
        const formations = await Formation.find({},);
        const user = req.user;
        console.log(user, formations);
        
        res.render("protected", { user, formations });
    } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        res.status(500).send("Erreur lors de la récupération des formations");
    }
});

// Autres routes
router.get("/formations/gqs", (req, res) => {
    res.render("partials/contenu-gqs");
});

router.get("/formations/PSC1", (req, res) => {
    res.render("partials/contenu-psc1");
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes pour la navigation
router.get("/enseigner", (req, res) => {
    res.json({ message: "Enseigner details" });
});

router.get("/chat", (req, res) => {
    res.json({ message: "Chat information" });
});

router.get("/sellpage", (req, res) => {
    res.json({ message: "Secouriste bag information" });
});

router.post("/connexion", (req, res) => {
    const { email, password } = req.body;
    res.json({ message: `Connexion attempted for ${email}` });
});

router.post("/commencer", (req, res) => {
    res.json({ message: "Starting process" });
});

module.exports = router;
