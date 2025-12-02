// src/routes/attendance.routes.js
const router = require('express').Router();
const { authRequired } = require('../middlewares/auth.middleware');
const { markAttendance, exportAttendance } = require('../controllers/attendance.controller');

router.post('/mark', authRequired, markAttendance);
router.get('/export', authRequired, exportAttendance);

module.exports = router;
