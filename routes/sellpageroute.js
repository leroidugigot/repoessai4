const router = require('express').Router();
const {sellpagemain} = require('../controllers/sellpage.controller');

router.get('/', sellpagemain);