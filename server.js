var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes to webpack bundles
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

io.on('connection', function(socket){
    socket.emit('confirmConnection', 'Connected');
});
server.listen(5001, () => {
    console.log('Listening on port 5001');
});

module.exports = app;