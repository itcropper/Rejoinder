var passport = require('passport'),
    util = require('util'),
    User = require('../models/UserModel'),
    igApi = require('../data/instagram'),
    InstagramStrategy = require('passport-instagram').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        if(err) return done(err);
        return done(null, user);
    })
  
});


passport.use(new InstagramStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: process.env.redirect_uri
  },
  function(accessToken, refreshToken, profile, done) {
    User.find({account_token: accessToken}, function(err, user){
        if(err){return done(err);}
        if(!user || user.length == 0){
            
            igApi.createNewUser(accessToken, (err, user) => {
                if(err){return done(err);}
                return done(null, user);
            });
        }
        return done(null, user);
    });
  }
));

module.exports = passport;

/*
    user_name:String,
    user_profile_img_url: String,
    user_id: String,
    account_token: String,
    created_at: {type: Date, default: Date.now},
    last_signed_in:{type: Date, default: Date.now},
*/