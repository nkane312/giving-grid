var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./cell');

var CellSchema = mongoose.model('Cell').schema;

var GridSchema = new Schema({
    image: { type: String },
    dfId: { type: Number },
    campaign: { type: String },
    version: { type: Number },
    cells: [CellSchema]
});

module.exports = mongoose.model('Grid', GridSchema);