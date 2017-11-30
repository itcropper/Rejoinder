const passport = require('passport');
const User = require('../models/UserModel');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = passport;


//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/UserModel');
//
//passport.serializeUser(function(user, done) {
//  done(null, user);
//});
//
//passport.deserializeUser(function(user, done) {
//  done(null, user);
//});
//
//passport.use(new LocalStrategy({
//    passReqToCallback: true
//},
//  function(req, username, password, callback) {
//      console.log("---->", req.cookies);
//    User.findOne({ user_name: username }, function (err, user) {
//      if (err) { return callback(err); }
//
//      // No user found with that username
//      if (!user) { return callback(null, false); }
//
//      // Make sure the password is correct
//      user.verifyPassword(password, function(err, isMatch) {
//          
//        if (err) { return callback(err); }
//          
//        // Password did not match
//        if (!isMatch) { return callback(null, false); }
//
//        console.log('success: ', !!isMatch);
//        // Success
//          req.login(user, (error) => {
//              if(error) return callback(err, false);
//              return callback(null, user);
//          });
//      });
//    });
//  }
//));
//
//passport.isAuthenticated = passport.authenticate('local', { session : true });
//
//module.exports = passport;