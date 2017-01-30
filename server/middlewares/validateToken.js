var jwt = require('jsonwebtoken');
var database_config = require('../config');
var MovieFlixError = require('../controllers/ErrorController.js');
var User = require('../models/user.server.model.js');
var mongoose = require('mongoose');

//var router = require('../routes/routes.js');

//except authenticate all other routes should be used to verify token.
//So a middleware route should be created
//the middleware route should be present after authenticate and before other routes for it to act as middleware order is important

//route middleware to identify a token

var AuthMiddleware ={
    validateToken : function(req,res,next){
        //token can be present in any of the url parameters, headers or body
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        //decoding token
        if(token){
            jwt.verify(token,database_config.secret,function(err,decoded){
                if(err){
                    return res.status(401).json(new MovieFlixError('Authentication failed.','').sendErrMessage());
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else{
            return res.status(401).send(new MovieFlixError('Not able to authenticate user.','').sendErrMessage());
        }
    },
    
    authorizeUser : function(req,res,next){
        User.findById(mongoose.Types.ObjectId(req.body.userid)).then(
            function(user){
                if(user.roles.indexOf('admin') != -1)
                {
                    next();
                }
                else{
                    return res.status(403).send(new MovieFlixError('You are not authorized to perform this operation.','').sendErrMessage());
                }
            },function(err){
                return res.status(401).send(new MovieFlixError('Not able to authenticate user.','').sendErrMessage());
            });
    }
    
}
module.exports = AuthMiddleware;