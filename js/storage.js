/*
 * storage.js
 * The ONLY file that reads or writes member data.
 *
 * Members are kept as a JSON array in the browser (localStorage) and can be
 * exported to / imported from a real users.json file. Later labs (Node + MongoDB)
 * only need to replace the insides of these functions; the pages keep calling
 * UserStore.getAll / add / update / remove exactly the same way.
 *
 * Member shape:
 * {
 *   id, fullName, email, phone, age, address,
 *   role: "customer" | "admin",
 *   createdAt, updatedAt   (ISO date strings)
 * }
 */
(function (global) {
  'use strict';

  const KEY = 'projectAlpha.users';

  function read() {
    try {
      const raw = global.localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function write(users) {
    global.localStorage.setItem(KEY, JSON.stringify(users));
  }

  function newId() {
    try {
      if (global.crypto && typeof global.crypto.randomUUID === 'function') {
        return global.crypto.randomUUID();
      }
    } catch (err) { /* fall through */ }
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // Trim text and store age as a number and email in lower case.
  function clean(data) {
    return {
      fullName: String(data.fullName || '').trim().replace(/\s+/g, ' '),
      email: String(data.email || '').trim().toLowerCase(),
      phone: String(data.phone || '').trim(),
      age: Number(String(data.age).trim()),
      address: String(data.address || '').trim()
    };
  }

  function emailTaken(users, email, ignoreId) {
    return users.some(function (u) {
      return u.email === email && u.id !== ignoreId;
    });
  }

  const UserStore = {
    getAll() {
      return read();
    },

    getById(id) {
      return read().find(function (u) { return u.id === id; }) || null;
    },

    count() {
      return read().length;
    },

    // Returns { ok: true, user } or { ok: false, errors: { field: message } }
    add(data) {
      const users = read();
      const fields = clean(data);
      if (emailTaken(users, fields.email, null)) {
        return { ok: false, errors: { email: 'That email is already registered.' } };
      }
      const now = new Date().toISOString();
      const user = Object.assign({ id: newId() }, fields, {
        role: 'customer',
        createdAt: now,
        updatedAt: now
      });
      users.push(user);
      write(users);
      return { ok: true, user: user };
    },

    // Returns { ok: true, user } or { ok: false, errors }
    update(id, data) {
      const users = read();
      const index = users.findIndex(function (u) { return u.id === id; });
      if (index === -1) {
        return { ok: false, errors: { _form: 'That member no longer exists.' } };
      }
      const fields = clean(data);
      if (emailTaken(users, fields.email, id)) {
        return { ok: false, errors: { email: 'That email is already registered.' } };
      }
      users[index] = Object.assign({}, users[index], fields, { updatedAt: new Date().toISOString() });
      write(users);
      return { ok: true, user: users[index] };
    },

    remove(id) {
      const users = read();
      const next = users.filter(function (u) { return u.id !== id; });
      write(next);
      return next.length !== users.length;
    },

    clearAll() {
      write([]);
    },

    // Pretty-printed JSON text, exactly what ends up in users.json.
    toJSON() {
      return JSON.stringify(read(), null, 2);
    },

    // Save the current members as a users.json file download.
    download(filename) {
      const blob = new Blob([UserStore.toJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'users.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    },

    // Merge members from JSON text. Invalid rows and duplicate emails are skipped.
    // Returns { ok, added, skipped } or { ok: false, error }
    importJSON(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        return { ok: false, error: 'That file is not valid JSON.' };
      }
      const rows = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.users) ? parsed.users : null);
      if (!rows) {
        return { ok: false, error: 'Expected a JSON array of members.' };
      }

      const users = read();
      let added = 0;
      let skipped = 0;
      rows.forEach(function (row) {
        if (!row || typeof row !== 'object' || !global.Validate.validateUser(row).valid) {
          skipped += 1;
          return;
        }
        const fields = clean(row);
        if (emailTaken(users, fields.email, null)) {
          skipped += 1;
          return;
        }
        const now = new Date().toISOString();
        users.push(Object.assign({ id: row.id || newId() }, fields, {
          role: row.role === 'admin' ? 'admin' : 'customer',
          createdAt: row.createdAt || now,
          updatedAt: row.updatedAt || now
        }));
        added += 1;
      });
      write(users);
      return { ok: true, added: added, skipped: skipped };
    }
  };

  global.UserStore = UserStore;
})(window);
