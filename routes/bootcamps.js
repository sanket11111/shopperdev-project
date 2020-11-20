const express = require("express");
const router = express.Router({ mergeParams: true });  //if you wnt to nest another router from here, we'll be able to merge that router with this
                                                       // /bootcamps -> router -> /some, /somehigelse
                                                      //merge => /bootcmaps/some 
const {          
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

const { protect } = require('../middleware/auth')

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')

// Include other resourse routers
const courseRouter = require('./courses')

// Re-route into other resource router (router!)
router.use('/:bootcampId/courses', courseRouter)    // /bootcamps/:bootcampId/courses

router.route('/radius/:zipcode/:distance').get(getBootcampRadius)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)

router
   .route("/")
   .get(advancedResults(Bootcamp, 'courses'),getBootcamps)
   .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;



//Where we're adding protect, user has to be logged in