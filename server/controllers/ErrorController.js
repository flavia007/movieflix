//Module for constructing error messages
var MovieFlixError = function(message,dberrors){
    var success=false;
    this.name = 'MovieFlixError';
    this.message  = message;
    this.dberrors = dberrors;
    this.getSuccess = function(){
        return success;
    }
    this.errors = [];
}

MovieFlixError.prototype = Object.create(Error.prototype);
MovieFlixError.prototype.constructor = MovieFlixError;

MovieFlixError.prototype.success = false;

MovieFlixError.prototype.extractErrMessages = function(){
    if(this.message != ""){
        this.errors.push(this.message);
    }
    else if(this.dberrors){
        if(this.dberrors.errmsg){
           this.errors.push(this.dberrors.errmsg); 
        }
        else{
            //console.log(this.dberrors.errors);

            for(var key in this.dberrors.errors){
                var errorobj = {};
                errorobj.errorfield = this.dberrors.errors[key].path;
                errorobj.error = this.dberrors.errors[key].message;
                this.errors.push(errorobj);
                errorobj = null;
            }
        }
    }
    else{
       this.errors.push("Something went wrong try again later."); 
    }
}

MovieFlixError.prototype.sendErrMessage = function(){
    this.extractErrMessages();
    var obj = {
        success:this.getSuccess(),
        errors:this.errors
    }
    return obj;
}

module.exports= MovieFlixError; 
