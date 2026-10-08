# Project Alpha: PC Parts Shop (L06 starter)

A PC-parts store with a build configurator. This starter covers **L06: User/Member Management**:
homepage, sign-up page with JavaScript validation, and a members page with edit/delete, all stored as JSON.

Theme: Bootswatch **Brite** (Bootstrap 5.3). To try another theme, change `brite` in the first `<link>` of each HTML file
(for example `darkly`, `cyborg`, `vapor`).

## Run it

Just open `index.html` in a browser (no install needed). In VS Code you can also use the *Live Server* extension.
Needs an internet connection for the Bootstrap, icon and font CDNs.

## Files

```
index.html        Homepage (hero, feature cards, nav, footer)
signup.html       Sign-up form + validation messages
members.html      Member table, search, edit modal, delete, JSON download/import, raw JSON view
css/styles.css    Custom styling on top of Brite
js/validate.js    Validation rules + helpers that show errors on a form
js/storage.js     UserStore: the only file that reads/writes member data (localStorage as JSON)
js/signup.js      Sign-up form logic
js/members.js     Members page logic (render, edit, delete, import/export)
data/users.sample.json   Example of the data format (import it on the members page to get demo members)
```

## How the JSON storage works

Browser JavaScript cannot write files by itself, so members are saved as JSON in the browser (`localStorage`).
On the members page:

- **Download users.json** saves a real `users.json` file (use this for the "JSON file" screenshot).
- **Import JSON** loads a file like `data/users.sample.json` back in (duplicates and invalid rows are skipped).
- The **Stored data** box shows exactly what the JSON contains.

Note: localStorage is per browser, so each teammate sees only their own test data. Export/import to share.

Each member looks like this:

```json
{
  "id": "…", "fullName": "…", "email": "…", "phone": "…", "age": 21,
  "address": "…", "role": "customer", "createdAt": "…", "updatedAt": "…"
}
```

## Validation rules

| Field | Rule |
|---|---|
| Full name | required, 2 to 60 characters, letters / spaces / hyphens / apostrophes / periods |
| Email | required, valid format, must be unique (not case sensitive) |
| Age | required, whole number 13 to 120 |
| Phone | optional; if filled, 10 to 15 digits |
| Address | required, 5 to 120 characters |

## Screenshots to take for the PDF (full screen, no split screen)

1. **Homepage** (`index.html`)
2. **Sign-up page showing validation**: click "Create account" with the form empty (or type a bad email and age), so the red error messages show
3. **users.json**: click "Download users.json", open the file in VS Code, screenshot it
4. Optional extras: members table, the edit modal, a successful sign-up message
5. Code screenshots (or submit the zipped project)

## Suggested task split (L06)

| Member | Component |
|---|---|
| Jeremy Hou | Project setup / Git repo, `storage.js` (JSON layer), integration |
| Oliver Aaron | `signup.html`, `validate.js`, `signup.js` |
| Anson Poon | `index.html`, navbar, `styles.css`, Bootstrap theming |
| Aryan Vir | `members.html` + `members.js` (table, edit, delete), input sanitization |
| Miles Alford | PDF report, screenshots, proofreading, final submission |

Everyone's name must be on the PDF cover page **and** in the contributions section.

## Roadmap (how this grows)

- **L07** Product management: copy the members pattern (`products.json`, `products.html`, same table + modal).
- **L08 / L09** Cart and storefront: product grid (the Start Bootstrap *Shop Homepage* layout is a good reference), cart saved by member `id`.
- **L10** Billing and returns pages.
- **L11 / L12** Replace the internals of `storage.js` with Node + MongoDB calls; pages keep using the same `UserStore` functions. Add password hashing and sign-in at that point (never store plain-text passwords in JSON).
- **Three.js** build viewer mounts in `#build-preview-slot` on the homepage.
