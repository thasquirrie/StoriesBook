const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const {ensureGuest} = require('../helpers/auth');

//Stories index
router.get('/', (req, res) => {
  res.render('stories/index');
})

//Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

module.exports = router;