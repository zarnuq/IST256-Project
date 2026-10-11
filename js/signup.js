// signup.js: validates the sign-up form and saves the new member.
// Group: Sign-up page. Uses validate.js and storage.js. Goal: reference/js/signup.js

// TODO: get #signupForm and #formAlert with document.getElementById
const signupForm = document.getElementById('signupForm');
const formAlert = document.getElementById('formAlert');

// Shows a Bootstrap alert above the form (type is 'success' or 'danger').
function showAlert(type, message) {
  formAlert.className = 'alert alert-' + type;
  formAlert.textContent = message;
  // TODO: set the alert's className to 'alert alert-' + type and its textContent to message
}

// TODO: when the form is submitted:
//   - stop the page from reloading (event.preventDefault())
//   - readForm, then validateMember; if emailTaken, add an email error too
//   - showErrors; if there are errors, show a 'danger' alert and stop
//   - otherwise addMember, reset the form and show a 'success' welcome alert
signupForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = readForm(signupForm);
  const errors = validateMember(data);
  if (emailTaken(data.email)) {
    errors.email = 'That email is already registered.';
  }

  showErrors(signupForm, errors);
  if (Object.keys(errors).length > 0) {
    showAlert('danger', 'Please fix the highlighted fields.');
    return;
  }

  const member = addMember(data);
  signupForm.reset();
  showAlert('success', 'Welcome, ' + member.fullName + '! Your account was created.');
});

// TODO: when the form is reset (Clear button), clear the errors and the alert
signupForm.addEventListener('reset', function () {
  showErrors(signupForm, {});
  formAlert.className = '';
  formAlert.textContent = '';
});

