var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Genre = require('./genre.server.model.js');


var errorMsgs = {
    required:"{PATH} is required.",
    notvalid:"{PATH} {VALUE} is invalid",
};

var CatalogSchema = new Schema({
    title: {type:String, required:[true,errorMsgs.required]},
    year:  {type:String, required:[true,errorMsgs.required]},
    rated:  {type:String},
    released:  {type:Date, required:[true,errorMsgs.required]},
    runtime:  {type:String, required:[true,errorMsgs.required]},
    genre: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Genre' 
        }
    ],
    director:  [{
            type: String
    }],
    writer:[{
            type: String
    }],
    actors:[{
            type: String
    }],
    plot: {type:String, required:[true,errorMsgs.required]},
    language:[
        {type:String}
    ],
    country:[
        {type:String}
    ],
    awards:{type: String},
    poster:{type:String,required:[true,errorMsgs.required]},
    metaScore:{type:Number},
    imdbRating:{type:Number},
    imdbVotes:{type:Number},
    imdbId:{type:String, required:[true,errorMsgs.required]},
    type:{type:String, required:[true,errorMsgs.required]}
});

CatalogSchema.index({ title : 1, released : 1,imdbId:1},{unique:true});

module.exports = mongoose.model('Catalog',CatalogSchema);
