const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware
router.use(authenticate);

// Theme settings
router.get('/theme', (req, res) => {
  res.json({
    success: true,
    message: 'Theme settings retrieved',
    data: {},
  });
});

router.put('/theme', (req, res) => {
  res.json({
    success: true,
    message: 'Theme settings updated',
    data: {},
  });
});

module.exports = router;
