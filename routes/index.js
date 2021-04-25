const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const passport = require('passport')

// Index Page
router.get('/', (req, res) => res.render('index', { title: 'Home' }));

module.exports = router;