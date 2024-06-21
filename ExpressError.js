
//extends used for inheriting properties from one to another
class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

}

module.exports = ExpressError;
