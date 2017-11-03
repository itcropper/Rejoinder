var mongo = require('mongoose');
    Schema = mongo.Schema;

module.exports = mongo.model('UserModel', new Schema({
    user_name:String,
    name: String,
    user_profile_img_url: String,
    user_id: String,
    account_token: String,
    created_at: {type: Date, default: Date.now},
    last_signed_in:{type: Date, default: Date.now},
}));
