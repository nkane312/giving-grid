var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CellSchema = new Schema({
    dollarValue: { type: Number },
    class: { type: String }
})

module.exports = mongoose.model('Cell', CellSchema);