// index.js
const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const formationRoutes = require("./formation.routes");
const router = require("express").Router();

const User = require("../database/models/user.model");


require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/formations", formationRoutes);




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
