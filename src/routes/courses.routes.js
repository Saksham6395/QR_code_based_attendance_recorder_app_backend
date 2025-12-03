// src/routes/courses.routes.js
const router = require('express').Router();
const { authRequired } = require('../middlewares/auth.middleware');
const { getCoursesByFaculty, getStudentsByCourse } = require('../controllers/courses.controller');

router.get('/faculty/:facultyId', authRequired, getCoursesByFaculty);
router.get('/:courseId/students', authRequired, getStudentsByCourse);

module.exports = router;
