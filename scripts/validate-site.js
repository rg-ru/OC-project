const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "site.webmanifest",
  "sw.js",
  "assets/byzantine-hero.png",
  "assets/app-icon-192.png",
  "assets/app-icon-512.png",
  "assets/app-icon-1024.png",
  "assets/apple-touch-icon.png",
  ".github/workflows/pages.yml",
  "docs/architecture.md",
  "docs/database-schema.md",
  "docs/api-design.md",
  "docs/testing-and-release.md",
  "docs/security-and-compliance.md",
  "docs/legal-compliance.md",
];

const requiredSections = [
  "overview",
  "calendar",
  "readings",
  "study",
  "library",
  "community",
  "assistant",
  "admin",
  "settings",
  "legal",
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Missing ${file}`);
  }
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const section of requiredSections) {
  if (!html.includes(`id="${section}"`)) {
    failures.push(`Missing #${section} section`);
  }
}

const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
for (const feature of [
  "fastRuleForDate",
  "renderCalendar",
  "renderAssistant",
  "renderPrayers",
  "renderGlobalSearch",
  "renderConsentBanner",
  "renderSettings",
  "applyPersonalization",
  "updateSetting",
  "requestChurchLocation",
  "escapeHtml",
]) {
  if (!script.includes(`function ${feature}`)) {
    failures.push(`Missing ${feature} implementation`);
  }
}

for (const marker of ["consent-banner", "location-modal", "privacy-policy", "cookie-policy", "imprint"]) {
  if (!html.includes(marker)) {
    failures.push(`Missing legal/consent marker ${marker}`);
  }
}

for (const marker of ["settings-preview-title", "data-setting=\"accent\"", "data-setting=\"appLanguage\"", "data-setting=\"simpleMode\"", "data-color-setting=\"customAccent\"", "reduce-motion-toggle"]) {
  if (!html.includes(marker)) {
    failures.push(`Missing settings marker ${marker}`);
  }
}

for (const marker of ["nav-icon", "ios26-v11"]) {
  if (!html.includes(marker)) {
    failures.push(`Missing iPhone app shell marker ${marker}`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "site.webmanifest"), "utf8"));
if (manifest.name !== "Orthodox Companion") failures.push("Manifest name mismatch");
if (manifest.display !== "standalone") failures.push("Manifest display should be standalone");
if (manifest.orientation !== "portrait-primary") failures.push("Manifest orientation missing");
if (!manifest.icons?.length) failures.push("Manifest icon missing");
if (!manifest.icons?.some((icon) => icon.sizes === "512x512" && icon.purpose?.includes("maskable"))) {
  failures.push("Manifest maskable 512 icon missing");
}

const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
if (!css.includes("@media")) failures.push("Responsive media queries missing");
if (!css.includes("--gold")) failures.push("Design tokens missing");
if (!css.includes("safe-area-inset-bottom")) failures.push("Mobile safe-area styling missing");
if (!css.includes("--tabbar-height")) failures.push("Mobile tab bar token missing");
if (!css.includes("body[data-simple=\"on\"]")) failures.push("Simple mode styling missing");
if (!css.includes("body[data-accent=\"custom\"]")) failures.push("Custom color styling missing");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Orthodox Companion web validation passed.");
