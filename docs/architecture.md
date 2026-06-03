# Orthodox Companion Architecture

## Web-First Release

The current release is a static Progressive Web App served by GitHub Pages. It has no runtime server dependency, which keeps hosting simple and reliable while preserving a production app structure.

### Layers

- `index.html`: semantic app shell and all first-release product surfaces.
- `styles.css`: Material-inspired design tokens, dark and light themes, responsive layout, and accessible states.
- `script.js`: local application state, calendar logic, search, study progress, prayer wall, assistant prototype, and offline-friendly persistence.
- `sw.js`: service worker cache for offline mode.
- `site.webmanifest`: installable PWA metadata.
- `.github/workflows/pages.yml`: CI validation and GitHub Pages deployment.

## Target Flutter and Firebase Architecture

### Frontend

- Flutter app for iOS, Android, and Web.
- Material 3 components with custom Byzantine-inspired tokens.
- Riverpod providers for authentication, calendar, readings, library search, study progress, prayer requests, and assistant chat.
- Offline-first repositories backed by local storage and Firestore sync.
- Internationalization for English, German, Russian, Greek, Serbian, and Romanian.

### Firebase Backend

- Firebase Authentication for email, Apple, Google, and anonymous preview sessions.
- Firestore for structured app data and user state.
- Cloud Storage for icons, sermon audio, chant audio, transcripts, and source documents.
- Cloud Functions for liturgical calendar API, moderation workflows, assistant retrieval, rate limiting, and notification fanout.
- Firebase Messaging for feast countdowns, reading reminders, fasting reminders, and prayer notifications.
- Analytics for product events with privacy-conscious retention.

### AI Assistant

- Approved Orthodox source library stored in Cloud Storage and indexed into a vector database.
- Retrieval pipeline filters by language, jurisdiction, source type, and clergy-approved status.
- Answers must cite retrieved sources and refuse unsupported claims.
- Conversation history is stored per user with export and deletion controls.

## Module Boundaries

- Calendar domain: fasting rules, feast calculations, daily saints, readings, jurisdiction policy.
- Content domain: icons, sermons, chants, lessons, translations, review states.
- Community domain: prayer requests, counters, abuse reports, moderation.
- User domain: profile, favorites, bookmarks, notes, progress, settings.
- Assistant domain: source ingestion, embeddings, retrieval, answer generation, citations, safety logs.

## Design System

- Dark theme starts with charcoal, candlelight gold, oxblood red, deep green, and muted parchment.
- Light theme uses parchment surfaces with restrained gold and green accents.
- Cards use tight radii, clear borders, strong contrast, and dense app-like information layout.
- The first screen is a usable daily dashboard rather than a marketing landing page.
