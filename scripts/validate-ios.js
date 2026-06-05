const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const iosRoot = path.join(root, "ios", "OrthodoxCompanion");
const requiredFiles = [
  "OrthodoxCompanion.xcodeproj/project.pbxproj",
  "OrthodoxCompanion/AppDelegate.swift",
  "OrthodoxCompanion/SceneDelegate.swift",
  "OrthodoxCompanion/OrthodoxWebViewController.swift",
  "OrthodoxCompanion/Info.plist",
  "OrthodoxCompanion/LaunchScreen.storyboard",
  "OrthodoxCompanion/PrivacyInfo.xcprivacy",
  "OrthodoxCompanion/Assets.xcassets/Contents.json",
  "OrthodoxCompanion/Assets.xcassets/AppIcon.appiconset/Contents.json",
  "OrthodoxCompanion/Assets.xcassets/AccentColor.colorset/Contents.json",
  "OrthodoxCompanion/Assets.xcassets/LaunchIcon.imageset/Contents.json",
];

const requiredDocs = [
  "ios/README.md",
  "ios/AppStore/app-store-metadata.md",
  "ios/AppStore/privacy-nutrition-label.md",
  "ios/AppStore/release-checklist.md",
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(iosRoot, file))) failures.push(`Missing iOS file ${file}`);
}

for (const file of requiredDocs) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing App Store doc ${file}`);
}

const appIconContents = JSON.parse(fs.readFileSync(path.join(iosRoot, "OrthodoxCompanion/Assets.xcassets/AppIcon.appiconset/Contents.json"), "utf8"));
for (const image of appIconContents.images || []) {
  if (image.filename && !fs.existsSync(path.join(iosRoot, "OrthodoxCompanion/Assets.xcassets/AppIcon.appiconset", image.filename))) {
    failures.push(`Missing app icon asset ${image.filename}`);
  }
}

const project = fs.readFileSync(path.join(iosRoot, "OrthodoxCompanion.xcodeproj/project.pbxproj"), "utf8");
for (const marker of ["PRODUCT_BUNDLE_IDENTIFIER = com.rgru.OrthodoxCompanion", "ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon", "PrivacyInfo.xcprivacy"]) {
  if (!project.includes(marker)) failures.push(`Missing Xcode project marker ${marker}`);
}

const webView = fs.readFileSync(path.join(iosRoot, "OrthodoxCompanion/OrthodoxWebViewController.swift"), "utf8");
for (const marker of ["WKWebView", "https://rg-ru.github.io/OC-project/?app=ios", "javaScriptCanOpenWindowsAutomatically", "UIApplication.shared.open"]) {
  if (!webView.includes(marker)) failures.push(`Missing iOS web shell marker ${marker}`);
}

for (const plist of ["OrthodoxCompanion/Info.plist", "OrthodoxCompanion/PrivacyInfo.xcprivacy"]) {
  const plistPath = path.join(iosRoot, plist);
  const plistText = fs.readFileSync(plistPath, "utf8");
  if (!plistText.includes("<plist") || !plistText.includes("</plist>")) {
    failures.push(`Invalid plist shape ${plist}`);
  }
  if (process.platform === "darwin") {
    const result = spawnSync("plutil", ["-lint", plistPath], { encoding: "utf8" });
    if (result.status !== 0) failures.push(`Invalid plist ${plist}: ${result.stderr || result.stdout || "plutil failed"}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Orthodox Companion iOS validation passed.");
