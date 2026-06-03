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
