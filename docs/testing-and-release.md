# Testing and Release Strategy

## Current Web Release

Run:

```bash
npm test
```

The validation scripts check required files, core app sections, service worker assets, responsive CSS, manifest metadata, key JavaScript feature implementations, iOS project files, App Store docs, icons, and privacy manifests.

## Browser QA

- Desktop: 1440 by 1000.
- Tablet: 900 by 1180.
- Mobile: 390 by 844.
- Verify no text overflow, no overlapping controls, correct theme toggling, app navigation, local storage persistence, and offline reload after first visit.

## Production Test Plan

- Unit tests for calendar calculations, fasting periods, Pascha-relative feasts, and jurisdiction differences.
- Integration tests for Firestore repositories, Cloud Functions API responses, moderation flow, notification scheduling, and assistant retrieval.
- Golden UI tests for Flutter screens across dark and light themes.
- End-to-end tests for account creation, prayer request submission, study progress, reading reminders, and assistant citations.
- Accessibility checks for keyboard navigation, contrast, labels, and screen reader landmarks.

## CI/CD

The included GitHub Actions workflow:

1. Checks out the repository.
2. Sets up Node.
3. Runs `npm test`.
4. Uploads the static site as a Pages artifact.
5. Deploys to GitHub Pages.

## App Store and Play Store Future Release

The current repository includes an iOS App Store preparation track under `ios/`.

For the iOS wrapper phase:

- Open `ios/OrthodoxCompanion/OrthodoxCompanion.xcodeproj` in Xcode.
- Select an Apple Developer Team in Signing & Capabilities.
- Build on a real iPhone.
- Archive with Product -> Archive.
- Upload through Xcode Organizer to App Store Connect.
- Use `ios/AppStore/` for metadata, privacy label draft, review notes, and release checklist.
- Submit to TestFlight before App Review.

For the Flutter phase:

- Create separate Firebase projects for development, staging, and production.
- Configure bundle IDs and package names.
- Use Fastlane or Codemagic for signed builds.
- Store signing keys in CI secrets.
- Enable crash reporting and release health checks.
- Prepare privacy labels, GDPR data export/deletion process, moderation policy, and theological source review policy.
