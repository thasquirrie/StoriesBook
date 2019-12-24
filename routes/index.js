const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const {ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
  // res.send("If it works then the problem comes from handlebars")
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  // res.send('Dashboard');
  res.render('index/dashboard');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});



module.exports = router;