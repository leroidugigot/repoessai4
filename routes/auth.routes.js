const {
    signinForm,
    signin,
    signout,
    googleAuth,
    googleAuthCb,
    sessionCreate
  } = require('../controllers/auth.controller');
  
const router = require('express').Router();

router.post('/signin', sessionCreate);
router.get('/signin/form', signinForm);
router.post('/signin', signin);
router.get('/signout', signout);

router.get('/google', googleAuth);
router.get('/google/cb', googleAuthCb);

module.exports = router;