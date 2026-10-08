/*
 * signup.js
 * Handles the sign-up form: validate, save to the member store, show feedback.
 * Depends on validate.js and storage.js (loaded first in signup.html).
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const form = document.getElementById('signupForm');
  const alertBox = document.getElementById('formAlert');
  const countEl = document.getElementById('memberCount');

  function updateCount() {
    countEl.textContent = UserStore.count();
  }

  // Build the alert with DOM methods (never innerHTML) so typed text can't inject markup.
  function showAlert(type, message, linkText, linkHref) {
    alertBox.replaceChildren();
    const box = document.createElement('div');
    box.className = 'alert alert-' + type + ' alert-dismissible fade show';

    const text = document.createElement('span');
    text.textContent = message + (linkText ? ' ' : '');
    box.appendChild(text);

    if (linkText) {
      const link = document.createElement('a');
      link.href = linkHref;
      link.className = 'alert-link';
      link.textContent = linkText;
      box.appendChild(link);
    }

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close';
    close.setAttribute('data-bs-dismiss', 'alert');
    close.setAttribute('aria-label', 'Close');
    box.appendChild(close);

    alertBox.appendChild(box);
  }

  Validate.form.attachLive(form);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = Validate.form.read(form);
    const result = Validate.validateUser(data);

    if (!result.valid) {
      Validate.form.showErrors(form, result.errors);
      showAlert('danger', 'Please fix the highlighted fields and try again.');
      const firstBad = Validate.form.firstInvalid(form);
      if (firstBad) firstBad.focus();
      return;
    }

    const saved = UserStore.add(data);
    if (!saved.ok) {
      Validate.form.showErrors(form, saved.errors);
      showAlert('danger', 'We could not create the account. Please check the highlighted fields.');
      const firstBad = Validate.form.firstInvalid(form);
      if (firstBad) firstBad.focus();
      return;
    }

    form.reset();
    Validate.form.clear(form);
    showAlert('success', 'Welcome to Project Alpha, ' + saved.user.fullName + '! Your account was created.',
      'View all members', 'members.html');
    updateCount();
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // "Clear form" also wipes validation colors and any message.
  form.addEventListener('reset', function () {
    Validate.form.clear(form);
    alertBox.replaceChildren();
  });

  updateCount();
});
