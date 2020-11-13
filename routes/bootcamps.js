const express = require("express");
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampRadius
} = require("../controllers/bootcamps");

router.route('/radius/:zipcode/:distance').get(getBootcampRadius)

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
