// signup.js: validates the sign-up form and saves the new member.
const signupForm = document.getElementById('signupForm');
const formAlert = document.getElementById('formAlert');
// Group: Sign-up page. Uses validate.js and storage.js. Goal: reference/js/signup.js

function showAlert(type, message) {
  formAlert.className = 'alert alert-' + type;
  formAlert.textContent = message;

// TODO:
//   stop the page from reloading
//   Read Form
//   Show errors
//   Otherwise addMember, reset the form and show a 'success' welcome alert
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
