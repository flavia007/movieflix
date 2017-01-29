var jwt = require('jsonwebtoken');
var database_config = require('../config');
var User = require('../models/user.server.model.js');
var MovieFlixError = require('../controllers/ErrorController.js');


var auth = {
    
    //fucntion which will be used to check for username and password and return jwt token
    login : function(req,res){
        User.findOne({username:req.body.username}).then(function(user){
            if(!user){
                return res.status(401).send(new MovieFlixError('Username or password incorrect.Authenticaton failed.','').sendErrMessage());
            }
            else{

                if(user.password != req.body.password){
                    return res.status(401).json(new MovieFlixError('Username or password incorrect.Authentication failed.','').sendErrMessage()); 
                }
                else{
                   var token = jwt.sign({data:user.username},database_config.secret,{
                        expiresIn:'1d'//24hrs
                    });
                    res.json({success:'true',
                              message:"Login Successful.",
                              username:user.username,
                              token:token
                    });  
                }
            }
        },function(err){
            return res.status(401).send(new MovieFlixError("",err).sendErrMessage());
            
        });
    },
    
    //function used to create new user
    signup : function(req,res){
        //create user from mongodb model
        var newuser = new User({
            username: req.body.username,
            password:  req.body.password,
            firstname:  req.body.firstname,
            lastname:  req.body.lastname,
            emailId:  req.body.emailId,
            contactno: req.body.contactno,
            roles :req.body.roles,
        });

        newuser.save().then(function(user){
            res.json({success:true,message:"User saved Successfully",user:user});
        },function(err){
            res.status(400).json((new MovieFlixError("",err)).sendErrMessage());
        });
    }
    
}

module.exports = auth;