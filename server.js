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
    passport = require('./auth/passport'),
    guid = require('./guid'),
    bodyParser = require('body-parser'),
    session = require('express-session');


var PORT = process.env.PORT || 8000,
    MONGOOSE_PORT =
      process.env.MONGODB_URI ||
      process.env.MONGOLAB_URI || 
      process.env.MONGOHQ_URL  || 
      'mongodb://localhost:27017;';

mongo.connect(MONGOOSE_PORT, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + MONGOOSE_PORT + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + MONGOOSE_PORT);
  }
});

app.use('/static', express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(
    session(
        { 
          secret: guid(),
          saveUninitialized: true,
          resave: true
        }
    )
);
app.use(passport.initialize());
app.use(passport.session());
require('./router')(app);

app.listen(PORT, function(){
    console.log(`Listening on 127.0.0.1/${PORT}`);
});

console.log("TIME::----> " + new Date().toLocaleString());