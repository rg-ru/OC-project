# Orthodox Companion Web

Orthodox Companion is a web-first Progressive Web App for Eastern Orthodox Christian daily life. This first production-ready website includes a responsive app shell, offline support, fasting calendar logic, feast countdowns, daily readings, quote generation, study progress, prayer requests, a church finder, library surfaces, a source-backed assistant prototype, admin surfaces, and GitHub Pages deployment automation.

## Run Locally

```bash
npm test
npm start
```

Then open `http://localhost:4173`.

## Project Structure

```text
.
├── assets/
│   └── byzantine-hero.png
├── docs/
│   ├── api-design.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── security-and-compliance.md
│   └── testing-and-release.md
├── scripts/
│   └── validate-site.js
├── .github/workflows/pages.yml
├── index.html
├── script.js
├── site.webmanifest
├── styles.css
└── sw.js
```

## Deploy to GitHub Pages

1. Create a GitHub repository named `orthodox-companion`.
2. Push this folder to the repository's `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Set the source to `GitHub Actions`.
5. Run the `Deploy to GitHub Pages` workflow if it does not run automatically.

The workflow validates the site and deploys the static PWA.

## Future Flutter and Firebase Track

This web app is intentionally data-driven so the same product model can move into Flutter and Firebase. The next phase should split the local data in `script.js` into Firestore collections, Cloud Functions API endpoints, Firebase Authentication roles, Cloud Storage media, Firebase Messaging notifications, and a vector-backed RAG service for the Orthodox Assistant.
