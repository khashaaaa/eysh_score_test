const express = require('express');
const router = express.Router();
const pool = require('../db');
const qrcode = require('qrcode');
const { authenticateToken } = require('../middleware/auth');

// Get packages
router.get('/packages', authenticateToken, async (req, res) => {
  try {
    const packages = await pool.query('SELECT * FROM packages');
    res.json(packages.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase package
router.post('/purchase/:packageId', authenticateToken, async (req, res) => {
  const { packageId } = req.params;
  const userId = req.user.id;

  try {
    const pkg = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (pkg.rows.length === 0) return res.status(404).json({ error: 'Package not found' });

    // Calculate expiry
    let expiry;
    if (pkg.rows[0].duration === '1 month') {
      expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (pkg.rows[0].duration === '1 year') {
      expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    } else {
      expiry = new Date('2099-12-31'); // until exam
    }

    // Save user package
    await pool.query('INSERT INTO user_packages (user_id, package_id, expiry) VALUES ($1, $2, $3)', [userId, packageId, expiry]);

    // Generate QR code for payment (simulate)
    const paymentData = `Payment for ${pkg.rows[0].name} - Amount: ${pkg.rows[0].price}`;
    const qrCode = await qrcode.toDataURL(paymentData);

    res.json({ qrCode, message: 'Purchase completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check access
router.get('/access', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const access = await pool.query('SELECT * FROM user_packages WHERE user_id = $1 AND expiry > NOW()', [userId]);
    res.json({ hasAccess: access.rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;