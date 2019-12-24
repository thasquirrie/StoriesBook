const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
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

//Mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Handlebars Middleware
app.engine('handlebars', exphbs({
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