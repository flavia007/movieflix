var Genre = require('../models/genre.server.model.js');


var GenreCtrl = {
    
    //Returns promise object when adding new genres
    addGenre : function(genreItem){
         return Genre.findOneAndUpdate(
                { genreType: genreItem },
                {$set: { genreType: genreItem }} ,
                {new:true,upsert: true}
        );
    }
    
}

module.exports = GenreCtrl;