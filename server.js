var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//var io = require('socket.io')(app);


app.get('/styles.bundle.css', function(req, res){
    res.sendFile(path.join(__dirname + '/dist/styles.bundle.css'));
});
app.get('/inline.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/inline.bundle.js'));
});
app.get('/vendor.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/vendor.bundle.js'));
});
app.get('/main.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/main.bundle.js'));
});

// Static assets folder
app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(3001, function(){
    console.log('Listening on port 3001');
});

module.exports = app;