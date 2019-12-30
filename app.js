const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParsers = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Load models
require('./models/User');
require('./models/Story');
//Passport config
require('./config/passport')(passport);

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Load keys
const keys = require('./config/keys')

//Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select
} = require('./helpers/hbs');

//Mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

const app = express();

//Method Override middleware
app.use(methodOverride('_method'));

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Handlebars Middleware
app.engine('handlebars', exphbs({
 helpers:  {
    truncate,
    stripTags,
    formatDate,
    select
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// app.use(cookieParsers);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res,next) => {
  res.locals.user = req.user || null;
  next();
})

//Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories)



const port = process.env.PORT|| 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});