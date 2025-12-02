// src/controllers/attendance.controller.js
const { markAttendance, getAttendanceRows } = require('../services/attendance.service');
const { rowsToExcelBuffer } = require('../utils/excel');

async function markAttendanceController(req, res, next) {
  try {
    const { sessionToken, courseId, studentLat, studentLon } = req.body;
    const studentId = req.user.id;

    const result = await markAttendance({
      sessionToken,
      courseId,
      studentId,
      studentLat,
      studentLon
    });

    return res.json({
      success: true,
      message: 'Attendance marked',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function exportAttendance(req, res, next) {
  try {
    const courseId = Number(req.query.course_id);
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'course_id query param is required'
      });
    }

    const rows = await getAttendanceRows(courseId);
    const buffer = rowsToExcelBuffer(rows, 'Attendance');

    res.setHeader('Content-Disposition', `attachment; filename=attendance_course_${courseId}.xlsx`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    return res.send(buffer);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  markAttendance: markAttendanceController,
  exportAttendance
};
