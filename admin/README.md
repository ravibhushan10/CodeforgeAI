# CodeForge Admin — React

A full admin dashboard for the CodeForge / LeetCode-style platform.  
Built with **React 18 + Vite**. No extra UI libraries — pure CSS.

---

## Project Structure

```
codeforge-admin/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  ← React entry point
    ├── App.jsx                   ← Root: login guard + auth state
    ├── styles/
    │   └── global.css            ← All styles (ported from original style.css)
    ├── utils/
    │   ├── constants.js          ← API URL, localStorage keys
    │   ├── helpers.js            ← escHtml, diffBadgeClass, formatDate
    │   └── apiFetch.js           ← Authenticated fetch factory
    ├── hooks/
    │   └── useToast.js           ← Toast notification hook
    ├── components/
    │   ├── Toasts.jsx            ← Toast renderer
    │   ├── Sidebar.jsx           ← Navigation sidebar
    │   ├── ConfirmModal.jsx      ← Generic delete confirmation dialog
    │   ├── ProblemModal.jsx      ← Add / Edit problem form
    │   └── DeleteByNumModal.jsx  ← Delete problem by number + preview
    └── pages/
        ├── LoginPage.jsx         ← Admin sign-in form
        ├── DashboardPage.jsx     ← Shell: sidebar + tab routing
        ├── ProblemsPage.jsx      ← Problems table + all CRUD
        ├── UsersPage.jsx         ← Users table + plan toggle + delete
        └── StatsPage.jsx         ← Platform stat cards
```

---

## Setup

### 1. Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm 9+** (comes with Node)

### 2. Create the project folder & copy files

```bash
mkdir codeforge-admin
cd codeforge-admin
```

Copy all the files from this repo into that folder keeping the same structure shown above.

### 3. Install dependencies

```bash
npm install
```

This installs React 18, ReactDOM, and Vite.

### 4. Run in development

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy that folder to any static host  
(Vercel, Netlify, GitHub Pages, Nginx, etc.).

### 6. Preview the production build locally

```bash
npm run preview
```

---

## Persistent Login

When an admin signs in, the JWT token is saved to `localStorage` with **no expiry**.  
`localStorage` persists until:

- The admin clicks **Sign Out** (clears it manually), or  
- The browser's storage is explicitly cleared (DevTools → Application → Clear Storage).

This means the admin can close the tab, restart the browser, or come back days later  
and will still be signed in on that machine — no need to re-enter credentials.

If the token is rejected by the backend (expired / invalid), the app automatically  
clears `localStorage` and redirects to the login page.

---

## Changing the Backend URL

The API base URL is defined in one place:

```js
// src/utils/constants.js
export const DEFAULT_API = 'https://leetcode-backend-1-azl8.onrender.com'
```

Change that string to point to your own server.

---

## Deploy to Vercel (fastest option)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite and sets the build command + output dir.

## Deploy to Netlify

```bash
npm run build
# drag-and-drop the `dist/` folder at app.netlify.com/drop
```

Or connect the GitHub repo and set:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
