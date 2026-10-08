// storage.js: the only file that reads or writes member data.
// Group: Shared JS (build this first). Goal: reference/js/storage.js

const STORAGE_KEY = 'partwise.users';

// Returns the saved members array (empty if nothing is saved yet).
function getMembers() {
  // TODO: read STORAGE_KEY from localStorage, JSON.parse it, and return [] if nothing is saved
}

// Saves the whole members array as JSON.
function saveMembers(members) {
  // TODO: JSON.stringify the array and store it in localStorage under STORAGE_KEY
}

// True if a member other than ignoreId already uses this email.
function emailTaken(email, ignoreId) {
  // TODO: return true if any saved member has this email and a different id
}

// Saves a new member from form data and returns it.
function addMember(data) {
  // TODO: build a member: id (String(Date.now())), the five fields (age as a Number),
  //       role 'customer', createdAt and updatedAt (new Date().toISOString())
  // TODO: add it to the saved array, save, and return it
}

// Replaces an existing member's details with new form data.
function updateMember(id, data) {
  // TODO: find the member with this id, copy in the five fields (age as a Number), refresh updatedAt, save
}

// Removes the member with this id.
function deleteMember(id) {
  // TODO: save the array without the member that has this id
}

// Downloads all members as a users.json file.
function downloadMembers() {
  // TODO: make a Blob of JSON.stringify(getMembers(), null, 2) with type 'application/json'
  // TODO: create an <a>, set href = URL.createObjectURL(blob) and download = 'users.json', then click() it
}
