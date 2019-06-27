const express = require("express");
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

//home page
router.get("/", ensureAuthenticated, (req, res, next) => {
  res.render("index");
});

//register page
router.get("/register", (req, res, next) => {
  res.render("register");
});

//login
router.get("/login", (req, res, next) => {
  res.render("login");
});

//login
router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');

});

router.post("/register", (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email must be a valid email address").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {

    const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: password
    });

    User.registerUser(newUser, (err, user) => {
        if(err) throw err;
        req.flash('success_msg', 'You are registerd and you can log in');
        res.redirect('/login');
    });


  }
});

//Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    //from model
   User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
        return done(null, false, {message: 'No user found'});
    }
    //from model
    User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Wrong Password'});
        }
        });
    });
}));

//serialize user
passport.serializeUser((user, done) => {
    done(null, user.id)
});

//deserialize user
passport.deserializeUser((id, done) => {
    //from model
    User.getUserById(id, (err, user) => {
        done(err, user);
    })
});

// Login Processing 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//Access control only autherised users are allowed to see Home-Page
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('erro_msg', 'You are not autherised to view that Page');
        res.redirect('/login')
    }
}
















module.exports = router;
