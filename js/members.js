/*
 * members.js
 * Member management page: list, search, edit, delete, import/export JSON.
 * Depends on validate.js and storage.js (loaded first in members.html).
 *
 * Security note: member data is always inserted with textContent / createElement,
 * never innerHTML, so a name like "<img onerror=...>" is shown as plain text.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const rowsEl = document.getElementById('memberRows');
  const countEl = document.getElementById('memberCount');
  const jsonEl = document.getElementById('jsonPreview');
  const searchEl = document.getElementById('searchInput');
  const alertEl = document.getElementById('pageAlert');

  const editForm = document.getElementById('editForm');
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  const confirmModalEl = document.getElementById('confirmModal');
  const confirmModal = new bootstrap.Modal(confirmModalEl);
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmYes = document.getElementById('confirmYes');

  let pendingAction = null;
  let alertTimer = null;

  /* ---------- helpers ---------- */

  function cell(text, className) {
    const td = document.createElement('td');
    td.textContent = text;
    if (className) td.className = className;
    return td;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function flash(type, message) {
    clearTimeout(alertTimer);
    alertEl.replaceChildren();
    const box = document.createElement('div');
    box.className = 'alert alert-' + type + ' alert-dismissible fade show';
    box.appendChild(document.createTextNode(message));
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close';
    close.setAttribute('data-bs-dismiss', 'alert');
    close.setAttribute('aria-label', 'Close');
    box.appendChild(close);
    alertEl.appendChild(box);
    alertTimer = setTimeout(function () { alertEl.replaceChildren(); }, 5000);
  }

  function askConfirm(message, buttonText, action) {
    confirmMessage.textContent = message;
    confirmYes.textContent = buttonText;
    pendingAction = action;
    confirmModal.show();
  }

  function actionButton(label, iconClass, btnClass, action, id) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm ' + btnClass;
    btn.dataset.action = action;
    btn.dataset.id = id;
    btn.setAttribute('aria-label', label);
    btn.title = label;
    const icon = document.createElement('i');
    icon.className = 'bi ' + iconClass;
    icon.setAttribute('aria-hidden', 'true');
    btn.appendChild(icon);
    return btn;
  }

  /* ---------- rendering ---------- */

  function render() {
    const all = UserStore.getAll();
    const query = searchEl.value.trim().toLowerCase();

    const shown = all.filter(function (u) {
      if (!query) return true;
      return [u.fullName, u.email, u.phone, u.address].join(' ').toLowerCase().includes(query);
    });

    countEl.textContent = all.length;
    jsonEl.textContent = UserStore.toJSON();
    rowsEl.replaceChildren();

    if (shown.length === 0) {
      const tr = document.createElement('tr');
      const td = cell(all.length === 0 ? 'No members yet. Use "Add member" to create the first one.' : 'No members match your search.', 'text-center text-body-secondary py-4');
      td.colSpan = 9;
      tr.appendChild(td);
      rowsEl.appendChild(tr);
      return;
    }

    shown.forEach(function (u, index) {
      const tr = document.createElement('tr');
      tr.appendChild(cell(String(index + 1)));
      tr.appendChild(cell(u.fullName, 'fw-semibold'));
      tr.appendChild(cell(u.email));
      tr.appendChild(cell(u.phone || '—'));
      tr.appendChild(cell(String(u.age)));
      tr.appendChild(cell(u.address, 'col-address'));

      const roleTd = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'badge border border-dark ' + (u.role === 'admin' ? 'text-bg-dark' : 'text-bg-light');
      badge.textContent = u.role;
      roleTd.appendChild(badge);
      tr.appendChild(roleTd);

      tr.appendChild(cell(formatDate(u.createdAt)));

      const actions = document.createElement('td');
      actions.className = 'text-end text-nowrap';
      actions.appendChild(actionButton('Edit ' + u.fullName, 'bi-pencil-square', 'btn-primary me-1', 'edit', u.id));
      actions.appendChild(actionButton('Delete ' + u.fullName, 'bi-trash3', 'btn-outline-danger', 'delete', u.id));
      tr.appendChild(actions);

      rowsEl.appendChild(tr);
    });
  }

  /* ---------- edit ---------- */

  function openEdit(id) {
    const user = UserStore.getById(id);
    if (!user) {
      flash('warning', 'That member no longer exists.');
      render();
      return;
    }
    Validate.form.clear(editForm);
    editForm.elements.userId.value = user.id;
    editForm.elements.fullName.value = user.fullName;
    editForm.elements.email.value = user.email;
    editForm.elements.phone.value = user.phone || '';
    editForm.elements.age.value = String(user.age);
    editForm.elements.address.value = user.address;
    editModal.show();
  }

  Validate.form.attachLive(editForm);

  editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = Validate.form.read(editForm);
    const result = Validate.validateUser(data);
    if (!result.valid) {
      Validate.form.showErrors(editForm, result.errors);
      const firstBad = Validate.form.firstInvalid(editForm);
      if (firstBad) firstBad.focus();
      return;
    }

    const saved = UserStore.update(editForm.elements.userId.value, data);
    if (!saved.ok) {
      if (saved.errors && saved.errors._form) {
        editModal.hide();
        flash('warning', saved.errors._form);
        render();
        return;
      }
      Validate.form.showErrors(editForm, saved.errors);
      const firstBad = Validate.form.firstInvalid(editForm);
      if (firstBad) firstBad.focus();
      return;
    }

    editModal.hide();
    flash('success', 'Saved changes for ' + saved.user.fullName + '.');
    render();
  });

  /* ---------- delete / clear ---------- */

  confirmYes.addEventListener('click', function () {
    const action = pendingAction;
    pendingAction = null;
    confirmModal.hide();
    if (action) action();
  });

  rowsEl.addEventListener('click', function (event) {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.action === 'edit') {
      openEdit(id);
    } else if (btn.dataset.action === 'delete') {
      const user = UserStore.getById(id);
      if (!user) { render(); return; }
      askConfirm('Delete ' + user.fullName + ' (' + user.email + ')? This cannot be undone.', 'Yes, delete', function () {
        UserStore.remove(id);
        flash('success', user.fullName + ' was deleted.');
        render();
      });
    }
  });

  document.getElementById('clearBtn').addEventListener('click', function () {
    if (UserStore.count() === 0) {
      flash('info', 'There are no members to clear.');
      return;
    }
    askConfirm('Delete ALL ' + UserStore.count() + ' members from this browser? Download users.json first if you want a backup.', 'Yes, delete all', function () {
      UserStore.clearAll();
      flash('success', 'All members were deleted.');
      render();
    });
  });

  /* ---------- search ---------- */

  searchEl.addEventListener('input', render);

  /* ---------- JSON download / import ---------- */

  document.getElementById('downloadBtn').addEventListener('click', function () {
    UserStore.download('users.json');
    flash('success', 'Downloaded users.json with ' + UserStore.count() + ' member(s).');
  });

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', function () {
    importFile.click();
  });

  importFile.addEventListener('change', function () {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      const result = UserStore.importJSON(String(reader.result));
      if (!result.ok) {
        flash('danger', result.error);
      } else {
        flash(result.added ? 'success' : 'warning',
          'Imported ' + result.added + ' member(s)' + (result.skipped ? ', skipped ' + result.skipped + ' invalid or duplicate row(s).' : '.'));
      }
      importFile.value = '';
      render();
    };
    reader.onerror = function () {
      flash('danger', 'Could not read that file.');
      importFile.value = '';
    };
    reader.readAsText(file);
  });

  // Keep the table fresh if members change in another tab.
  window.addEventListener('storage', render);

  render();
});
