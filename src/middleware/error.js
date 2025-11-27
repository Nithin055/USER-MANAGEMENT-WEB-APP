// Error-handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).render('error', {
    title: 'Error',
    message: 'Something went wrong. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
}

// Handle 404 errors
function notFoundHandler(req, res, next) {
  res.status(404).render('404', {
    title: 'Page Not Found',
  });
}

module.exports = { errorHandler, notFoundHandler };
