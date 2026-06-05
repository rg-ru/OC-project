# App Privacy Draft

Use this as a starting point for App Store Connect. Keep it accurate if the backend changes.

## Privacy Policy URL

`https://rg-ru.github.io/OC-project/#privacy-policy`

## User Privacy Choices URL

`https://rg-ru.github.io/OC-project/#cookie-policy`

## Data Collected

### Contact Info

- Name: collected through Firebase Authentication if the user signs in with Google, Apple, or email.
- Email Address: collected through Firebase Authentication if the user signs in.
- Linked to user: Yes.
- Used for: App functionality and account management.
- Tracking: No.

### Identifiers

- User ID: Firebase Auth UID.
- Linked to user: Yes.
- Used for: App functionality, account/session management, role checks.
- Tracking: No.

### User Content

- Prayer requests, notes, assistant messages, bookmarks, and admin education source drafts are currently local/prototype data unless a production backend is added.
- If synced to Firebase later, declare User Content as collected, linked to user where applicable, and used for app functionality/moderation.

### Location

- Precise or coarse location is requested only when the user chooses Find Near Me.
- Current static implementation uses coordinates in memory to sort sample churches and does not send coordinates to a backend.
- If production sends coordinates to a server for search, declare Location as collected and used for app functionality.

### Diagnostics

- Not intentionally collected in the current app.
- If Firebase Crashlytics, Analytics, or App Store diagnostics are added, update this label.

## Tracking

- Tracking: No.
- Third-party advertising: No.
- Data broker sharing: No.
