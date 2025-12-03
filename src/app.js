// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const qrRoutes = require('./routes/qr.routes');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/qr', qrRoutes);
app.use('/attendance', attendanceRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
