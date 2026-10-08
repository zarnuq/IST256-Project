# Partwise: PC Parts Store

A store for PC parts for any kind of build (home, office, school, creative, gaming).

**Team:** Oliver Aaron, Jeremy Hou (group leader), Miles Alford, Anson Poon, Aryan Vir.

**Now:** L06 (User/Member Management), due **Sun Oct 11**. The files in this folder are stubs with `TODO` comments;
`reference/` is the finished goal. Tasks are in [`TODO.md`](TODO.md), one group per person.

>[!IMPORTANT]
>This is the bootstrap link: [https://bootswatch.com/brite/](https://bootswatch.com/brite/), so if you are adding a new element, check here first where you can copy specific code blocks to match styling.
>Also, please read the  [`README.md`](README.md) AND the [`TODO.md`](TODO.md) and assign yourself a task.

## How to do:

1. Clone `git clone https://github.com/zarnuq/IST256-Project`.
2. Work on your own branch: `git checkout -b yourname`.
3. Commit small and often; `git pull` before each session.
4. Push and open a pull request for Jeremy or Miles to merge: `git add . && git commit -m "your commit message" && git push -u origin HEAD`

## Run it

Open `reference/index.html` to see the finished site. Use VS Code's *Live Server* while building. Needs internet for the CDNs.
`reference-full/` is a backup of the original, bigger version of the site.

## Files

| File | What it does |
|---|---|
| `index.html` | Homepage |
| `signup.html` | Sign-up form |
| `members.html` | Member table, search, edit pop-up, delete, download |
| `css/styles.css` | Custom styles on top of the Brite theme |
| `js/validate.js` | Reads a form, checks each field, shows errors |
| `js/storage.js` | The only file that reads/writes member data |
| `js/signup.js`, `js/members.js` | Page logic |

## Data

Members are stored as JSON in `localStorage` (key `partwise.users`) and downloaded as `users.json`, because browser
JS cannot write files. Each browser has its own data.

```json
{ "id": "…", "fullName": "…", "email": "…", "phone": "…", "age": 21,
  "address": "…", "role": "customer", "createdAt": "…", "updatedAt": "…" }
```

Email is stored lower-case, age as a number, role is `customer` or `admin`.

| Field | Rule |
|---|---|
| Full name | required, 2 to 60 characters, letters / spaces / `-` / `'` / `.` |
| Email | required, valid format, unique (not case sensitive) |
| Age | required, whole number 13 to 120 |
| Phone | optional; if filled, 10 to 15 digits |
| Address | required, 5 to 120 characters |

## Shared functions (keep these names so files work together)

```
validate.js   FIELDS                    the five field names
              readForm(form)            -> { fullName, email, age, phone, address }
              validateMember(data)      -> { field: message } (empty object = valid)
              showErrors(form, errors)  marks bad fields red with their message

storage.js    getMembers()              -> array of members
              saveMembers(members)
              emailTaken(email, ignoreId) -> true / false
              addMember(data)           -> the new member
              updateMember(id, data)
              deleteMember(id)
              downloadMembers()         saves users.json
```

## Conventions

- Plain HTML + vanilla JS, no build step. Bootswatch Brite 5.3.8 (not older), Bootstrap JS 5.3.3, Bootstrap Icons 1.11.3,
  Space Grotesk headings.
- Scripts go at the bottom of the page in this order: Bootstrap JS, `validate.js`, `storage.js`, page script.
- 2-space indent, single quotes, `const`/`let`, a short comment above each function.
- **Never put user data into the page with `innerHTML`**; use `createElement` + `textContent`.
- Forms use `novalidate`; each input is `name`d after its field and directly followed by a `.invalid-feedback` div.
- Keep the reference element ids; the JS looks them up.
- Navbar and footer are copied on every page from `reference/index.html`. Shop and Builder links stay disabled.
- No passwords until we have a real backend.

## L06 checklist

1. Submit the sign-up form empty: name, email, age and address are flagged; phone is not
2. Bad email, age 5 and a 3-digit phone: all three are flagged
3. Valid data: success message, form clears, member shows on the Members page
4. Same email again: rejected
5. Edit a member: saves; invalid edits are rejected
6. Delete a member: it disappears
7. Download users.json: matches the Stored data box
8. Phone width: layout still works
9. Every navbar links to every page

## Submission

- Screenshots, full screen (**no split screen**): homepage, sign-up page showing validation errors, `users.json` open
  in VS Code.
- PDF: cover page with **all five names** (a missing name gets a zero), overview, contributions per member (what they
  built, their code, a screenshot), screenshots, code.
- Describe honestly who built what, and check the syllabus rules on AI tools.
