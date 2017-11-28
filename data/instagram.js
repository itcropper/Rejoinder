(function(){

    var igApi = require('instagram-node').instagram(),
        request = require('request'),
        User = require('../models/UserModel'),
        path = require('path'),
        mongo = require('mongoose');

    var endpoints = {
        getUser: (a) => `https://api.instagram.com/v1/users/self/?access_token=${a}`,
        findPostById: (id, a) => `https://api.instagram.com/v1/media/${id}?access_token=${a}`,
        findMediaByTag: (tag, a, mintag=null) => `https://api.instagram.com/v1/tags/${tag}/media/recent?access_token=${a}&MIN_TAG_ID=${mintag}`,
        getUserRelationships: (uid, a) => `https://api.instagram.com/v1/users/${uid}/relationship?access_token=${a}`,
        getPostsByUser: (uid, a) => `https://api.instagram.com/v1/users/${uid}/media/recent/?access_token=${a}`
        
    };



    exports.createNewUser = function(access_token, callback) {

        request(endpoints.getUser(access_token), (err, headers, body) => {

            if(err){ 
                console.log("failed to get user ", err);
                return callback(err);
            }

            var data = JSON.parse(body).data;

            var user = new User({
                user_name: data.username,
                name: data.full_name,
                user_id: data.id,
                account_token: access_token,
                user_profile_img_url: data.profile_picture
            });

            user.save(function(err, response){
                if(err){return callback(err);}
                return callback(null, response);
            });

        });
    }

    exports.findById = function(id, callback){

        var id = req.params.id,
            access_token = req.user.account_token;

        request(endpoints.findPostById(id, access_token), (err, body, response) => {
            if(err){
                return callback(error);
            }
            return callback(null, body);
        });

    }

    exports.getUserFeed = function(user_id, callback){
        
    }

    exports.findByTags = function(req, callback){
        var tags = req.query.tag,
            mintag = req.query.mintagid
            access_token = req.user.account_token;
        
        console.log('tags ---->', tags);
        if(!Array.isArray(tags)){
            tags = [tags];
        }
        
        function requestAsync(url){
            return new Promise(function(res, rej){
                request(url, (err, b, result) => {
                    if(err) return rej(err);
                    var data;
                    try{
                        data = JSON.parse(result).data;
                    }catch(e){
                        rej(e);
                    }
                    if(!data){
                        return res({});
                    }
                    return res(data.map((m => {
                        return {
                            id: m.id,
                            images: m.images,
                            created_time: new Date(parseInt(m.created_time) * 1000),
                            author: {
                                name: m.caption.from.full_name,
                                username: m.caption.from.username
                            },
                            likes: m.likes,
                            caption: m.caption.text,
                            videos: m.videos,
                            location: m.location,
                            tags: m.tags
                        };
                    })));
                });
            })
        }
        
        Promise
        .all(tags.map(t => requestAsync(endpoints.findMediaByTag(t, access_token, mintag))))
        .then(function(data) {
            var flattened = data.reduce((base, cur) => base.concat(...cur));
            var s = {};
            flattened.map(d => s[d.id] = d);
            callback(null,  Object.keys(s).map(key => s[key]));
        }, function(message){
            console.log("Error on instagram stuff", message);
        });
    }
})()