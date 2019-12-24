const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const cookieParsers = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Load user model
require('./models/User')
//Passport config
require('./config/passport')(passport);

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth')

//Load keys
const keys = require('./config/keys')

//Mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

const app = express();

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



const port = process.env.PORT|| 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});