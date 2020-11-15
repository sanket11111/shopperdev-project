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

// Include other resourse routers
const courseRouter = require('./courses')

// Re-route into other resource router (router!)
router.use('/:bootcampId/courses', courseRouter)    // /bootcamps/:bootcampId/courses

router.route('/radius/:zipcode/:distance').get(getBootcampRadius)

router.route('/:id/photo').put(bootcampPhotoUpload)

router
   .route("/")
   .get(getBootcamps)
   .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
