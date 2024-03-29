const express = require("express");
const router = express.Router({mergeParams: true});

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courses");
const { protect } = require("../middleware/auth");

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')

// router.route(route).get(getCourses)
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name '
}),getCourses).post(protect, addCourse)

router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse)

module.exports = router