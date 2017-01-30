var Genre = require('../models/genre.server.model.js');
var Catalog = require('../models/catalog.server.model.js');
var MovieFlixError = require('../controllers/ErrorController.js');
var GenreCtrl = require('../controllers/GenreController.js');
var mongoose = require('mongoose');



var catalog = {
    
    //function used to add a new movie or series
    addCatalog: function(req,res){
        
        var catalogItem = new Catalog({
            title: req.body.title,
            year:  req.body.year,
            rated:  req.body.rated,
            released: req.body.released ,
            runtime:  req.body.runtime,
            genre:[],
            director: req.body.director,
            writer:req.body.writer,
            actors:req.body.actors,
            plot: req.body.plot,
            language:req.body.language,
            country:req.body.country,
            awards:req.body.awards,
            poster:req.body.poster,
            metaScore:req.body.metaScore,
            imdbRating:req.body.imdbRating,
            imdbVotes:req.body.imdbVotes,
            imdbId:req.body.imdbId,
            type:req.body.type
        });

        var genrePromises = req.body.genre.map(function(genreItem){
           return GenreCtrl.addUpdateGenre(genreItem);
        });
        
        Promise.all(genrePromises).then(function(genresuccess){
            genresuccess.map(function(genreItem){
                catalogItem.genre.push(genreItem._id); 
                return;
            });
            catalogItem.save().then(function(data){
                res.json({success:true,message:"Catalog data saved Successfully",catalog:data});

            },function(err){
                res.status(500).json((new MovieFlixError("",err)).sendErrMessage());

        });
        },function(err){
            res.status(500).json((new MovieFlixError("Error occured while saving genres.Catalog not saved.","")).sendErrMessage());
        });        

    },
    
    //function used to get all catalog data
    getAll:function(req,res){
        var catalogFilter = {};
        var genreFilter = {};
        var sort={};

        if(req.query.type)
        {
            catalogFilter.type={
                $in : (req.query.type).split(',')
            };
        }
        
        if(req.query.year)
        {
            catalogFilter.year={
                $in : (req.query.year).split(',')
            }; 
        }
        
        if(req.query.genre)
        {
            genreFilter.genreType = {
                $in:(req.query.genre).split(',')
            };
        }
        
        if(req.query.search){
            catalogFilter = {
                $text:{$search:req.query.search}
            }
        }
        
        if(req.query.sort){
            sort[req.query.sort] = -1;
        }
        else{
            sort={
                imdbRating:-1,
                imdbVotes:-1,
                year:-1
            }
        }
        
        Catalog.find(catalogFilter).populate({
            path:'genre',
            match:genreFilter,
            select:'genreType'
        }).then(function(catalog){
            var catalogIds = [];
            catalog.filter(function(item){
                if(item.genre.length > 0)
                {
                    catalogIds.push(mongoose.Types.ObjectId(item._id));
                    return item._id;
                }
            });
            
            if(catalogIds.length != 0)
            {
                if(catalogIds.length != 0)
                {
                    Catalog.find({_id:{$in:catalogIds}}).populate({
                        path:'genre',
                    }).sort(sort)
                    .then(function(test){
                        res.json({success:'true',data:{catalog:test},}); 
                    },function(err){
                        return res.status(500).send(new MovieFlixError("",err).sendErrMessage());
                    });
                }
                else{
                    res.json({success:'true',data:{catalog:[]},}); 
                }
            }
            else{
                res.json({success:'true',data:{catalog:[]},}); 
            }
        },function(err){
            return res.status(500).send(new MovieFlixError("",err).sendErrMessage());
        });
            
            
    },
    
    //function used to get data of one catalog by Id
    getOneById:function(req,res){
            Catalog.findById(req.params.catalog_id).populate('genre','genreType')
            .then(function(catalog){
                    res.json({success:'true',
                              data:{
                                  catalog:catalog
                              },
                    }); 
        
            },function(err){
                return res.status(500).send(new MovieFlixError("",err).sendErrMessage());
            
            });
    },
    
    update:function(req,res){
        var catalogItemUpdate = new Catalog({
            title: req.body.title,
            year:  req.body.year,
            rated:  req.body.rated,
            released: req.body.released ,
            runtime:  req.body.runtime,
            genre:[],
            director: req.body.director,
            writer:req.body.writer,
            actors:req.body.actors,
            plot: req.body.plot,
            language:req.body.language,
            country:req.body.country,
            awards:req.body.awards,
            poster:req.body.poster,
            metaScore:req.body.metaScore,
            imdbRating:req.body.imdbRating,
            imdbVotes:req.body.imdbVotes,
            imdbId:req.body.imdbId,
            type:req.body.type
        });

        var genrePromises = req.body.genre.map(function(genreItem){
           return GenreCtrl.addUpdateGenre(genreItem);
        });
        
        Promise.all(genrePromises).then(function(genresuccess){
            genresuccess.map(function(genreItem){
                catalogItemUpdate.genre.push(genreItem._id); 
                return;
            });
            Catalog.update({_id:req.params.catalog_id},{$set:catalogItemUpdate})
                .then(function(data){
                    res.json({success:true,message:"Catalog data updated Successfully",catalog:data});
                },function(err){
                    res.status(500).json((new MovieFlixError("",err)).sendErrMessage());
                });
        },function(err){
            res.status(500).json((new MovieFlixError("Failed to update genres.Try again later","")).sendErrMessage());
        });
    },
    
    delete:function(req,res){
        Catalog.findByIdAndRemove( req.params.catalog_id )
            .then(function(catalog){
                    res.json({success:'true',
                              message:"Catalog data deleted Successfully",
                    }); 
        
            },function(err){
                return res.status(500).send(new MovieFlixError("Some error occured while deleting catalog.","").sendErrMessage());
            
            });;
    }
}

module.exports = catalog;