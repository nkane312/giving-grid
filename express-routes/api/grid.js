var mongoose = require('mongoose');
var Grid = require('../../src/schemas/grid');
module.exports = function(app){
    const activeCampaign = 'WOE';
    var activeGrid = undefined;
    app.get('/api/grid', function(req, res){
        var id = req.query.id;
        var campaign = req.query.campaign;
        var version = req.query.version;
        if (campaign && version === 'undefined') {
            Grid.find({'campaign': campaign}, function(err, grids){
                if(err){
                    console.log(`Error: ${err}`);
                } else {
                    var active;
                    grids.forEach(function(grid){
                        if(!active){
                            active = grid;
                        } else if(active.version < grid.version){
                            active = grid;
                        } 
                    });
                    res.send(active);
                }
            });
        } else if (campaign && version !== 'undefined') {
            Grid.findOne({'campaign': campaign, 'version': version}, function(err, grid){
                if(err){
                    console.log(`Error: ${err}`);
                } else {
                    res.send(grid);
                }
            });
        } else {
           Grid.find({'campaign': activeCampaign}, function(err, grids){
                if(err){
                    console.log(`Error: ${err}`);
                } else {
                    var active;
                    grids.forEach(function(grid){
                        if(!active){
                            active = grid;
                        } else if(active.version < grid.version){
                            active = grid;
                        } 
                    });
                    res.send(active);
                }
            });
        }
        /*Grid.findOne({'_id': id}, function(err, grid){
            if(err){
                console.log(`Error: ${err}`);
            }
            else {
                res.send(grid);
            }
        });*/
    });
    app.post('/api/grid', function(req, res){
        console.log(req.body);
        Grid.findById(req.body._id, function(err, grid){
            if (err) {
                console.log(err);
            }
            console.log(grid);
        })
        res.send('Success');
    });
}