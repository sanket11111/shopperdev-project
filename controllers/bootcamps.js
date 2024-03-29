const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    
   res.status(200).json(res.advancedResults);
   
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
   //   try {
   const bootcamp = await Bootcamp.findById(req.params.id )
   
   if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)) //'return' or it will say headers are already sent
   }
   
   bootcamp.remove() 
   res.status(200).json({ success: true, data: {}})
   // } catch (err) {
   //  next(err)
   // }
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

// @desc    Upload photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
   
   const bootcamp = await Bootcamp.findById(req.params.id )
   
   if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)) //'return' or it will say headers are already sent
   }
   
   if(!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400)) 
   }
   console.log(req.files.file)
   const file = req.files.file
   
   //Make sure the image is a photo
   if(!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400))
   }
   
   //Check filesize
   if(file.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
   }
   
   //Create custom filename
   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
   
   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if(err) {
         console.log(err)
         return next(new ErrorResponse(`Problem with file upload`,500))   
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

      res.status(200).json({
         success: true, 
         data: file.name
      })
   })
})




//  Notes
//we'll handle error related thing in error handler, do next(err)

//you can catch whatever errors you want in your handlers,
//and if you explicitly want to send your own made up error from controller, do a new errorResponsnse 

//asyncHandler func lega, and resolve karega, error aane se catch chaladega
//possibility, dry principle: 'dont repeat yourself'
//saare controller ka catch ye chalaega
//just like saare controller ki error handling error.js mei hogi
//we are repeating ourselves lesser