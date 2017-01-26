var mongoose = require('mongoose');
var Grid = require('../../src/schemas/grid');
module.exports = function(app){
    app.get('/api/grid', function(req, res){
        var id = req.query.id;
        Grid.findOne({'_id': id}, function(err, grids){
            if(err){
                console.log(`Error: ${err}`);
            }
            else {
                res.send(grids);
            }
        });
    });
    app.post('/api/grid', function(req, res){
        res.send('Success');
    });
}