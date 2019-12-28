const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const {ensureAuthenticated} = require('../helpers/auth');
const {ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
  // res.send("If it works then the problem comes from handlebars")
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  }).then(stories => {
    res.render('index/dashboard', {
      stories
    });
  })
  
});

router.get('/about', (req, res) => {
  res.render('index/about');
});



module.exports = router;