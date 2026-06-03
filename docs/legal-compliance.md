# Legal and Consent Notes

This project includes a legal and consent scaffold for the static Orthodox Companion web release. It is designed for transparency and safer UX, but it is not legal advice.

## Implemented

- First-party consent banner for cookies and local storage.
- Essential-only, accept-all, and customize flows.
- Separate location consent for Church Finder before the browser geolocation prompt.
- No persistent storage of exact coordinates.
- No third-party analytics, advertising cookies, or cross-site tracking.
- In-page Privacy Policy, Cookie and Local Storage Policy, Terms of Use, and Imprint / Legal Notice.
- Local data deletion and consent reset controls.
- Escaped user-entered prayer and assistant text before rendering.

## Production Requirements

Before production launch, replace prototype placeholders with:

- Legal operator name, postal address, and contact email.
- Data protection contact or officer details if applicable.
- Hosting and processor disclosures.
- Real retention schedule.
- Real Firebase, AI, analytics, moderation, and notification data flows.
- Data export and deletion workflow.
- Country-specific imprint and consumer protection notices.
- Qualified legal review for GDPR, TDDDG/ePrivacy, religious/sensitive data, and app store policies.

## Location Handling

The static web release uses `navigator.geolocation` only after the user:

1. Clicks `Find Near Me`.
2. Accepts the app's location explanation.
3. Grants the browser permission.

Coordinates are held only in memory and used to sort the local sample church list by approximate distance. They are not written to local storage, cookies, GitHub Pages, or a backend.
