const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('index/welcome')
  // res.send("If it works then the problem comes from handlebars")
});

router.get('/dashboard', (req, res) => {
  // res.send('Dashboard')
  res.render('index/dashboard')
});

router.get('/about', (req, res) => {
  res.render('index/about')
});

module.exports = router;