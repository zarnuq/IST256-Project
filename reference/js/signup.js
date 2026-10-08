// signup.js: validates the sign-up form and saves the new member.

const signupForm = document.getElementById('signupForm');
const formAlert = document.getElementById('formAlert');

// Shows a Bootstrap alert above the form (type is 'success' or 'danger').
function showAlert(type, message) {
  formAlert.className = 'alert alert-' + type;
  formAlert.textContent = message;
}

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

// The Clear button also removes the red fields and the alert.
signupForm.addEventListener('reset', function () {
  showErrors(signupForm, {});
  formAlert.className = '';
  formAlert.textContent = '';
});
