// members.js: shows the members table, with search, edit, delete and download.
// Uses validate.js and storage.js. Goal: reference/js/members.js
// Two groups share this file: only edit your own section.

// ===== Members table group =====

// TODO: get #memberRows, #memberCount, #jsonPreview and #searchInput with document.getElementById

// Adds a cell with plain text (textContent, never innerHTML, so typed HTML can't run).
function addCell(row, text) {
  // TODO: create a <td>, set its textContent, append it to row
}

// Makes a small button that runs onClick.
function makeButton(label, style, onClick) {
  // TODO: create a <button type="button"> with class 'btn btn-sm ' + style and text label
  // TODO: run onClick when it is clicked, then return the button
}

// Redraws the table, the member count and the JSON box.
function render() {
  // TODO: get all members and keep only the ones matching the search box (name, email, phone or address)
  // TODO: show the member count and JSON.stringify(members, null, 2) in the JSON box
  // TODO: empty the table; if nothing to show, add one row saying 'No members yet.' or 'No members match your search.'
  // TODO: otherwise add a row per member: #, name, email, phone (or '-'), age, address, role, joined date
  // TODO: last cell: makeButton('Edit', ...) calling openEdit(member) and makeButton('Delete', ...) calling removeMember(member)
}

// TODO: re-render when the search box changes, and call downloadMembers when #downloadBtn is clicked
// TODO: call render() once so the table shows when the page opens

// ===== Members edit and delete group =====

// TODO: get #editForm, and make the modal with new bootstrap.Modal(document.getElementById('editModal'))
// TODO: keep a variable editingId for the member being edited

// Opens the edit modal filled in with this member's details.
function openEdit(member) {
  // TODO: remember member.id, copy each field in FIELDS into the edit form, clear old errors, show the modal
}

// Asks first, then deletes the member.
function removeMember(member) {
  // TODO: if confirm('Delete ' + member.fullName + '?') is OK, deleteMember(member.id) and render()
}

// TODO: when the edit form is submitted:
//   - stop the page from reloading
//   - readForm, then validateMember; if emailTaken by someone else (pass editingId), add an email error
//   - showErrors; if there are errors, stop
//   - otherwise updateMember, hide the modal and render()
