module.exports = function(app){
    app.get('/api/grid', function(req, res){
        res.send('It works!');
    });
}