var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var errorMsgs = {
    required:"{PATH} is required.",
    notvalid:"{PATH} {VALUE} is invalid",
    contactnoValid:"{PATH} should be a valid number.",
    contactnoLen:"{PATH} should be 10 digits."
};

var contactnoValidator = [
    function(val){
        var error = "";
        if(!val){
            error = errorMsgs.required;
            return false;
        }
        else if(!isNaN(val)){
            error = errorMsgs.contactnoValid;
            return false;

        }
        else if(val.length != 10){
            error = errorMsgs.contactnoLen;
            return false;
        }
        else{
            return true;
        }
    },
    "Please enter valid contact no."
];

var UserSchema = new Schema({
    username: {type:String, required:[true,errorMsgs.required], match:[/[a-zA-Z]/,errorMsgs.notvalid],index: { unique: true }},
    password:  {type:String, required:[true,errorMsgs.required]},
    firstname:  {type:String, required:[true,errorMsgs.required]},
    lastname:  {type:String, required:[true,errorMsgs.required]},
    emailId:  {type:String, required:[true,errorMsgs.required],index: { unique: true }},
    contactno: {type:Number,match:[/^[0-9]{10}$/,errorMsgs.contactnoLen],required:[true,errorMsgs.required]},
    roles:  [{
            type: String,
            enum: ['user', 'admin'],
    }],
    created_on:{type:Date, default:Date.now},
    updated_on:{type:Date, default:Date.now}
});

//UserSchema.index({ username : 1, emailId : 1},{unique:true});

//pre save hook for storing user as default role
UserSchema.pre("save",function(next) {
  if (this.roles.length == 0)
    this.roles.push("user");
    
  next();
});

module.exports = mongoose.model('User',UserSchema);
