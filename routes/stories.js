const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users')
const { ensureAuthenticated } = require('../helpers/auth');
const { ensureGuest } = require('../helpers/auth');

//Stories index
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({date: 'desc'})
    .then(stories => {
      res.render('stories/index', {
        stories
      });
    })

})

//Getting Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).populate('user')
    .populate('comments.commentUser')
    .then(story => {
      res.render('stories/show', {
        story
      })
    })

})


//List stories from a user
router.get('/user/:userId', (req, res) => {
  Story.find({
    user: req.params.userId,
    status: 'public'
  })
  .populate('user')
  .then(stories => {
    res.render('stories/index', {
      stories
    })
  })
})

//List stories from logged user
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  }).populate('user')
  .then(stories => {
    res.render(`stories/index`, {
      stories
    })
  })
})

//Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//Edit single story
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story
      })
    }
  })
})

//Process add story
router.post('/', (req, res) => {
  const errors = []

  if (!req.body.title) {
    errors.push({
      'text': 'Please enter a title'
    });
  }

  if (!req.body.body) {
    errors.push({
      'text': 'Please enter some details'
    });
  }

  if (errors.length > 0) {
    res.render('stories/add', {
      errors,
      title: req.body.title,
      body: req.body.body
    })
  } else {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false
    }

    const newStory = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments,
      user: req.user.id
    }

    new Story(newStory).save()
      .then(story => {
        res.redirect(`/stories/show/${story.id}`);
      })
  }
})

//Edit Story process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    console.log('allowComments is', allowComments)
    story.title = req.body.title
    story.body = req.body.body
    story.status = req.body.status
    story.allowComments = allowComments

    story.save().then(story => {
      res.redirect('/dashboard')
    })
  })
})

//Delete single stories
router.delete('/:id', (req, res) => {
  Story.deleteOne({
    _id: req.params.id
  }).then(story => {
    res.redirect('/dashboard')
  })
})

//Add comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }
    story.comments.unshift(newComment)
    story.save()
      .then(story => {
        res.redirect(`/stories/show/${story.id}`)
      })
  })
})

//Get all user stories
router.get('/stories/')

module.exports = router;