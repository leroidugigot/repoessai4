const { ensureAuthenticated } = require("../config/security.config"); 
const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const formationRoutes = require("./formation.routes");
const router = require("express").Router();
const User = require('../database/models/user.model');
require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Route protégée pour accéder à la vue 'protected' et les formations
router.use('/protected', ensureAuthenticated, async (req, res, next) => {
    

    // Vérifiez si req.user est défini avant de continuer
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const userId = req.user._id;
        const userWithFormations = await User.findById(userId)
            .populate('local.formations.formation');
        
        if (!userWithFormations) {
            return res.status(404).json({ message: "User not found" });
        }

        res.render("protected", { 
            user: req.user,
            formations: userWithFormations.local.formations || [],
            currentFormation: userWithFormations.local.formations[0] || null
        });
    } catch (error) {
        console.error("Error in /protected:", error);
        res.status(500).send("Internal server error");
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