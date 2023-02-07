class expressError extends Error{
    constructor(message,statuscode){
        super();//this will inherit all the parents methods and value to child class.
        this.message=message
        this.statuscode=statuscode
    }
}
module.exports=expressError;