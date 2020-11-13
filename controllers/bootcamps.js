const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
  
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ success: true, count: bootcamps.length, bootcamps: bootcamps });
  
});

// @desc    Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
   const bootcamp = await Bootcamp.findById(req.params.id) 

   //for a correctly formatted objectId, which doesnt exist
   if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)) //'return' or it will say headers are already sent
   }

   res.status(200).json({ success: true, data: bootcamp})
})

// @desc    Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
 
    const data = await Bootcamp.create(req.body)
    res.status(200).json({ success: true, data: data });

  
})

// @desc    Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
  
   const bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
     new: true,
     useFindAndModify: false,
     runValidators: true
   })
  
   if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)) //'return' or it will say headers are already sent
   }

   res.status(200).json({ success: true, data: bootcamp})
 
})

// @desc    Delete a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async(req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findOneAndDelete({ _id: req.params.id })
   
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)) //'return' or it will say headers are already sent
     }
 
    res.status(200).json({ success: true, data: {}})
   } catch (err) {
    next(err)
   }
})

// @desc    Get bootcamps within a radius 
//@route    DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampRadius = asyncHandler(async(req, res, next) => {
   const { zipcode, distance } = req.params

   //get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode)
   const lat = loc[0].latitude
   const lng = loc[0].longitude

   //Calc radius using radians
   //Divide dist by radius of Earth
   //Earth Radius = 3,963 miles / 6,378 km
   const radius = distance/3963

   const bootcamps = await Bootcamp.find({
      location : {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
   })

   res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
   })
})

//we'll handle error related thing in error handler, do next(err)

//you can catch whatever errors you want in your handlers,
//and if you explicitly want to send your own made up error from controller, do a new errorResponsnse 

//asyncHandler func lega, and resolve karega, error aane se catch chaladega
 //possibility, dry principle: 'dont repeat yourself'
 //saare controller ka catch ye chalaega
 //just like saare controller ki error handling error.js mei hogi
 //we are repeating ourselves lesser