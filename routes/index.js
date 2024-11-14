const { ensureAuthenticated } = require("../config/security.config"); 
const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const formationRoutes = require("./formation.routes");
const router = require("express").Router();
const User = require('../database/models/user.model'); // Import the User model
require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Route protégée pour accéder à la vue 'protected' et les formations
router.use('/protected', ensureAuthenticated, async (req, res, next) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const userWithFormations = await User.findById(userId).populate('local.formations');

        if (!userWithFormations) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentFormation = userWithFormations.local.formations.find(formation => formation.participants.includes(userId));

        res.render("protected", { user, currentFormation });
    } catch (error) {
        console.error("Error displaying protected view:", error);
        res.status(500).send("Error displaying protected view");
    }
});

// Routes protégées pour les formations
router.use('/formations', ensureAuthenticated, formationRoutes);

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