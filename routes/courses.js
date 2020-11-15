const express = require("express");
const router = express.Router({mergeParams: true});

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courses");
// const {route } = require("./bootcamps");

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')

// router.route(route).get(getCourses)
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name '
}),getCourses).post(addCourse)

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router