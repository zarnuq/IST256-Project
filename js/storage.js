// storage.js

// the key we stash everything under in localStorage
const STORAGE_KEY = 'partwise.users';

// Returns the saved members array (empty if nothing is saved yet).
function getMembers() {
  // the || [] covers the first visit when nothing's saved yet
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Saves the whole members array as JSON.
function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

// True if a member other than ignoreId already uses this email.
function emailTaken(email, ignoreId) {
  return getMembers().some(function (member) {
    return member.email === email && member.id !== ignoreId;
  });
}

// Saves a new member from form data and returns it.
function addMember(data) {
  const members = getMembers();
  // same timestamp for created and updated since it's brand new
  const now = new Date().toISOString();
  const member = {
    id: String(Date.now()),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    age: Number(data.age),
    address: data.address,
    // everyone starts as a customer
    role: 'customer',
    createdAt: now,
    updatedAt: now
  };
  members.push(member);
  saveMembers(members);
  return member;
}

// Replaces an existing member's details with new form data.
function updateMember(id, data) {
  const members = getMembers();
  const member = members.find(function (m) { return m.id === id; });
  FIELDS.forEach(function (name) {
    member[name] = data[name];
  });
  // age comes in as text so turn it back into a number
  member.age = Number(data.age);
  member.updatedAt = new Date().toISOString();
  saveMembers(members);
}

// Removes the member with this id.
function deleteMember(id) {
  saveMembers(getMembers().filter(function (m) { return m.id !== id; }));
}

// Downloads all members as a users.json file.
function downloadMembers() {
  const blob = new Blob([JSON.stringify(getMembers(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'users.json';
  link.click();
}
