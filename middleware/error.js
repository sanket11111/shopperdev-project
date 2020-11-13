const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
   let error = { ...err }
   
    //message doesnt directly live in err,
    error.message = err.message

    //log to console
    console.log(err)

    //Mongoose bad objectId error, invalid objectId format
    if(err.name === 'CastError') {
        //Mongodb ka error obj h, has value -> objectId, name
        const message = `Resource not found with id ${err.value} || (invalid objectId)`
        error = new ErrorResponse(message, 404)
    }

    //Mongoose duplicate key
    if(err.code === 11000) {
      const message = 'Duplicate field value entered'
      error = new ErrorResponse(message, 400)      //bad req
    }

    //Mongoose validation error
    if(err.name === 'ValidationError') {
        // Object.values(err.errors).forEach(d => console.log('cccc', d.properties.message))``
        const message = Object.values(err.errors).map(d =>  d.properties.message)
        error = new ErrorResponse(message, 400)   //bad req
    }

    res.status(error.statusCode || 500).json({
        success: false, 
        error: error.message || 'Server error'
    })
}

module.exports = errorHandler


//mongoose errors, 
 //duplicate fields
 //mongoose validation errors 

//plan is controller mei i'll just do next(err) whatever be the error
//and i'll do the handling here
//find out what went wrong from error.name or err.code and write a client friendly err message accordingly
 //error handling is a thing in itself, sahi se karna, go with the flow dont force it