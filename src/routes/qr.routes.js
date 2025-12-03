// src/routes/qr.routes.js
const router = require('express').Router();
const { authRequired } = require('../middlewares/auth.middleware');
const { createQrSession } = require('../controllers/qr.controller');

router.post('/create', authRequired, createQrSession);

module.exports = router;
