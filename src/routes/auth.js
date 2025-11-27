const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const { isAuthenticated, isStudent } = require('../middleware/auth');
const { renderError } = require('../utils/helpers');

const router = express.Router();

// --- Registration ---
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return renderError(res, 'register', null, 'Username and password are required.');
  }
  // Password validation checks
  if (password.length < 8) {
    return renderError(res, 'register', null, 'Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    return renderError(res, 'register', null, 'Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    return renderError(res, 'register', null, 'Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    return renderError(res, 'register', null, 'Password must contain at least one number.');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return renderError(res, 'register', null, 'Password must contain at least one special character.');
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('Error hashing password.');
    }

    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.run(sql, [username, hash, 'student'], function (err) {
      if (err) {
        return renderError(res, 'register', null, 'Username already taken.');
      }
      res.redirect('/login');
    });
  });
});

// --- Login / Logout ---
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) {
      return renderError(res, 'login', null, 'Invalid credentials.');
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        req.session.user = user;
        if (user.role === 'admin') {
          res.redirect('/admin/dashboard');
        } else {
          res.redirect('/student-dashboard');
        }
      } else {
        res.render('login', { error: 'Invalid credentials.' });
      }
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

// --- Dashboards ---
router.get('/student-dashboard', isStudent, (req, res) => {
  res.render('student-dashboard');
});

// --- Password Management ---
router.get('/change-password', isAuthenticated, (req, res) => {
  res.render('change-password', { error: null, message: null });
});

router.post('/change-password', isAuthenticated, (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.user.id;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return renderError(res, 'change-password', req.session.user, 'All fields are required.');
  }
  if (newPassword !== confirmPassword) {
    return renderError(res, 'change-password', req.session.user, 'New passwords do not match.');
  }
  if (newPassword.length < 8) {
    return renderError(res, 'change-password', req.session.user, 'New password must be at least 8 characters.');
  }

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (!user) {
      return res.status(404).send('User not found');
    }

    bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
      if (!isMatch) {
        return renderError(res, 'change-password', req.session.user, 'Incorrect old password.');
      }

      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          return res.status(500).send('Error hashing password.');
        }

        db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], (err) => {
          if (err) {
            return renderError(res, 'change-password', req.session.user, 'Failed to update password.');
          }
          res.render('change-password', { error: null, message: 'Password changed successfully!' });
        });
      });
    });
  });
});

module.exports = router;
