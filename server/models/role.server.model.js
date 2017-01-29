var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    rolename     : {type:String, enum: ['user', 'admin']}
});

module.exports = mongoose.model('Role',RoleSchema);
