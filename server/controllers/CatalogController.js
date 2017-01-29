var Genre = require('../models/genre.server.model.js');
var Catalog = require('../models/catalog.server.model.js');
var MovieFlixError = require('../controllers/ErrorController.js');
var GenreCtrl = require('../controllers/GenreController.js');


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
           return GenreCtrl.addGenre(genreItem);
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
        Catalog.find({}).populate('genre','genreType')
            .then(function(catalog){
                    res.json({success:'true',
                              data:{
                                  catalog:catalog
                              },
                    }); 
        
            },function(err){
                console.log(err);
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
                console.log(err);
                return res.status(500).send(new MovieFlixError("",err).sendErrMessage());
            
            });
    }
}

module.exports = catalog;