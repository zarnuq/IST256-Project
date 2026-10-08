// storage.js: the only file that reads or writes member data.
// Members are saved as JSON in the browser's localStorage, and can be downloaded as users.json.

const STORAGE_KEY = 'partwise.users';

// Returns the saved members array (empty if nothing is saved yet).
function getMembers() {
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
  const now = new Date().toISOString();
  const member = {
    id: String(Date.now()),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    age: Number(data.age),
    address: data.address,
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
  member.fullName = data.fullName;
  member.email = data.email;
  member.phone = data.phone;
  member.age = Number(data.age);
  member.address = data.address;
  member.updatedAt = new Date().toISOString();
  saveMembers(members);
}

// Removes the member with this id.
function deleteMember(id) {
  saveMembers(getMembers().filter(function (m) { return m.id !== id; }));
}

// Downloads all members as a users.json file.
function downloadMembers() {
  const file = new Blob([JSON.stringify(getMembers(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'users.json';
  link.click();
}
