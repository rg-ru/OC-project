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
  ".github/workflows/pages.yml",
  "docs/architecture.md",
  "docs/database-schema.md",
  "docs/api-design.md",
  "docs/testing-and-release.md",
  "docs/security-and-compliance.md",
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
for (const feature of ["fastRuleForDate", "renderCalendar", "renderAssistant", "renderPrayers", "renderGlobalSearch"]) {
  if (!script.includes(`function ${feature}`)) {
    failures.push(`Missing ${feature} implementation`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "site.webmanifest"), "utf8"));
if (manifest.name !== "Orthodox Companion") failures.push("Manifest name mismatch");
if (!manifest.icons?.length) failures.push("Manifest icon missing");

const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
if (!css.includes("@media")) failures.push("Responsive media queries missing");
if (!css.includes("--gold")) failures.push("Design tokens missing");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Orthodox Companion web validation passed.");
