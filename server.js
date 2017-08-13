'use strict';

var express = require('express');
var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var env = require('node-env-file');
var dns = require('dns');
var mongoose = require('mongoose');

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

app.post('/api/shorturl/new', function(req,res){
  var oldUrl = req.body.url;
  var newUrl = Date.now()%100000;
  //console.log(newUrl);

  // Modify address
  if(oldUrl.indexOf('http://')!==-1){
    oldUrl = oldUrl.split("").splice(7).join("");
    //console.log(oldUrl);
  }
  if(oldUrl.indexOf('https://')!==-1){
    oldUrl = oldUrl.split("").splice(8).join("");
  }
  if(oldUrl.indexOf('/')!==-1){
    oldUrl = oldUrl.split("").splice(0,oldUrl.indexOf('/')).join("");
  }

  //Check if address is valid
  //console.log(oldUrl);
  dns.lookup(oldUrl, function(err, address){
    if(err) return res.json({error: "invalid URL"});

    var addLink = new LinkInfo({fullLink: oldUrl, shortLink:newUrl});

    //check for oldUrl duplicates
    LinkInfo.find({"fullLink": oldUrl}, function(err,link){
      if(err) throw err;
        //console.log('this is link'+link);
      if(link.oldUrl !== oldUrl){//if the link does not exist in database
        //because the database is so small and the probability of generating shortLink duplicates
        //is almost 0, I am only checking for fullLink duplicates
        addLink.save();
        //console.log("Old url is: " +  oldUrl);
        //console.log("New url is: " +  newUrl);
        //console.log("addLink: " +  addLink);

        return res.json({
          oldURL: oldUrl, 
          newURL:newUrl
        });
      }
    });
    //console.log('link alone is: ' + link);
    //
  })

});

app.get('/:code', function(req,res){
  //console.log(req.params);
  var code = req.params.code.toString();
  LinkInfo.findOne({"shortLink":code}, function(err,result){
    console.log("result is"+result);
    if (err) throw err;
    if(result===null) {
      res.json({error: "link does not exist in database"});
    } else {
      res.redirect("www.google.com");
    }
    

  })
});

app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/new", function (req, res) {
  res.json({oldURL: "old stuff", newURL:"new stuff"});
});


// Connect to port 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Node.js listening ...');
});