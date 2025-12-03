// src/controllers/courses.controller.js
const { query } = require('../config/db');

async function getCoursesByFaculty(req, res, next) {
  try {
    const facultyId = Number(req.params.facultyId);
    const { rows } = await query(
      'SELECT * FROM courses WHERE faculty_id = $1 ORDER BY id',
      [facultyId]
    );

    return res.json({
      success: true,
      message: 'Courses fetched',
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

async function getStudentsByCourse(req, res, next) {
  try {
    const courseId = Number(req.params.courseId);
    const { rows } = await query(
      `SELECT u.id, u.name, u.email
       FROM enrollments e
       JOIN users u ON u.id = e.student_id
       WHERE e.course_id = $1`,
      [courseId]
    );

    return res.json({
      success: true,
      message: 'Students fetched',
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCoursesByFaculty,
  getStudentsByCourse
};
