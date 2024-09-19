const router = require('express').Router();
const {pagedetailleenseigner} = require('../controllers/enseigner.controller');

router.get('/', pagedetailleenseigner);