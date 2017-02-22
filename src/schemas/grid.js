var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./cell');

var CellSchema = mongoose.model('Cell').schema;

var GridSchema = new Schema({
    image: { type: String },
    dfId: { type: Number },
    lvlId: { type: Number },
    campaign: { type: String },
    version: { type: Number },
    headline: { type: String },
    description: { type: String },
    cells: [CellSchema]
});

module.exports = mongoose.model('Grid', GridSchema);