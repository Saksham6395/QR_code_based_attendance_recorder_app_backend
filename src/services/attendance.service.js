// src/services/attendance.service.js
const { query } = require('../config/db');

// Simple distance calc (meters) – if you later want GPS checks
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // meters
}

async function findQrSession(sessionToken) {
  const { rows } = await query(
    'SELECT * FROM qr_sessions WHERE session_token = $1',
    [sessionToken]
  );
  return rows[0] || null;
}

async function isStudentEnrolled(courseId, studentId) {
  const { rows } = await query(
    'SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2',
    [courseId, studentId]
  );
  return rows.length > 0;
}

async function hasAlreadyMarked(courseId, studentId, sessionId) {
  const { rows } = await query(
    'SELECT 1 FROM attendance WHERE course_id = $1 AND student_id = $2 AND session_id = $3',
    [courseId, studentId, sessionId]
  );
  return rows.length > 0;
}

async function markAttendance({ sessionToken, courseId, studentId, studentLat, studentLon }) {
  const session = await findQrSession(sessionToken);
  if (!session) {
    const err = new Error('Invalid session token');
    err.status = 400;
    throw err;
  }

  if (session.course_id !== courseId) {
    const err = new Error('QR does not belong to this course');
    err.status = 400;
    throw err;
  }

  if (new Date(session.expires_at) < new Date()) {
    const err = new Error('Session expired');
    err.status = 400;
    throw err;
  }

  const enrolled = await isStudentEnrolled(courseId, studentId);
  if (!enrolled) {
    const err = new Error('Student not enrolled in course');
    err.status = 403;
    throw err;
  }

  // Optional GPS check if qr_sessions has lat/lon columns
  if (session.faculty_lat && session.faculty_lon && studentLat && studentLon) {
    const distance = haversineDistance(
      session.faculty_lat,
      session.faculty_lon,
      studentLat,
      studentLon
    );

    const allowedRadius = 50; // meters – tune later
    if (distance > allowedRadius) {
      const err = new Error('You are too far from the classroom');
      err.status = 403;
      throw err;
    }
  }

  const already = await hasAlreadyMarked(courseId, studentId, session.id);
  if (already) {
    const err = new Error('Attendance already marked');
    err.status = 400;
    throw err;
  }

  await query(
    `INSERT INTO attendance (course_id, student_id, session_id, marked_at)
     VALUES ($1, $2, $3, NOW())`,
    [courseId, studentId, session.id]
  );

  return { ok: true };
}

async function getAttendanceRows(courseId) {
  const { rows } = await query(
    `SELECT a.id,
            u.name AS student_name,
            u.email,
            a.marked_at
     FROM attendance a
     JOIN users u ON u.id = a.student_id
     WHERE a.course_id = $1
     ORDER BY a.marked_at ASC`,
    [courseId]
  );
  return rows;
}

module.exports = {
  markAttendance,
  getAttendanceRows
};
