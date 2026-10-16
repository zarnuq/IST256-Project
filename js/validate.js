// validate.js

// the five fields every member has
const FIELDS = ['fullName', 'email', 'age', 'phone', 'address'];

// Gets the five member fields from a form, trimmed, with the email in lower case.
function readForm(form) {
  const data = {};
  FIELDS.forEach(function (name) {
    data[name] = form.elements[name].value.trim();
  });
  // emails are case-insensitive so lowercase them all
  data.email = data.email.toLowerCase();
  return data;
}

// Returns { field: message } for every invalid field; an empty object means the member is valid.
function validateMember(member) {
  const errors = {};
  // strip everything but the digits so formatting doesn't matter
  const phoneDigits = member.phone.replace(/\D/g, '');

  // letters, spaces, dots, apostrophes and hyphens only
  if (!/^[A-Za-z .'-]{2,60}$/.test(member.fullName)) {
    errors.fullName = 'Name must be 2 to 60 letters (spaces, hyphens and apostrophes are fine).';
  }
  // super loose email check, just something@something.something
  if (!/^\S+@\S+\.\S+$/.test(member.email)) {
    errors.email = 'Enter a valid email, like name@example.com.';
  }
  // whole numbers only
  if (!/^\d+$/.test(member.age) || member.age < 13 || member.age > 120) {
    errors.age = 'Age must be a whole number from 13 to 120.';
  }
  // phone is optional, so only check it if they typed something
  if (member.phone && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    errors.phone = 'Phone number must have 10 to 15 digits.';
  }
  // address can't be too short or too long
  if (member.address.length < 5 || member.address.length > 120) {
    errors.address = 'Address must be 5 to 120 characters.';
  }
  return errors;
}

// Marks each field red with its message, or clears it, then focuses the first bad field.
function showErrors(form, errors) {
  FIELDS.forEach(function (name) {
    const input = form.elements[name];
    input.classList.toggle('is-invalid', Boolean(errors[name]));
    input.nextElementSibling.textContent = errors[name] || '';
  });
  // jump to the first broken field so they see it
  const firstBad = form.querySelector('.is-invalid');
  if (firstBad) firstBad.focus();
}
