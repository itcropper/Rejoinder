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
    passport = require('passport'),
    cParser = require('cookie-parser'),
    router = require('./router'),
    session = require('express-session'),
    bodyParser = require('body-parser');


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

app.use(session({
  key: "mysite.sid.uid.whatever",
  secret: process.env["SESSION_SECRET"],
  cookie: {
    maxAge: 2678400000 // 31 days
  }  
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cParser());
app.enable('trust proxy'); // add this line

app.use('/static', express.static(path.join(__dirname, 'build')))
app.set('view engine', 'ejs');


router = new router(app);


app.listen(PORT, function(){
    console.log(`Listening on 127.0.0.1/${PORT}`);
});