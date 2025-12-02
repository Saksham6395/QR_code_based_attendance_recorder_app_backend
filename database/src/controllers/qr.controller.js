// src/controllers/qr.controller.js
const { query } = require('../config/db');
const { encrypt } = require('../utils/crypto');

async function createQrSession(req, res, next) {
  try {
    const facultyId = req.user.id;
    const { courseId, facultyLat, facultyLon, expiresInSeconds = 120 } = req.body;

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const payload = {
      courseId,
      facultyId,
      lat: facultyLat,
      lon: facultyLon,
      exp: expiresAt.toISOString()
    };

    const secret = process.env.JWT_SECRET || 'dummy';
    const encryptedPayload = encrypt(JSON.stringify(payload), secret);

    const sessionToken = Buffer.from(
      JSON.stringify(encryptedPayload)
    ).toString('base64url');

    const { rows } = await query(
      `INSERT INTO qr_sessions (course_id, faculty_id, session_token, faculty_lat, faculty_lon, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, session_token, expires_at`,
      [courseId, facultyId, sessionToken, facultyLat, facultyLon, expiresAt]
    );

    return res.json({
      success: true,
      message: 'QR session created',
      data: {
        sessionToken,
        expiresAt: rows[0].expires_at,
        encryptedPayload
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createQrSession
};
