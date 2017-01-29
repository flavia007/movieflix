var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    genreType : {type:String,unique:true}
});

module.exports = mongoose.model('Genre',GenreSchema);
