# TODO: L06 (due Sun Oct 11)

The files in this folder are stubs: fill in every `TODO` comment by hand. `reference/` shows the finished goal.

- Only edit your own files (or your own marked section in `members.html` / `members.js`).
- Keep the function names, ids and field names already in the stubs; other files rely on them.
- Shared JS is needed by both forms, so it gets built first. Until it's merged, page groups work on their HTML.
- Test with VS Code's _Live Server_ so every page shares the same saved members.

| Group                   | Files                                                          | Owner |
| ----------------------- | -------------------------------------------------------------- | ----- |
| Shared JS (first)       | `js/validate.js`, `js/storage.js`                              |       |
| Homepage and styles     | `index.html`, `css/styles.css`                                 |       |
| Sign-up page            | `signup.html`, `js/signup.js`                                  |       |
| Members table           | `members.html` and `js/members.js`, "Members table" sections   |       |
| Members edit and delete | `members.html` and `js/members.js`, "edit and delete" sections |       |

## Task 1: Shared JS (merge by Fri Oct 9) [YOUR NAME]

- [ ] `validate.js`: `readForm`, `validateMember` (rules in `README.md`), `showErrors`
- [ ] `storage.js`: `getMembers`, `saveMembers`, `emailTaken`, `addMember`, `updateMember`, `deleteMember`, `downloadMembers`
- [ ] Check: in the browser console, `addMember(...)`, `getMembers()`, `updateMember`, `deleteMember` and
      `validateMember(...)` all work, and data survives a reload

## Task 2: Homepage and styles [Jeremy Hou]

- [ ] `index.html`: head links, navbar, hero with `#build-preview-slot`, four feature cards, call to action, footer
- [ ] Wording for any kind of build, not gaming-only
- [ ] `styles.css`: every section in the stub
- [ ] Check: the homepage looks like `reference/index.html` at desktop and phone width

## Task 3: Sign-up page [YOUR NAME]

- [ ] `signup.html`: head, navbar, footer, `#formAlert`, `#signupForm` with the five fields, rules card, scripts
- [ ] `signup.js`: `showAlert`, submit handler, reset handler
- [ ] Check: L06 checklist 1 to 4

## Task 4: Members table [YOUR NAME]

- [ ] `members.html`: head, navbar, footer, count, Add member link, `#downloadBtn`, `#searchInput`, table, JSON box, scripts
- [ ] `members.js`: `addCell`, `makeButton`, `render`, search and download wiring
- [ ] Check: members added on the sign-up page (yours or `reference/signup.html`) show in the table; search, download
      and the JSON box work; an address of `<b>test</b>` shows as plain text

## Task 5: Members edit and delete [YOUR NAME]

- [ ] `members.html`: edit modal `#editModal` with `#editForm` and the five fields
- [ ] `members.js`: `openEdit`, `removeMember`, edit form submit handler
- [ ] Check: L06 checklist 5 and 6. Before the table is done, test from the console with `openEdit(getMembers()[0])`
      and `removeMember(getMembers()[0])`

## Everyone

- [ ] Comment every function
- [ ] Works with the keyboard and at phone width
- [ ] No `innerHTML` with user data
- [ ] Write down what you built for the PDF

## Schedule

- [x] Repo created (Miles); finished site in `reference/`; stubs in place
- [ ] Everyone picks a group and writes their name in the table
- [ ] **Fri Oct 9:** Shared JS merged
- [ ] **By Sat Oct 10, 6 pm:** every group merged
- [ ] **Sat Oct 10 evening:** run the L06 checklist, take screenshots
- [ ] **Sun Oct 11:** build the PDF and submit by the afternoon
