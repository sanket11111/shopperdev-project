const asyncHandler = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncHandler

//async has access to req,res obj, it is a middlware...can be directly used
 //that req will go through router senikal ke and controller mei ghusne sepehle