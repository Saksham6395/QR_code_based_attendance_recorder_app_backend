// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  return token;
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { name, email, password, role = 'student' } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hash, role]
    );

    return res.status(201).json({
      success: true,
      message: 'User registered',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    return res.json({
      success: true,
      message: 'Current user',
      data: req.user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  register,
  me
};
