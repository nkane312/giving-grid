var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-type, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
mongoose.connect('mongodb://express:SnailFail!2017@ds161109.mlab.com:61109/giving-grid');
var db = mongoose.connection;
require('./src/schemas/grid');
require('./express-routes/api/grid')(app);
db.on('error', console.error.bind(console, 'connection error:'));

// Routes to webpack bundles
app.get('/styles.bundle.css', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/styles.bundle.css'));
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
// Routes to webpack bundled map files
app.get('/styles.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/styles.bundle.map'));
});
app.get('/inline.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/inline.bundle.map'));
});
app.get('/vendor.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/vendor.bundle.map'));
});
app.get('/main.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/main.bundle.map'));
});

// Routes to production webpack bundles
app.get('/styles.*.bundle.css', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/inline.*.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/vendor.*.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/main.*.bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
// Routes to production webpack bundled map files
app.get('/styles.*.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/inline.*.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/vendor.*.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});
app.get('/main.*.bundle.map', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});




// Static assets folder
app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));

app.get('/*.ttf', function(req, res){
    res.sendFile(path.join(__dirname, `/dist/${req.path}`));
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.get('*', function(req, res){
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