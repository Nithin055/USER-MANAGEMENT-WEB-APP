// Check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Check if user is a student
function isStudent(req, res, next) {
  if (req.session.user && req.session.user.role === 'student') {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Check if user is an admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = { isAuthenticated, isStudent, isAdmin };
