const {
    signinForm,
    signin,
    signout,
    googleAuth,
    googleAuthCb,
    sessionCreate, 
    yahooAuth,  // Ajout de la fonction d'authentification Yahoo
    yahooAuthCb // Ajout de la fonction de callback pour Yahoo
  } = require('../controllers/auth.controller');
  
const router = require('express').Router();

router.post('/signin', sessionCreate);
router.get('/signin/form', signinForm);
router.post('/signin', signin);
router.get('/signout', signout);

// Routes pour Google Auth
router.get('/google', googleAuth);
router.get('/google/cb', googleAuthCb);

// Routes pour Yahoo Auth
router.get('/yahoo', yahooAuth);
router.get('/yahoo/cb', yahooAuthCb);



module.exports = router;