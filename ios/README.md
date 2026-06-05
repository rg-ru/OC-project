# Orthodox Companion iOS

This folder prepares Orthodox Companion for Apple distribution as a native iOS app shell.

## What Is Included

- `OrthodoxCompanion/OrthodoxCompanion.xcodeproj`: Xcode project.
- Native Swift `WKWebView` shell loading the hosted app at `https://rg-ru.github.io/OC-project/?app=ios`.
- App icon asset catalog generated from `assets/app-icon-1024.png`.
- Launch screen.
- `PrivacyInfo.xcprivacy`.
- App Store submission drafts in `ios/AppStore/`.

## What Still Requires Your Apple Account

1. Install full Xcode from the Mac App Store.
2. Open `ios/OrthodoxCompanion/OrthodoxCompanion.xcodeproj`.
3. Select the `OrthodoxCompanion` target.
4. In Signing & Capabilities, choose your Apple Developer Team.
5. Confirm or change the bundle identifier: `com.rgru.OrthodoxCompanion`.
6. Build on a real iPhone.
7. Product -> Archive.
8. Distribute App -> App Store Connect -> Upload.
9. Finish metadata, privacy, screenshots, and review notes in App Store Connect.

## Firebase Auth Note

The hosted web app now uses Firebase Auth for Google, Apple, and email/password. In an iOS `WKWebView`, Google OAuth can be stricter than Safari. If Google rejects embedded web authentication, the next production step is to add native Firebase iOS Auth plus GoogleSignIn and Sign in with Apple, then pass the authenticated session into the web layer.

## App Review Risk

Apple can reject apps that are only thin website wrappers. Reduce this risk by making sure the app experience feels complete, stable, app-like, useful without account sign-in, and has a reviewed privacy policy and support path.
