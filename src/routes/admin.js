const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const { isAdmin } = require('../middleware/auth');
const { renderError } = require('../utils/helpers');

const router = express.Router();

// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      renderError(res, 'admin-dashboard', null, 'Could not fetch users.');
    } else {
      res.render('admin-dashboard', { users, error: null });
    }
  });
});

// Create user
router.post('/users', isAdmin, (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.redirect('/admin/dashboard');
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.redirect('/admin/dashboard');
    }

    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.run(sql, [username, hash, role], (err) => {
      if (err) {
        console.error('Error creating user:', err);
      }
      res.redirect('/admin/dashboard');
    });
  });
});

// Delete user
router.post('/users/delete/:id', isAdmin, (req, res) => {
  const id = req.params.id;

  // Prevent admin from being deleted
  if (id === '1') {
    return res.redirect('/admin/dashboard');
  }

  db.run('DELETE FROM users WHERE id = ?', id, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
    }
    res.redirect('/admin/dashboard');
  });
});

// Edit user
router.get('/users/edit/:id', isAdmin, (req, res) => {
  const id = req.params.id;
  db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, user) => {
    if (err || !user) {
      return res.redirect('/admin/dashboard');
    }
    res.render('edit-user', { user, error: null });
  });
});

router.post('/users/edit/:id', isAdmin, (req, res) => {
  const id = req.params.id;
  const { username, role } = req.body;

  if (!username || !role) {
    db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, user) => {
      return renderError(res, 'edit-user', user, 'All fields are required.');
    });
    return;
  }

  const sql = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
  db.run(sql, [username, role, id], (err) => {
    if (err) {
      db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, user) => {
        return renderError(res, 'edit-user', user, 'Username already taken.');
      });
      return;
    }
    res.redirect('/admin/dashboard');
  });
});

module.exports = router;
