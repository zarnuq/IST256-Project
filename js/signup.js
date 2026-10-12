// signup.js: validates the sign-up form and saves the new member.
const signupForm = document.getElementById('signupForm');
const formAlert = document.getElementById('formAlert');

// Shows a Bootstrap alert above the form (type is 'success' or 'danger').
function showAlert(type, message) {
  formAlert.className = 'alert alert-' + type;
  formAlert.textContent = message;
}

// Validates the submitted fields and saves the member when there are no errors.
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

// Clears validation errors and the alert when the form is reset.
signupForm.addEventListener('reset', function () {
  showErrors(signupForm, {});
  formAlert.className = '';
  formAlert.textContent = '';
});
