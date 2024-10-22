const {
  signinForm,
  signin,
  signout,
  googleAuth,
  googleAuthCb

} = require('../controllers/auth.controller');

const router = require('express').Router();

// Routes pour l'authentification

router.get('/signin/form', signinForm); // Affiche le formulaire de connexion
router.post('/signin', signin); // Connexion de l'utilisateur via le formulaire
router.get('/signout', signout); // Déconnexion de l'utilisateur, suppression du cookie JWT

router.get('/google', googleAuth);
router.get('/google/cb', googleAuthCb);

module.exports = router;
