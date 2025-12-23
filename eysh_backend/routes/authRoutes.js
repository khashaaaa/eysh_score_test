const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// Configure nodemailer (use your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP for user login
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    // Check if user exists, if not create
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      user = await pool.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [email]);
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    // Save OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await pool.query('INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)', [email, otp, expiresAt]);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Eysh Score Test',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`
    };

    // Send email or log OTP for testing
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        res.json({ message: 'OTP sent to email' });
      });
    } else {
      console.log(`OTP for ${email}: ${otp}`);
      res.json({ message: 'OTP generated (check console for testing)' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP for user login
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  try {
    const otpRecord = await pool.query('SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND used = FALSE ORDER BY id DESC LIMIT 1', [email, otp]);
    if (otpRecord.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await pool.query('UPDATE otps SET used = TRUE WHERE id = $1', [otpRecord.rows[0].id]);

    // Get user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email, is_admin: user.rows[0].is_admin }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, is_admin: user.rows[0].is_admin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin login with password
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND is_admin = TRUE', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Admin not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email, is_admin: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, is_admin: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register admin (for initial setup)
router.post('/admin/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await pool.query('INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, TRUE) RETURNING *', [email, hashedPassword]);
    res.json({ message: 'Admin registered', user: { id: user.rows[0].id, email: user.rows[0].email } });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, phone_number, created_at FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;