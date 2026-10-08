/*
 * validate.js
 * Validation rules for member data + small helpers that show errors on a form.
 * Used by signup.js (sign-up page) and members.js (edit modal).
 *
 * Every field rule returns '' when the value is OK, or an error message string.
 */
(function (global) {
  'use strict';

  const FIELDS = ['fullName', 'email', 'phone', 'age', 'address'];

  const NAME_RE = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ .'-]*$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    fullName(value) {
      const s = String(value == null ? '' : value).trim();
      if (!s) return 'Full name is required.';
      if (s.length < 2) return 'Name must be at least 2 characters.';
      if (s.length > 60) return 'Name must be 60 characters or fewer.';
      if (!NAME_RE.test(s)) return 'Use letters, spaces, hyphens, apostrophes or periods only.';
      return '';
    },

    email(value) {
      const s = String(value == null ? '' : value).trim();
      if (!s) return 'Email address is required.';
      if (s.length > 254) return 'Email address is too long.';
      if (!EMAIL_RE.test(s)) return 'Enter a valid email address, like name@example.com.';
      return '';
    },

    // Optional: empty is fine, but if something is typed it must look like a phone number.
    phone(value) {
      const s = String(value == null ? '' : value).trim();
      if (!s) return '';
      if (!/^[\d\s().+-]+$/.test(s)) return 'Phone can only contain digits, spaces, + - ( ).';
      const digits = s.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) return 'Phone number must have 10 to 15 digits.';
      return '';
    },

    age(value) {
      const s = String(value == null ? '' : value).trim();
      if (!s) return 'Age is required.';
      if (!/^\d+$/.test(s)) return 'Age must be a whole number.';
      const n = Number(s);
      if (n < 13) return 'You must be at least 13 years old to sign up.';
      if (n > 120) return 'Please enter a realistic age (120 or under).';
      return '';
    },

    address(value) {
      const s = String(value == null ? '' : value).trim();
      if (!s) return 'Address is required.';
      if (s.length < 5) return 'Address looks too short. Include street and city.';
      if (s.length > 120) return 'Address must be 120 characters or fewer.';
      return '';
    }
  };

  // Validate a whole member object. Returns { valid, errors } where errors maps field -> message.
  function validateUser(data) {
    const errors = {};
    FIELDS.forEach(function (name) {
      const message = rules[name](data ? data[name] : '');
      if (message) errors[name] = message;
    });
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  /* ---------- DOM helpers (work on any form whose inputs use the FIELDS names) ---------- */

  const form = {
    // Read the five member fields out of a form element.
    read(formEl) {
      const data = {};
      FIELDS.forEach(function (name) {
        const el = formEl.elements[name];
        data[name] = el ? el.value : '';
      });
      return data;
    },

    // Show (message) or clear ('') the error state on one field.
    showError(formEl, name, message) {
      const el = formEl.elements[name];
      if (!el) return;
      const feedback = el.parentElement.querySelector('.invalid-feedback');
      if (message) {
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
        el.setAttribute('aria-invalid', 'true');
        if (feedback) feedback.textContent = message;
      } else {
        el.classList.remove('is-invalid');
        el.removeAttribute('aria-invalid');
        // Only mark filled-in fields as valid (an empty optional phone stays neutral).
        el.classList.toggle('is-valid', el.value.trim() !== '');
      }
    },

    showErrors(formEl, errors) {
      FIELDS.forEach(function (name) {
        form.showError(formEl, name, (errors && errors[name]) || '');
      });
    },

    clear(formEl) {
      FIELDS.forEach(function (name) {
        const el = formEl.elements[name];
        if (!el) return;
        el.classList.remove('is-invalid', 'is-valid');
        el.removeAttribute('aria-invalid');
      });
    },

    firstInvalid(formEl) {
      return formEl.querySelector('.is-invalid');
    },

    // Validate each field when the user leaves it, and re-check as they fix a bad one.
    attachLive(formEl) {
      FIELDS.forEach(function (name) {
        const el = formEl.elements[name];
        if (!el) return;
        el.addEventListener('blur', function () {
          form.showError(formEl, name, rules[name](el.value));
        });
        el.addEventListener('input', function () {
          if (el.classList.contains('is-invalid')) {
            form.showError(formEl, name, rules[name](el.value));
          }
        });
      });
    }
  };

  global.Validate = { FIELDS: FIELDS, rules: rules, validateUser: validateUser, form: form };
})(window);
