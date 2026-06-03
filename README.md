# Orthodox Companion Web

Orthodox Companion is a web-first Progressive Web App for Eastern Orthodox Christian daily life. This first release turns the product brief into a hosted website with a responsive app shell, offline support, fasting calendar logic, feast countdowns, daily readings, quote generation, study progress, prayer requests, a church finder, library surfaces, a source-backed assistant prototype, admin surfaces, and GitHub Pages deployment automation.

## Live Site

Open the hosted app here: [https://rg-ru.github.io/OC-project/](https://rg-ru.github.io/OC-project/)

This repository is configured for GitHub Pages through `.github/workflows/pages.yml`. After the `main` branch is pushed, enable Pages with `Settings -> Pages -> Source: GitHub Actions`.

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

## Implemented in This Web Release

- Orthodox fasting calendar with jurisdiction selector, allowed foods, calendar view, daily view, feast and fast highlighting.
- Feast countdown for major feasts.
- Orthodox quote generator with save/share actions.
- Daily Epistle and Gospel preview with bookmark and audio controls.
- Orthodox Study Center with lessons, quiz interactions, language flashcards, and local progress.
- Icon encyclopedia, sermon library, chant library, and church finder surface.
- Prayer request wall with anonymous requests, prayer counters, and moderation queue surface.
- Source-backed AI Orthodox Assistant prototype with approved-source model.
- Admin dashboard surfaces for content, moderation, and API health.
- Cookie/local-storage consent, separate location consent for Church Finder, legal center, local data deletion, PWA manifest, service worker cache, responsive dark/light design, and GitHub Pages CI/CD.

## Legal and Privacy

The web app includes an in-page Privacy Policy, Cookie and Local Storage Policy, Terms of Use, and Imprint / Legal Notice. It also includes explicit consent UX for optional location-assisted church sorting.

This is a prototype legal scaffold. Before a real public or commercial launch, replace the placeholder operator/contact details and have the legal text reviewed for the actual entity, hosting setup, Firebase backend, AI processing, analytics, moderation, app stores, and jurisdictions served.

## Product Roadmap

The broader Orthodox Companion mission is to become a complete iOS, Android, and Web app using Flutter, Material 3, Riverpod, and Firebase.

Planned core modules:

1. Orthodox Fasting Calendar
2. Feast Day Countdown
3. Orthodox Quote Generator
4. Church Finder
5. Orthodox Study Center
6. Daily Gospel Readings
7. Orthodox Icon Encyclopedia
8. Bible Reading Tracker
9. Prayer Requests
10. Orthodox Language Learning
11. AI Orthodox Assistant
12. Sermon Library
13. Liturgical Calendar API
14. Orthodox Chant Library
15. Interactive Church History Timeline

Planned platform capabilities:

- User accounts, cloud sync, push notifications, offline mode, global search, analytics, user profiles, admin dashboard, and dark/light themes.
- Multilingual support for English, German, Russian, Greek, Serbian, and Romanian.
- Firebase Authentication, Firestore, Cloud Functions, Cloud Storage, and Firebase Messaging.
- RAG architecture with a vector database, approved Orthodox source library, and source citation system.
- Role-based permissions, content moderation, rate limiting, and GDPR compliance.

## Future Flutter and Firebase Track

This web app is intentionally data-driven so the same product model can move into Flutter and Firebase. The next phase should split the local data in `script.js` into Firestore collections, Cloud Functions API endpoints, Firebase Authentication roles, Cloud Storage media, Firebase Messaging notifications, and a vector-backed RAG service for the Orthodox Assistant.
