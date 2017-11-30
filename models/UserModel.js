const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: String,
    user_profile_img_url: String,
    IGid: String,
    IGToken: String,
    email: String,
    created_at: {type: Date, default: Date.now},
    last_signed_in:{type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);








//var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');
//
//var UserSchema = new mongoose.Schema({
//    user_name:{
//        type: String,
//        unique: true,
//        required: true
//      },
//    name: String,
//    user_profile_img_url: String,
//    user_id: String,
//    account_token: String,
//    created_at: {type: Date, default: Date.now},
//    last_signed_in:{type: Date, default: Date.now},
//      password: {
//        type: String,
//        required: true
//      }
//});
//
//UserSchema.methods.verifyPassword = function(password, cb) {
//    console.log('That pw: ', password, " this password: ", this.password);
//    if(password === this.password){
//        return cb(null, this);
//    }
//  bcrypt.compare(password, this.password, function(err, isMatch) {
//    if (err) return cb(err);
//    cb(null, isMatch);
//  });
//};
//
//UserSchema.pre('save', function(callback) {
//  var user = this;
//
//  // Break out if the password hasn't changed
//  if (!user.isModified('password')) return callback();
//
//  // Password changed so we need to hash it
//  bcrypt.genSalt(5, function(err, salt) {
//    if (err) return callback(err);
//
//    bcrypt.hash(user.password, salt, null, function(err, hash) {
//      if (err) return callback(err);
//      user.password = hash;
//      callback();
//    });
//  });
//});
//
//module.exports = mongoose.model('UserModel', UserSchema);
