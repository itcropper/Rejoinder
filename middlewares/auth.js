exports.isLoggedIn = function (req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        return next();
    }
    console.log('User not authenticated');
    res.redirect("/login");
};

exports.isGuest = function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/dashboard');
}