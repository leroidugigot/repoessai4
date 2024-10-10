const { userNew, userCreate, getConnectedUsers} = require('../controllers/user.controller');
const router = require('express').Router();

router.get('/new', userNew);
router.post('/', userCreate);

router.get('/connected-users', getConnectedUsers);

module.exports = router;