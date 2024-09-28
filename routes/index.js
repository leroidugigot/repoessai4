const path = require("path");
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const router = require('express').Router();
const { ensureAuthenticated } = require('../config/security.config');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.render('protected');
})

// Route vers le front-end (index.html) à la racine
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});




        /*route for navbar*/ 
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