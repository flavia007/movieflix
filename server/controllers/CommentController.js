var Catalog = require('../models/catalog.server.model.js');
var User = require('../models/user.server.model.js');
var Comment = require('../models/comment.server.model.js');
var MovieFlixError = require('../controllers/ErrorController.js');
var mongoose = require('mongoose');


var CommentCtrl = {
    
    //Returns promise object when adding new genres
    addComment : function(req,res){
        User.findById(req.body.userid)
            .then(function(response){
                Catalog.findById(req.body.catalogid)
                    .then(function(response){

                        var commentItem = new Comment({
                            userid:req.body.userid,
                            catalogid:req.body.catalogid,
                            comment:req.body.comment,
                            rating:req.body.rating                   
                        });
                    
                        commentItem.save().then(function(comment){
                            res.json({success:true,message:"Comment saved Successfully",comment:comment});
                        },function(err){
                            res.status(400).json((new MovieFlixError("",err)).sendErrMessage());
                        });
                    
                    },function(err){
                        res.status(400).json((new MovieFlixError("Not a valid catalog item.","")).sendErrMessage());
                });

            },function(err){
                    res.status(400).json((new MovieFlixError("Not a valid user.","")).sendErrMessage());
        });
    },
    
    //function used to get data of one catalog by Id
    getOneByCatalogId:function(req,res){
        Comment.find({catalogid: mongoose.Types.ObjectId(req.params.catalog_id)})//.populate('userid')
        .then(function(comments){
                console.log(comments);
                res.json({success:'true',
                          data:{
                              comments:comments
                          },
                }); 
    
        },function(err){
            return res.status(500).send(new MovieFlixError("",err).sendErrMessage());
        });
    }
    
}

module.exports = CommentCtrl;