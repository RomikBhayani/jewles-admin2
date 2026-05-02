const express = require('express');
const router = express.Router();

// Placeholder for auth routes
// TODO: Implement authentication routes (login, logout, register)

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;
