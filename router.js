var passport = require('./auth/passport'),
    ig = require('./data/instagram');

class Router {
    
    constructor(app){
        this.app = app;
        
        this.app.set('view engine', 'ejs')
        
        this.api = this.buildApiRoutes();
        
        this.registerRoutes();
        
        this.registerApiRoutes();
    }
    
    home(req, res) {
        res.render(__dirname + '/public/views/index')
    }
    
    about(req, res) {
        res.render(__dirname + '/public/views/about')
    }
    dashboard(req, res){
        
    }
    signup(req, res){
        res.render(__dirname + '/public/views/signup');
    }
    
    login(req, res){
        res.render(__dirname + '/public/views/login');
    }
    
    dashboard(req, res) {
        
        console.log(req.user);
        res.render(__dirname + '/public/views/dashboard', req.user); 
    }
    
    igCallBack(req, res) {
        res.redirect('/dashboard');
    }
    
    createUser(access_token, cb){
        ig.createNewUser(access_token, cb);
    }
    
    ensureAuthenticated(req, res, next) {
//        console.log("isAuthenticated, ", req.cookies);
        if (req.isAuthenticated()) { return next(); }
        return res.redirect('/signup');
    }
    
    registerRoutes(){
        
        this.app.get('/', this.home);
        this.app.get('/about', this.about);
        this.app.get('/signup', this.signup);
        this.app.get('/login', this.login);
        this.app.get('/dashboard', this.ensureAuthenticated, this.dashboard);   
        this.app.get('/auth', passport.authenticate('instagram', { scope: ['basic', 'public_content', 'comments', 'relationships', 'likes'] }), (req, res) => {});
        this.app.get('/auth/generatetoken', 
          passport.authenticate('instagram', { failureRedirect: '/login' }),
          (req, res) => res.redirect('/dashboard'));
    }
    
    
    buildApiRoutes() {
        return {
            tags: (req, res) => {
                ig.findByTags(req, (err, data) => {
                  if(err) return res.status(500).send(err);
                    return res.status(200).json(data);
                });
            }
        };
    }
    
    registerApiRoutes() {        
        this.app.get('/api/user/tags', this.ensureAuthenticated, this.api.tags);
    }
    

}

module.exports = Router;