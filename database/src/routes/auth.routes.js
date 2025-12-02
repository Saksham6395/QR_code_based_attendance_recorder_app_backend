// src/routes/auth.routes.js
const router = require('express').Router();
const validate = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validations/auth.validation');
const { login, register, me } = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

router.post('/login', validate(loginSchema), login);
router.post('/register', register); // basic for now
router.get('/me', authRequired, me);

module.exports = router;
