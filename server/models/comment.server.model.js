var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    userid:{type:Schema.Types.ObjectId,ref:'User',required:true},
    catalogid:{type:Schema.Types.ObjectId,ref:'Catalog',required:true},
    comment : {type:String},
    rating :{type:Number,max:5,required:true}
});

CommentSchema.index({ userid : 1, catalogid : 1},{unique:true});

module.exports = mongoose.model('Comment',CommentSchema);
