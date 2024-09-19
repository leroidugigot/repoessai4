const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const tweets = require("./tweets.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");
const path = require("path");

// Route vers le front-end (index.html) à la racine
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes API existantes
router.use("/tweets", ensureAuthenticated, tweets);
router.use("/users", users);
router.use("/auth", auth);

router.get("/tweets", (req, res) => {
  res.redirect("/tweets");
});

// Nouvelles routes API


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

module.exports = router;
