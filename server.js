try{
    require('./env').load();
}
catch(e){
    console.log('not local');
}


var express = require('express'),
    app = express(),
    path = require('path'),
    ig = require('./data/instagram'),
    http = require('http').createServer(app),
    mongo = require('mongoose'),
    guid = require('./guid'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    logger = require('morgan'),
    mongoStore = require('connect-mongo')(session);
    


var PORT = process.env.PORT || 8000,
    MONGOOSE_PORT =
      process.env.MONGODB_URI ||
      process.env.MONGOLAB_URI || 
      process.env.MONGOHQ_URL  || 
      'mongodb://localhost:27017/test';

mongo.connect(MONGOOSE_PORT, { useMongoClient: true });

mongo.Promise = global.Promise;
const db = mongo.connection;

db.on('error', function(err){
    console.warn('could not connect to mongo!');
});

db.once('open', function(){
    console.log('Connected to Mongo.');
});

app.use('/static', express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'))
app.use(
    session(
        { 
          secret: process.env.SESSION_SECRET,
          saveUninitialized: true,
          resave: true,
          store: new mongoStore({ mongooseConnection: db})
        })
);
const passport = require('./auth/passport');
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());
require('./router')(app);


app.listen(PORT, function(){
    console.log(`Listening on 127.0.0.1/${PORT}`);
});

console.log("TIME::----> " + new Date().toLocaleString());