// validate.js: reads a member form and checks each field. Used by signup.js and members.js.

const FIELDS = ['fullName', 'email', 'age', 'phone', 'address'];

// Gets the five member fields from a form, trimmed, with the email in lower case.
function readForm(form) {
  return {
    fullName: form.elements.fullName.value.trim(),
    email: form.elements.email.value.trim().toLowerCase(),
    age: form.elements.age.value.trim(),
    phone: form.elements.phone.value.trim(),
    address: form.elements.address.value.trim()
  };
}

// Returns { field: message } for every invalid field; an empty object means the member is valid.
function validateMember(member) {
  const errors = {};
  const phoneDigits = member.phone.replace(/\D/g, '');

  if (!/^[A-Za-z .'-]{2,60}$/.test(member.fullName)) {
    errors.fullName = 'Name must be 2 to 60 letters (spaces, hyphens and apostrophes are fine).';
  }
  if (!/^\S+@\S+\.\S+$/.test(member.email)) {
    errors.email = 'Enter a valid email, like name@example.com.';
  }
  if (!/^\d+$/.test(member.age) || member.age < 13 || member.age > 120) {
    errors.age = 'Age must be a whole number from 13 to 120.';
  }
  if (member.phone && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    errors.phone = 'Phone number must have 10 to 15 digits.';
  }
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
  const firstBad = form.querySelector('.is-invalid');
  if (firstBad) firstBad.focus();
}
