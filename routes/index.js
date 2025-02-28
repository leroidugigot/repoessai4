const { ensureAuthenticated } = require("../config/security.config");
const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const formationRoutes = require("./formation.routes");
const router = require("express").Router();
const User = require("../database/models/user.model");
const Formation = require("../database/models/formation.model"); // Ajoutez cette ligne
require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Route protégée pour accéder à la vue 'protected' et les formations

router.use("/protected", ensureAuthenticated, async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const userId = req.user._id;
    const allFormations = await Formation.find().lean();

    const userWithFormations = await User.findById(userId)
      .populate({
        path: "local.formations.formation",
        populate: { path: "modules" },
      })
      .lean();

    if (!userWithFormations) {
      return res.status(404).json({ message: "User not found" });
    }

    res.render("protected", {
      user: req.user,
      formations: allFormations,
      userFormations: userWithFormations.local.formations || [],
      currentFormation: null,
      moduleList: null,
      contentDisplay: null,
    });
  } catch (error) {
    console.error("Error in /protected:", error);
    res.status(500).send("Internal server error");
  }
});

// Route du chat - Protégée par authentification
router.get("/chat", ensureAuthenticated, (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/auth/signin");
    }

    const userData = {
      _id: req.user._id.toString(),
      username: req.user.username,
      avatar: req.user.avatar || "/images/default-profile.svg",
    };

    console.log("Rendering chat with user:", userData);
    res.render("chat", { user: userData });
  } catch (error) {
    console.error("Error rendering chat:", error);
    res.status(500).send("Erreur lors du chargement du chat");
  }
});

// API endpoint pour obtenir les informations de l'utilisateur courant
router.get("/api/current-user", ensureAuthenticated, (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    res.json({
      _id: req.user._id.toString(),
      username: req.user.username,
      avatar: req.user.avatar || "/images/default-profile.svg",
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Routes protégées pour les formations
router.use("/formations", ensureAuthenticated, formationRoutes);

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
