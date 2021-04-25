const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mogoose = require('mongoose');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session')

const app = express();


//DB Config
const db = require('./config/keys').MongoURI;
//Connect to MongoDB
mogoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

//Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/images', express.static(__dirname + 'public/images'));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport config
require('./config/passport')(passport);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//---------------------------------------------------------------------
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
//---------------------------------------------------------------------

//Connect Flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));