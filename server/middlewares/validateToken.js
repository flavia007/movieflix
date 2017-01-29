var jwt = require('jsonwebtoken');
var database_config = require('../config');
var MovieFlixError = require('../controllers/ErrorController.js');

//var router = require('../routes/routes.js');

//except authenticate all other routes should be used to verify token.
//So a middleware route should be created
//the middleware route should be present after authenticate and before other routes for it to act as middleware order is important

//route middleware to identify a token

module.exports = function(req,res,next){
    console.log("Inside validate token");
    //token can be present in any of the url parameters, headers or body
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    //decoding token
    console.log(token);
    if(token){
        jwt.verify(token,database_config.secret,function(err,decoded){
            console.log(err);
            if(err){
                return res.status(401).json(new MovieFlixError('Authentication failed.','').sendErrMessage());
            }
            else{
                console.log("In else");
                req.decoded = decoded;
                console.log(decoded)
                next();
            }
        });
    }
    else{
        return res.status(401).send(new MovieFlixError('Not able to authenticate user.','').sendErrMessage());
    }
};