var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./cell');

var cellSchema = mongoose.model('Cell').schema;

var gridSchema = new Schema({
    image: { type: String },
    dfId: { type: Number },
    cells: [cellSchema]
});

module.exports = mongoose.model('Grid', gridSchema);