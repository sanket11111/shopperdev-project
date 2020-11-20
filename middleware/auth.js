const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }
    
    // else if(req.cookies.token) {     //We'll be sending in req header
    //     token = req.cookies.token
    // }

    // Make sure token exists
    if(!token) {
        return next(new ErrorResponse('Not authorizes to access this route'), 401)
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      console.log(decoded)

      req.user = await User.findById(decoded.id)

      next()
    } catch (e) {
        return next(new ErrorResponse('Not authorizes to access this route'), 401)
    }
})


//Only I have the secret key, i'm matching Tokens secret key with my copy, if it matches i'll know this token was assigned by me 
 //some time ago, Cause i put the secret key on it in the first place. It is my signature