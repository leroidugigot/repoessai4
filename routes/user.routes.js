// routes/user.routes.js
const { userNew, userCreate,getProfile} = require('../controllers/user.controller');
const router = require('express').Router();
const { ensureAuthenticated } = require("../config/security.config");


router.get('/new', userNew);
router.post('/', userCreate);
router.get('/profile', ensureAuthenticated, getProfile);




module.exports = router;