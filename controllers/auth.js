const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc    Register User
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });
    
    sendTokenResponse(user, 200, res)
});


// @desc    Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    //Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and a password', 400))
    }
    
    //Check for user
    const user = await User.findOne({ email }).select('+password')         //NOTE 1
    
    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401))    //401, unauthorised access
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password)
    
    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }
    
    sendTokenResponse(user, 200, res)
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();
   
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly: true               //footnote 5
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true       //Add layer of cookie security in production mode
    }

    res
      .status(statusCode)
      .cookie('token', token, options)   //foot note 4
      .json({
          success: true,
          token
      })         
}

// @desc    Get current logged in user
//@route    GET /api/v1/auth/login
//@access   Public
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id) 
    
    res.status(200).json({
        success: true,
        data: user
    })
})

//   1.model mei i have selected: false, the pass, along with user doc, pass wont be passed along, but now I needed it so i changed that
//   2.In, login I've to do password,email validation myself, they are not giong to run through mongoose validators, as nothing is being written to databse
//   3.cookie-parser will give us availibility of req.cookies, it parses the Cookie header and populates req.cookies with an obj keyed by cookie name. ( valued by its value)
//   4.Creating a cookie takes res.cookie(nameOfCookie, token, options=expiruDateOfCookie)
//   5.clientside pe ,cookie cant be accessed

// Status codes 
 //200 ok success
 //401 unauthorised access
 