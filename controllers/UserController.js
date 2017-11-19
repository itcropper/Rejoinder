var User = require('../models/UserModel');

exports.create = (username, email, password, cb) => {
        
    var u = new User({
        user_name: username,
        email: email,
        password: password
    });

    u.save(function(err, user){
        if(err){return cb(err, user);}
        return cb(null, user); 
    });

}
