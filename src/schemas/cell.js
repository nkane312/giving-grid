var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cellSchema = new Schema({
    dollarValue: { type: Number },
    class: { type: String }
})

module.exports = mongoose.model('Cell', cellSchema);