// validate.js: reads a member form and checks each field. Used by signup.js and members.js.
// Group: Shared JS (build this first). Goal: reference/js/validate.js

const FIELDS = ['fullName', 'email', 'age', 'phone', 'address'];

// Gets the five member fields from a form, trimmed, with the email in lower case.
function readForm(form) {
  // TODO: return an object with fullName, email, age, phone, address
  // TODO: read each from form.elements[name].value, .trim() it, and lower-case the email
}

// Returns { field: message } for every invalid field; an empty object means the member is valid.
function validateMember(member) {
  const errors = {};
  // TODO: fullName must be 2 to 60 letters, spaces, hyphens, apostrophes or periods (use a regex)
  // TODO: email must look like name@example.com
  // TODO: age must be digits only and from 13 to 120
  // TODO: phone is optional; if filled in, it needs 10 to 15 digits
  // TODO: address must be 5 to 120 characters
  // For each bad field, set errors[field] = 'a helpful message'
  return errors;
}

// Marks each field red with its message, or clears it, then focuses the first bad field.
function showErrors(form, errors) {
  // TODO: for each name in FIELDS, get the input with form.elements[name]
  // TODO: add or remove Bootstrap's 'is-invalid' class depending on errors[name]
  // TODO: put the message (or '') in the .invalid-feedback div right after the input
  // TODO: focus the first input that has 'is-invalid'
}
