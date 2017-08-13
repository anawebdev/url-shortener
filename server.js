'use strict';

var express = require('express');
var app = express();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var env = require('node-env-file');

// Reads from .env file
env(__dirname + '/.env');

var cors = require('cors');
app.use(cors());

// Database
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})

// Check for db errors
db.on('error', function(error){
  console.log('Did not connect to MongoDB. Error: ' + error);
});

// Bring in the Model
var LinkInfo = require('./models/links.js');

// Mount the POST body-parser
app.use(bodyParser.json());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true}));// to support URL-encoded bodies

// Display Homepage
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// API
app.post('/api/shorturl/new', function(req,res){
  var oldUrl = req.body.url;
  var newUrl = Date.now()%100000;

  // Regex from https://gist.github.com/dperini/729294
  var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  if (regex.test(oldUrl)){

    var addLink = new LinkInfo({fullLink: oldUrl, shortLink:newUrl});

    //check database for duplicates
    //!!! due to a very small db, it is very unlikely there will be newUrl duplicates
    LinkInfo.findOne({"fullLink": oldUrl}, function(err,link){
      if(err) throw err;
      if(link===null){//if there are no duplicates
          addLink.save(); // add object to database
          return res.json({ // return object
          original_url: oldUrl, 
          short_url:newUrl
        })
      } else {//if there are duplicates
        return res.json({
          original_url: oldUrl, 
          short_url: link.shortLink
        })
      }
    });
  } else {
      return res.json({
        "error":"invalid URL"
      })
    }
});

// Retrieve link from database and redirect to it
app.get('/:code', function(req,res){

  var code = req.params.code.toString();

  LinkInfo.findOne({"shortLink":code}, function(err,result){

    if (err) throw err;

    if(result===null) {
      res.json({error: "link does not exist in database"});
    } else {
      res.redirect(result.fullLink);
    }
  })
});

// Connect to port 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Node.js listening ...');
});