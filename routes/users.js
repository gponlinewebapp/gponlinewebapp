const express = require('express');
const passport = require('passport');
// const router = express.Router();
const router = express.Router({ mergeParams: true });
const bcrypt = require('bcryptjs');

//User model
const User = require('../models/User');
const Appointment = require('../models/Appointment');

//Login page
router.get('/login', function (req, res) { res.render('login', { title: 'Login' }) });
//Signup page
router.get('/signup', function (req, res) { res.render('signup', { title: 'Signup' }) });
//About page
router.get('/about', function (req, res) { res.render('about', { title: 'About' }) });
//Services page
router.get('/services', function (req, res) { res.render('services', { title: 'Services' }) });
//Contact page
router.get('/contact', function (req, res) { res.render('contact', { title: 'Contact Us' }) });
//Forgot Password page
router.get('/forgot_password', function (req, res) { res.render('forgot_password', { title: 'Forgot Password' }) });
//User profile page
router.get('/userprofile', ensureAuthenticated, function (req, res) { res.render('userprofile', { title: 'User profile' }) });
//Appointment_form page
router.get('/appointment_form', ensureAuthenticated, function (req, res) { res.render('appointment_form', { title: 'Appointment form' }) });
//Video chat
router.get('/videochat', ensureAuthenticated, function (req, res) { res.redirect('https://gponline-video-chat.netlify.app/') });


//Signup Handler =================================================================================
router.post('/signup', (req, res) => {
  console.log(req.body);
  const { fname, lname, mobile, email, email2, password, password2, address } = req.body;
  var errors = [];

  //Checking for input errors/required fields
  if (!fname || !lname || !mobile || !email || !email2 || !password || !password2 || !address) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Password check
  if (password != password2) {
    errors.push({ msg: "Passwords doesn't match" });
  }

  //Email check
  if (email != email2) {
    errors.push({ msg: "Emails doesn't match" });
  }

  //Checking for the password length
  if (password.length < 8) {
    errors.push({ msg: "Passwords must be 8 or more charaters" });
  }
  if (mobile.length < 10) {
    errors.push({ msg: "Mobile number must be 10 charaters" });
  }

  if (errors.length > 0) {
    res.render('signup', {
      errors,
      fname,
      lname,
      mobile,
      email,
      email2,
      password,
      password2,
      address
    });
  } else {
    //Validation passed
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          //User exists
          errors.push({ msg: "Email is already registered" });
          res.render('signup', {
            errors,
            fname,
            lname,
            mobile,
            email,
            email2,
            password,
            password2,
            address
          });
        } else {
          //Seting a new User
          const newUser = new User({
            fname,
            lname,
            mobile,
            email,
            password,
            address
          });
          console.log(newUser);

          //Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //Setting password to hached
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash(
                    'success_msg', 'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Access Control to specific files
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

//############################################################################################
//Reference link for the code below:
//https://dev.to/oluseyeo/how-to-create-relationships-with-mongoose-and-node-js-11c8
//STLL WORKING ON THIS CODE AND PROGRESS
router.post('/appointment_form', async (req, res) => {
  /**
   * @tutorial: steps
   * 1. Authenticate user and get user _id.
   * 2. Assign user id from signed in user to user key.
   * 3. Call save method on Appointment.
  */
  try {
    //validate data as required
    const appointment = new Appointment(req.body);
    //appointment.user = user._id; //<=== Assign user id from signed in user to user key
    await appointment.save();
    /**
     * @tutorial: steps
     * 1. Find the user house by User ID.
     * 2. Call Push method on userAppointment key of User.
     * 3. Pass newly created user as value.
     * 4. Call save method.
    */
    const user = await User.findById({ _id: appointment.user })
    user.userAppointment.push(appointment);
    await user.save();

    //return new appointment object, after saving it to User
    res.status(200).json({ success: true, data: appointment });
    res.redirect('/users/appointment_form');

  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})
//############################################################################################
/*
Testing code below and progress
router.post('/appointment_form', (req, res) => {

  const { symptoms, gender, video, date, time } = req.body;
  const newAppoint = new User({
    // const newAppoint = new UserAppoint({
    symptoms,
    gender,
    video,
    date,
    time
  });
  console.log(newAppoint);
  newAppoint.save((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash(
        'success_msg', 'Your appointment is requested'
      );
      res.redirect('/users/appointment_form');
    }
  });

});
*/
//############################################################################################
// Testing code below and progress checking retrive the user ID from database
// router.get('/appointment_form/:id', function (req, res) {
//   // let id = req._id;
//   let id = req.params._id;
//   console.log('User id', id);
// });


module.exports = router;
