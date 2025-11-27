// Helper function to render a view with an error message
function renderError(res, view, user, error) {
  res.render(view, { user, error });
}

module.exports = { renderError };
