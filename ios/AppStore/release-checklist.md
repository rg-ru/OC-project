# TestFlight and App Store Release Checklist

## Before Opening Xcode

- Confirm Google, Apple, and Email/Password providers are enabled in Firebase Authentication.
- Add `rg-ru.github.io` to Firebase Authentication authorized domains.
- Add production operator/contact details to the Legal Center before a real public launch.
- Confirm copyrighted Orthodox texts, icons, chants, and sermon content are licensed or replaced.
- Confirm the assistant only uses approved Orthodox sources.

## Xcode

- Open `ios/OrthodoxCompanion/OrthodoxCompanion.xcodeproj`.
- Select the `OrthodoxCompanion` target.
- Choose your Apple Developer Team in Signing & Capabilities.
- Confirm bundle identifier: `com.rgru.OrthodoxCompanion`.
- Confirm version: `1.0.0`, build: `1`.
- Build on a real iPhone.
- Test:
  - Today tab loads.
  - Calendar opens.
  - Account screen loads.
  - Google sign-in either completes or shows the expected provider error.
  - Apple sign-in is configured and completes.
  - Email/password sign-in works.
  - Location prompt appears only after Find Near Me.
  - External directions open outside the app.

## App Store Connect

- Create a new app record.
- Add iOS platform.
- Enter metadata from `ios/AppStore/app-store-metadata.md`.
- Enter privacy answers from `ios/AppStore/privacy-nutrition-label.md`.
- Upload screenshots.
- Upload build from Xcode Organizer.
- Add review notes and temporary test credentials if required.
- Submit to TestFlight first.
- After TestFlight smoke testing, submit to App Review.

## App Review Notes to Mention

- Sign-in is optional.
- Location is optional and user-triggered.
- Admin tools are role-gated and not required for normal use.
- The app is educational/devotional and not a substitute for pastoral guidance.
