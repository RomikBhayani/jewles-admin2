const express = require('express');
const router = express.Router();

// Dashboard routes
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard/index', {
    title: 'Dashboard',
    user: req.session.user,
  });
});

module.exports = router;
