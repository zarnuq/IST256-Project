// signup.js: validates the sign-up form and saves the new member.
// Group: Sign-up page. Uses validate.js and storage.js. Goal: reference/js/signup.js

// TODO: get #signupForm and #formAlert with document.getElementById

// Shows a Bootstrap alert above the form (type is 'success' or 'danger').
function showAlert(type, message) {
  // TODO: set the alert's className to 'alert alert-' + type and its textContent to message
}

// TODO: when the form is submitted:
//   - stop the page from reloading (event.preventDefault())
//   - readForm, then validateMember; if emailTaken, add an email error too
//   - showErrors; if there are errors, show a 'danger' alert and stop
//   - otherwise addMember, reset the form and show a 'success' welcome alert

// TODO: when the form is reset (Clear button), clear the errors and the alert
