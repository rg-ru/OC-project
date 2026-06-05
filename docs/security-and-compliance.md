# Security and Compliance

## Role-Based Permissions

Planned roles:

- `user`: profile, favorites, notes, progress, prayer submissions.
- `moderator`: prayer wall review and abuse handling.
- `editor`: content drafts, translations, source metadata.
- `clergy_reviewer`: theological approval for sources, lessons, assistant retrieval material.
- `admin`: user roles, API policy, analytics configuration.

## Firebase Controls

- Firebase Authentication with verified providers.
- Google, Apple, and Email/Password providers must be enabled in Firebase Authentication before the web buttons can complete sign-in.
- The GitHub Pages domain must be listed as an authorized domain in Firebase Authentication.
- Apple sign-in requires the Apple Services ID, return URL, and private key configuration in Firebase.
- App Check for web and mobile clients.
- Firestore security rules with owner checks and role claims.
- Cloud Functions middleware for rate limiting, audit logs, and request validation.
- Cloud Storage rules tied to approved content records.

## Content Moderation

- Prayer requests are pending by default.
- Abuse reports create moderation tasks.
- Public community content uses profanity, harassment, personal data, and spam checks.
- Rejected requests remain private to moderators for audit windows only.

## AI Assistant Safety

- Retrieval only from approved Orthodox sources.
- Responses require citations.
- Unsupported questions receive a refusal or a request for pastoral guidance.
- The assistant must avoid replacing confession, pastoral care, medical advice, legal advice, or emergency help.

## GDPR

- Consent version stored on the user profile.
- Export endpoint for profile, notes, favorites, progress, and prayer submissions.
- Deletion workflow removes or anonymizes user-owned records.
- Analytics events avoid sensitive religious notes and prayer text.
- Data retention windows are documented per collection.

## Web Prototype Consent

- The static web release displays a first-party consent banner for cookies and local storage.
- Optional location use for Church Finder is gated behind an in-app consent notice and then the browser geolocation permission prompt.
- Coordinates are used in memory only to sort sample churches by approximate distance and are not stored or sent to a backend.
- The legal center includes Privacy, Cookie and Local Storage, Terms, and Imprint scaffolds.
- Production launch requires real operator details, processor disclosures, retention schedules, export/deletion workflows, and legal review.
