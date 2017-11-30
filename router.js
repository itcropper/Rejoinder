var passport = require('passport'),
    User = require('./models/UserModel'),
    
    authMiddleware = require('./middlewares/auth'),
    userController = require('./controllers/UserController'),
    router = require('express').Router(),
    isLoggedIn = require('connect-ensure-login').ensureLoggedIn(),
    ig = require('./data/instagram');


function home(req, res) {
    res.render(__dirname + '/public/views/index')
}
    
function about(req, res) {
    res.render(__dirname + '/public/views/about')
}
function signup(req, res){
    res.render(__dirname + '/public/views/signup');
}

function login(req, res){
    res.render(__dirname + '/public/views/login');
}

function dashboard(req, res) {
    
    if(req.session.viewCount){
        req.session.viewCount++;
    }else {
        req.session.viewCount = 1;
    }
    
    console.log(req.session);
    res.render(__dirname + '/public/views/dashboard', req.user); 
}

function igCallBack(req, res) {
    res.redirect('/dashboard');
}

function createUser(access_token, cb){
    ig.createNewUser(access_token, cb);
}
function tags(req, res){
    ig.findByTags(req, (err, data) => {
      if(err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
};
function userExists(req, res){
    user.findOne({user_name: req.params.username}, (function(err, user){
        if(err){return res.send(false);}
        if(!user){return res.send(false);}
        return res.send(true);
    }));
};
function newUser(req, res){
    console.log(req.body);

    userController.create(req.body.email, req.body.username, req.body.password, (err, user)=> {
        if(err) {return res.send('Error' + err);}
        return res.redirect('/dashboard');
    });

    //res.send(req.body);
};

function isAuthenticated(req, res){
    console.log("Next ", req.isAuthenticated(), passport.isAuthenticated());
    if(req.user || req.isAuthenticated()){
        
        return next? next() : true;
    }
    console.log('Auth: ', passport.isAuthenticated(req, res));
    return passport.isAuthenticated(req, res);
}


module.exports = function(app){
    app.set('view engine', 'ejs');
    
    router.route('/').get(home);
    
    
    router.route('/about').get(about);
    
    router.route('/signup')
        .get(authMiddleware.isGuest, signup)
        .post(function(req, res, next) {
          console.log('Trying to create an account');
          User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err, user) {
            if (err) {
              console.log(err);//send back details on if there were issues with signup req.flash?
              return res.render(__dirname +  "public/views/signup");
            }
            passport.authenticate("local")(req, res, function() {
              res.redirect("/dashboard");
            });
          });
        });
    
    router.route('/login')
        .get(authMiddleware.isGuest, login)
        .post(passport.authenticate("local", { successRedirect: "/dashboard", failureRedirect: "/login" }),
          function(req, res, next) {
              console.log(req.body);
            res.render('dashboard');
    });
    
    router.route('/logout').get(function(req, res, next) {
      req.logout();
      res.redirect("/");
    });
    
    router.route('/dashboard').get(authMiddleware.isLoggedIn, dashboard);
    
    router.route('/api/user/tags').get(authMiddleware.isLoggedIn,tags);

    router.route('/api/user/checkusername/:username').get(userExists);

    //router.route('/api/user/createUser').get(newUser);
    
    router.route('/api/something').get((req, res) => {
        console.log(req.headers);
        res.json(req.headers);
    })
    
    app.use(router); 
}