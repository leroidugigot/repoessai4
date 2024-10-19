const path = require("path");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const router = require("express").Router();
const { ensureAuthenticated } = require("../config/security.config");
const User = require("../database/models/user.model");
require("dotenv").config();

// Routes pour les utilisateurs et l'authentification
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Route protégée, accessible uniquement aux utilisateurs authentifiés
router.get("/protected", async (req, res) => {
  const user = req.user; // L'utilisateur est récupéré via le middleware `ensureAuthenticated`
  console.log(user);
  
 
      res.render("protected", { user}); // Envoie également la liste des utilisateurs à la vue
    } )


// Autres routes
router.get("/formations/gqs", (req, res) => {
  console.log("Accès à la route GQS.");
  res.render("partials/contenu-gqs");
});

router.get("/formations/PSC1", (req, res) => {
  console.log("Accès à la route PSC1.");
  res.render("partials/contenu-psc1");
});

// Route vers le front-end (index.html) à la racine
router.get("/", (req, res) => {
  console.log("Accès à la page d'accueil.");
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes pour la navigation
router.get("/enseigner", (req, res) => {
  console.log("Accès à la route enseigner.");
  res.json({ message: "Enseigner details" });
});

router.get("/chat", (req, res) => {
  console.log("Accès à la route chat.");
  res.json({ message: "Chat information" });
});

router.get("/sellpage", (req, res) => {
  console.log("Accès à la route sellpage.");
  res.json({ message: "Secouriste bag information" });
});

// Route de connexion (exemple)
router.post("/connexion", (req, res) => {
  const { email, password } = req.body;
  console.log(`Tentative de connexion pour ${email}`);
  res.json({ message: `Connexion attempted for ${email}` });
});

// Route pour commencer un processus
router.post("/commencer", (req, res) => {
  console.log("Démarrage du processus.");
  res.json({ message: "Starting process" });
});

module.exports = router;
