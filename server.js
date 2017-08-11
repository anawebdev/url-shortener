'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

// Database
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

// Mount the POST body-parser
app.use(bodyParser.json());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true}));// to support URL-encoded bodies
app.post('/api/shorturl/new', function(req,res){
  var url = req.body.url;
  console.log(req.body.url);
})

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});



  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});