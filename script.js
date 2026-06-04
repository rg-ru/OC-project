const CONSENT_KEY = "oc:consent";
const CONSENT_COOKIE = "oc_cookie_consent";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const DEFAULT_CONSENT = {
  necessary: true,
  preferences: false,
  location: false,
  analytics: false,
  updatedAt: null,
};

function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return false;
  }
  return true;
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    return false;
  }
  return true;
}

function getConsent() {
  const stored = readStorage(CONSENT_KEY);
  if (!stored) return { ...DEFAULT_CONSENT };
  try {
    return { ...DEFAULT_CONSENT, ...JSON.parse(stored), necessary: true };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

function writeConsentCookie(consent) {
  const granted = Object.entries(consent)
    .filter(([key, value]) => key !== "updatedAt" && value)
    .map(([key]) => key)
    .join(".");
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(granted)}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function saveConsent(nextConsent) {
  const consent = {
    ...DEFAULT_CONSENT,
    ...nextConsent,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };
  writeStorage(CONSENT_KEY, JSON.stringify(consent));
  writeConsentCookie(consent);
  return consent;
}

function consentAllows(category) {
  return Boolean(getConsent()[category]);
}

const PERSONALIZATION_DEFAULTS = {
  theme: "dark",
  accent: "gold",
  textScale: "standard",
  density: "comfortable",
  background: "rich",
  motion: "normal",
};

const PERSONALIZATION_STORAGE_KEYS = {
  theme: "oc:theme",
  accent: "oc:accent",
  textScale: "oc:textScale",
  density: "oc:density",
  background: "oc:background",
  motion: "oc:motion",
};

const PERSONALIZATION_OPTIONS = {
  theme: ["dark", "light", "system"],
  accent: ["gold", "green", "blue", "ruby", "violet", "parchment"],
  textScale: ["standard", "large", "xl"],
  density: ["compact", "comfortable", "spacious"],
  background: ["rich", "soft", "minimal"],
  motion: ["normal", "reduced"],
};

const PERSONALIZATION_COPY = {
  accent: {
    gold: { label: "Byzantine", copy: "Gold accents, warm panels, and a candlelit reading surface." },
    green: { label: "Olive", copy: "Olive accents with a grounded, garden-like calm." },
    blue: { label: "Aegean", copy: "Sea-blue accents with crisp contrast and a quieter glow." },
    ruby: { label: "Ruby", copy: "Deep red accents with a feast-day warmth." },
    violet: { label: "Violet", copy: "Soft violet accents for a contemplative evening feel." },
    parchment: { label: "Parchment", copy: "Muted ink and parchment accents for gentle reading." },
  },
  theme: {
    dark: "Dark",
    light: "Light",
    system: "System",
  },
  textScale: {
    standard: "standard text",
    large: "larger text",
    xl: "extra-large text",
  },
  density: {
    compact: "compact spacing",
    comfortable: "comfortable spacing",
    spacious: "spacious spacing",
  },
  background: {
    rich: "rich background",
    soft: "soft background",
    minimal: "minimal background",
  },
};

function readPersonalization(setting) {
  const fallback = PERSONALIZATION_DEFAULTS[setting];
  const value = readStorage(PERSONALIZATION_STORAGE_KEYS[setting], fallback);
  return PERSONALIZATION_OPTIONS[setting].includes(value) ? value : fallback;
}

const state = {
  jurisdiction: readStorage("oc:j", "antiochian"),
  theme: readPersonalization("theme"),
  accent: readPersonalization("accent"),
  textScale: readPersonalization("textScale"),
  density: readPersonalization("density"),
  background: readPersonalization("background"),
  motion: readPersonalization("motion"),
  selectedDate: new Date(),
  quoteIndex: Number(readStorage("oc:quote", "0")),
  calendarMode: "month",
  language: "greek",
  flashIndex: 0,
  flashFlipped: false,
  plan: readStorage("oc:plan", "new-testament"),
  userPosition: null,
};

const feastData = [
  { name: "Theophany", date: "01-06", oldDate: "01-19", rank: "major", description: "The baptism of Christ and the manifestation of the Holy Trinity." },
  { name: "Meeting of the Lord", date: "02-02", oldDate: "02-15", rank: "major", description: "Christ is presented in the Temple and received by righteous Simeon." },
  { name: "Annunciation", date: "03-25", oldDate: "04-07", rank: "major", description: "The Archangel Gabriel announces the Incarnation to the Theotokos." },
  { name: "Palm Sunday", relative: "pascha:-7", rank: "major", description: "The Lord enters Jerusalem before His saving Passion." },
  { name: "Pascha", relative: "pascha:0", rank: "major", description: "The Resurrection of Christ, feast of feasts." },
  { name: "Ascension", relative: "pascha:39", rank: "major", description: "Christ ascends in glory forty days after Pascha." },
  { name: "Pentecost", relative: "pascha:49", rank: "major", description: "The descent of the Holy Spirit upon the apostles." },
  { name: "Transfiguration", date: "08-06", oldDate: "08-19", rank: "major", description: "Christ reveals His divine glory on Mount Tabor." },
  { name: "Dormition", date: "08-15", oldDate: "08-28", rank: "major", description: "The falling asleep of the Most Holy Theotokos." },
  { name: "Nativity of the Theotokos", date: "09-08", oldDate: "09-21", rank: "major", description: "The birth of the Mother of God." },
  { name: "Elevation of the Cross", date: "09-14", oldDate: "09-27", rank: "major", description: "The life-giving Cross is lifted up for veneration." },
  { name: "Entrance of the Theotokos", date: "11-21", oldDate: "12-04", rank: "major", description: "The Theotokos enters the Temple in preparation for her vocation." },
  { name: "Nativity of Christ", date: "12-25", oldDate: "01-07", rank: "major", description: "The birth according to the flesh of our Lord Jesus Christ." },
];

const paschaDates = {
  2025: "2025-04-20",
  2026: "2026-04-12",
  2027: "2027-05-02",
  2028: "2028-04-16",
  2029: "2029-04-08",
  2030: "2030-04-28",
};

const jurisdictionProfiles = {
  antiochian: { label: "Antiochian", calendar: "new", strictness: "moderate" },
  greek: { label: "Greek", calendar: "new", strictness: "moderate" },
  oca: { label: "OCA", calendar: "new", strictness: "moderate" },
  romanian: { label: "Romanian", calendar: "new", strictness: "moderate" },
  russian: { label: "Russian", calendar: "old", strictness: "traditional" },
  serbian: { label: "Serbian", calendar: "old", strictness: "traditional" },
};

const allowedFoodSets = {
  none: ["No fasting restriction"],
  strict: ["Vegetables", "Fruit", "Bread", "Legumes", "Shellfish"],
  wineOil: ["Vegetables", "Fruit", "Bread", "Legumes", "Wine", "Oil"],
  fish: ["Vegetables", "Fruit", "Bread", "Legumes", "Wine", "Oil", "Fish"],
  dairy: ["Dairy", "Eggs", "Fish", "Wine", "Oil"],
};

const readings = [
  {
    title: "Epistle",
    citation: "Romans 2:14-29",
    text: "The law written in the heart calls the whole person toward humility, repentance, and obedience.",
  },
  {
    title: "Gospel",
    citation: "Matthew 5:33-41",
    text: "Christ teaches truthfulness, patience, and the freedom that comes from refusing retaliation.",
  },
];

const quoteLibrary = [
  {
    text: "Acquire the spirit of peace, and thousands around you will be saved.",
    source: "St. Seraphim of Sarov",
    tag: "peace",
  },
  {
    text: "The proof of love is in the works. Where love exists, it works great things.",
    source: "St. Gregory the Dialogist",
    tag: "love",
  },
  {
    text: "Prayer is the light of the soul and the true knowledge of God.",
    source: "St. John Chrysostom",
    tag: "prayer",
  },
  {
    text: "Stand before God with the mind in the heart, and remain there.",
    source: "St. Theophan the Recluse",
    tag: "prayer",
  },
  {
    text: "A humble person is never disturbed, because everything is received as mercy.",
    source: "St. Paisios of Mount Athos, teaching paraphrase",
    tag: "humility",
  },
  {
    text: "When the heart becomes simple, prayer becomes warm and the soul finds rest.",
    source: "St. Porphyrios, teaching paraphrase",
    tag: "prayer",
  },
  {
    text: "Self-knowledge begins when we stop excusing ourselves before God.",
    source: "St. Ignatius Brianchaninov, teaching paraphrase",
    tag: "repentance",
  },
];

const lessons = [
  { id: "creed", title: "The Nicene Creed", area: "Catechism", minutes: 12 },
  { id: "icons", title: "Holy Icons and Veneration", area: "Catechism", minutes: 10 },
  { id: "councils", title: "Seven Ecumenical Councils", area: "Church History", minutes: 16 },
  { id: "liturgy", title: "The Divine Liturgy", area: "Worship", minutes: 14 },
  { id: "scripture", title: "Reading the Gospels with the Church", area: "Scripture", minutes: 11 },
];

const quiz = [
  {
    question: "Which feast is called the feast of feasts?",
    options: ["Pascha", "Theophany", "Pentecost", "Dormition"],
    answer: "Pascha",
  },
  {
    question: "Which council confessed Christ as fully God and fully man?",
    options: ["Chalcedon", "Nicaea II", "Constantinople III", "Ephesus"],
    answer: "Chalcedon",
  },
  {
    question: "What does the iconostasis primarily do?",
    options: ["Reveals the heavenly worship", "Blocks the altar", "Stores books", "Marks seating"],
    answer: "Reveals the heavenly worship",
  },
];

const languageCards = {
  greek: [
    { front: "Kyrie eleison", back: "Lord, have mercy" },
    { front: "Agios o Theos", back: "Holy God" },
    { front: "Eirene pasi", back: "Peace be to all" },
  ],
  slavonic: [
    { front: "Gospodi pomilui", back: "Lord, have mercy" },
    { front: "Svjatyj Bozhe", back: "Holy God" },
    { front: "Mir vsem", back: "Peace be to all" },
  ],
};

const icons = [
  { name: "Christ Pantocrator", type: "Icon", summary: "Christ shown as ruler and judge, blessing with the Gospel in hand." },
  { name: "Theotokos of Vladimir", type: "Theotokos", summary: "A tender Eleusa icon showing the Mother of God and Christ in closeness." },
  { name: "Hospitality of Abraham", type: "Trinity", summary: "The Old Testament visitation received as a window into Trinitarian revelation." },
  { name: "The Ladder of Divine Ascent", type: "Monastic", summary: "An image of ascetical ascent and spiritual vigilance." },
  { name: "Dormition of the Theotokos", type: "Feast", summary: "Christ receives the soul of His Mother at her falling asleep." },
];

const sermons = [
  { title: "On Prayer of the Heart", speaker: "St. Theophan the Recluse", topic: "Prayer", length: "18 min" },
  { title: "On Almsgiving", speaker: "St. John Chrysostom", topic: "Mercy", length: "24 min" },
  { title: "On Repentance", speaker: "St. Ignatius Brianchaninov", topic: "Repentance", length: "21 min" },
];

const chants = [
  { title: "Christ is Risen", tradition: "Byzantine", tone: "Paschal" },
  { title: "Cherubic Hymn", tradition: "Russian", tone: "Liturgy" },
  { title: "O Gladsome Light", tradition: "Greek", tone: "Vespers" },
  { title: "Axion Estin", tradition: "Serbian", tone: "Theotokion" },
];

const churches = [
  { name: "Holy Trinity Orthodox Cathedral", jurisdiction: "OCA", city: "San Francisco", lat: 37.7801, lng: -122.4201, schedule: "Vespers Sat 6 PM, Liturgy Sun 9:30 AM", phone: "+1 415 000 0101" },
  { name: "Annunciation Greek Orthodox Cathedral", jurisdiction: "Greek", city: "Atlanta", lat: 33.793, lng: -84.37, schedule: "Orthros Sun 8:45 AM, Liturgy Sun 10 AM", phone: "+1 404 000 0102" },
  { name: "St. Nicholas Serbian Orthodox Church", jurisdiction: "Serbian", city: "Chicago", lat: 41.8781, lng: -87.6298, schedule: "Liturgy Sun 10 AM", phone: "+1 312 000 0103" },
  { name: "St. Mary Antiochian Orthodox Church", jurisdiction: "Antiochian", city: "Cambridge", lat: 42.3736, lng: -71.1097, schedule: "Matins Sun 9 AM, Liturgy Sun 10 AM", phone: "+1 617 000 0104" },
];

const sourceLibrary = [
  { id: "scripture", title: "Holy Scripture", scope: "Bible readings and direct citations" },
  { id: "services", title: "Liturgical texts", scope: "Feasts, prayers, and worship language" },
  { id: "fathers", title: "Church Fathers", scope: "Patristic explanations with citations" },
  { id: "catechism", title: "Approved catechism library", scope: "Simple teaching summaries reviewed by clergy" },
];

const apiStatus = [
  { title: "/v1/readings/daily", detail: "Daily Epistle, Gospel, saints, tone, and feast metadata" },
  { title: "/v1/saints", detail: "Searchable saints endpoint with calendar and biography filters" },
  { title: "/v1/feasts", detail: "Fixed and movable feasts with countdown support" },
  { title: "/v1/fasting", detail: "Jurisdiction-aware daily fasting rule with allowed foods" },
];

const contentQueue = [
  { title: "New sermon transcript", detail: "Needs source verification and topic tags" },
  { title: "Romanian translation pack", detail: "Ready for reviewer assignment" },
  { title: "Icon article update", detail: "Pending historical citation check" },
];

const readingPlans = {
  "new-testament": { label: "New Testament in 90 days", total: 90 },
  psalms: { label: "Psalms in 30 days", total: 30 },
  gospels: { label: "Four Gospels in 40 days", total: 40 },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric", ...options }).format(date);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseIso(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getProfile() {
  return jurisdictionProfiles[state.jurisdiction] || jurisdictionProfiles.antiochian;
}

function getPascha(year) {
  return parseIso(paschaDates[year] || paschaDates[2026]);
}

function feastDateForYear(feast, year) {
  if (feast.relative) {
    const [, offset] = feast.relative.split(":");
    return addDays(getPascha(year), Number(offset));
  }

  const profile = getProfile();
  const dateKey = profile.calendar === "old" && feast.oldDate ? feast.oldDate : feast.date;
  const [month, day] = dateKey.split("-").map(Number);
  const targetYear = feast.name === "Nativity of Christ" && profile.calendar === "old" && month === 1 ? year + 1 : year;
  return new Date(targetYear, month - 1, day);
}

function getFeastsForRange(year) {
  return feastData.map((feast) => ({ ...feast, actualDate: feastDateForYear(feast, year) }));
}

function nextFeast(from = new Date()) {
  const candidates = [...getFeastsForRange(from.getFullYear()), ...getFeastsForRange(from.getFullYear() + 1)]
    .filter((feast) => feast.actualDate >= startOfDay(from))
    .sort((a, b) => a.actualDate - b.actualDate);
  return candidates[0];
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayDiff(a, b) {
  return Math.ceil((startOfDay(a) - startOfDay(b)) / 86400000);
}

function getFastPeriods(year) {
  const pascha = getPascha(year);
  return [
    { name: "Great Lent", start: addDays(pascha, -48), end: addDays(pascha, -8), rule: "strict" },
    { name: "Holy Week", start: addDays(pascha, -7), end: addDays(pascha, -1), rule: "strict" },
    { name: "Apostles Fast", start: addDays(pascha, 57), end: new Date(year, 5, 28), rule: "wineOil" },
    { name: "Dormition Fast", start: new Date(year, 7, 1), end: new Date(year, 7, 14), rule: "strict" },
    { name: "Nativity Fast", start: new Date(year, 10, 15), end: new Date(year, 11, 24), rule: "wineOil" },
  ].filter((period) => period.start <= period.end);
}

function getFeastOnDate(date) {
  return getFeastsForRange(date.getFullYear()).find((feast) => sameDay(feast.actualDate, date));
}

function fastRuleForDate(date) {
  const feast = getFeastOnDate(date);
  const periods = [...getFastPeriods(date.getFullYear() - 1), ...getFastPeriods(date.getFullYear()), ...getFastPeriods(date.getFullYear() + 1)];
  const active = periods.find((period) => startOfDay(date) >= startOfDay(period.start) && startOfDay(date) <= startOfDay(period.end));
  const weekday = date.getDay();

  if (feast?.name === "Pascha" || inBrightWeek(date)) {
    return { title: "Fast-free", detail: "Paschal joy: no fasting restriction.", allowed: allowedFoodSets.none, period: "Bright Week" };
  }

  if (active) {
    const weekend = weekday === 0 || weekday === 6;
    const rule = active.rule === "strict" && weekend ? "wineOil" : active.rule;
    return {
      title: `${active.name}: ${ruleLabel(rule)}`,
      detail: feast ? `${feast.name}. ${feast.description}` : `${active.name} is active for the selected jurisdiction.`,
      allowed: allowedFoodSets[rule],
      period: active.name,
    };
  }

  if (weekday === 3 || weekday === 5) {
    const rule = getProfile().strictness === "traditional" ? "strict" : "wineOil";
    return {
      title: `Weekly Fast: ${ruleLabel(rule)}`,
      detail: weekday === 3 ? "Wednesday fast in remembrance of the betrayal of Christ." : "Friday fast in remembrance of the Cross.",
      allowed: allowedFoodSets[rule],
      period: "Weekly Fast",
    };
  }

  return {
    title: "No fasting restriction",
    detail: feast ? `${feast.name}. ${feast.description}` : "Ordinary day outside a fasting period.",
    allowed: allowedFoodSets.none,
    period: "Ordinary Time",
  };
}

function inBrightWeek(date) {
  const pascha = getPascha(date.getFullYear());
  return startOfDay(date) >= pascha && startOfDay(date) <= addDays(pascha, 6);
}

function ruleLabel(rule) {
  return {
    none: "No fast",
    strict: "Strict fast",
    wineOil: "Wine and oil allowed",
    fish: "Fish allowed",
    dairy: "Dairy allowed",
  }[rule] || "Fast";
}

function setPills(container, items) {
  container.innerHTML = items.map((item) => `<span>${item}</span>`).join("");
}

function renderOverview() {
  const today = new Date();
  const rule = fastRuleForDate(today);
  const feast = nextFeast(today);
  const days = dayDiff(feast.actualDate, today);

  $("#today-label").textContent = formatDate(today, { year: undefined });
  $("#hero-date").textContent = formatDate(today);
  $("#hero-summary").textContent = `${getProfile().label} calendar: ${rule.period}. ${readings[1].citation} is appointed in this preview dataset.`;
  $("#fasting-title").textContent = rule.title;
  $("#fasting-detail").textContent = rule.detail;
  setPills($("#allowed-foods"), rule.allowed);

  $("#countdown-number").textContent = String(days);
  $("#countdown-label").textContent = `${feast.name} on ${formatDate(feast.actualDate, { weekday: undefined, year: undefined })}`;
  $("#rail-feast").textContent = feast.name;
  $("#rail-countdown").textContent = `${days} days`;

  renderReadings("#daily-readings");
  renderQuote();
  renderMetrics();
}

function renderMetrics() {
  const completed = getCompletedLessons().length;
  $("#study-progress").textContent = `${Math.round((completed / lessons.length) * 100)}%`;
  $("#achievement-chip").textContent = completed >= lessons.length ? "Scholar" : completed >= 2 ? "Catechumen" : "Beginner";

  const prayers = getPrayers();
  const prayedCount = prayers.reduce((sum, prayer) => sum + prayer.count, 0);
  $("#prayer-count").textContent = String(prayedCount);

  const plan = readingPlans[state.plan];
  const progress = Number(readStorage(`oc:reading:${state.plan}`, "0"));
  const percent = Math.min(100, Math.round((progress / plan.total) * 100));
  $("#reading-progress").textContent = `${percent}%`;
  $("#reading-plan-label").textContent = plan.label;
  $("#reading-bar").style.width = `${percent}%`;
  $("#reading-status").textContent = `${progress} of ${plan.total} days complete for ${plan.label}.`;
}

function renderReadings(target) {
  $(target).innerHTML = readings
    .map(
      (reading) => `
        <div class="reading-pair">
          <p class="eyebrow">${reading.title}</p>
          <h4>${reading.citation}</h4>
          <p>${reading.text}</p>
        </div>
      `,
    )
    .join("");
}

function renderQuote() {
  const quote = quoteLibrary[state.quoteIndex % quoteLibrary.length];
  $("#quote-text").textContent = quote.text;
  $("#quote-source").textContent = quote.source;
  writeStorage("oc:quote", String(state.quoteIndex));
}

function renderCalendar() {
  const date = state.selectedDate;
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = names.map((name) => `<div class="calendar-head">${name}</div>`);

  for (let i = 0; i < offset; i += 1) {
    cells.push("<div></div>");
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, month, day);
    const rule = fastRuleForDate(current);
    const feast = getFeastOnDate(current);
    const classes = ["calendar-day"];
    if (sameDay(current, new Date())) classes.push("today");
    if (sameDay(current, state.selectedDate)) classes.push("selected");
    if (rule.period !== "Ordinary Time" && rule.period !== "Bright Week") classes.push("fast");
    if (feast) classes.push("feast");

    cells.push(`
      <button class="${classes.join(" ")}" type="button" data-date="${isoDate(current)}">
        <strong>${day}</strong>
        <span>${feast ? feast.name : rule.period}</span>
      </button>
    `);
  }

  $("#calendar-grid").innerHTML = cells.join("");
  $$(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = parseIso(button.dataset.date);
      renderCalendar();
      renderSelectedDay();
    });
  });

  renderSelectedDay();
  renderFastPeriods();
}

function renderSelectedDay() {
  const rule = fastRuleForDate(state.selectedDate);
  $("#selected-day-title").textContent = formatDate(state.selectedDate);
  $("#selected-day-detail").textContent = `${rule.title}. ${rule.detail}`;
  setPills($("#selected-day-foods"), rule.allowed);
}

function renderFastPeriods() {
  const periods = getFastPeriods(new Date().getFullYear());
  $("#fast-periods").innerHTML = periods
    .map(
      (period) => `
        <div class="period-item">
          <h4>${period.name}</h4>
          <p>${formatDate(period.start, { weekday: undefined })} to ${formatDate(period.end, { weekday: undefined })}</p>
          <div class="pill-row"><span>${ruleLabel(period.rule)}</span></div>
        </div>
      `,
    )
    .join("");
}

function renderStudy() {
  const completed = getCompletedLessons();
  $("#lesson-list").innerHTML = lessons
    .map(
      (lesson) => `
        <div class="lesson-item">
          <div>
            <h4>${lesson.title}</h4>
            <p>${lesson.area} · ${lesson.minutes} min</p>
          </div>
          <button class="text-button" type="button" data-lesson="${lesson.id}">
            ${completed.includes(lesson.id) ? "Done" : "Mark"}
          </button>
        </div>
      `,
    )
    .join("");

  $$("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = new Set(getCompletedLessons());
      next.add(button.dataset.lesson);
      writeStorage("oc:lessons", JSON.stringify([...next]));
      renderStudy();
      renderMetrics();
    });
  });

  renderQuiz();
  renderFlashcard();
}

function getCompletedLessons() {
  return JSON.parse(readStorage("oc:lessons", "[]"));
}

function renderQuiz() {
  const index = Number(readStorage("oc:quiz", "0")) % quiz.length;
  const item = quiz[index];
  $("#quiz-area").innerHTML = `
    <p>${item.question}</p>
    ${item.options.map((option) => `<button class="text-button quiz-option" type="button" data-answer="${option}">${option}</button>`).join("")}
    <p id="quiz-feedback" class="source-line"></p>
  `;
  $$(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.answer === item.answer;
      button.classList.add(correct ? "correct" : "incorrect");
      $("#quiz-feedback").textContent = correct ? "Correct" : `Answer: ${item.answer}`;
      if (correct) writeStorage("oc:quiz", String(index + 1));
      setTimeout(renderQuiz, 900);
    });
  });
}

function renderFlashcard() {
  const cards = languageCards[state.language];
  const card = cards[state.flashIndex % cards.length];
  $("#flashcard").innerHTML = state.flashFlipped
    ? `<div><strong>${card.back}</strong><p>${card.front}</p></div>`
    : `<div><strong>${card.front}</strong><p>${state.language === "greek" ? "Liturgical Greek" : "Church Slavonic"}</p></div>`;
}

function renderLibrary() {
  renderIconResults();
  $("#sermon-list").innerHTML = sermons.map((item) => resultItem(item.title, `${item.speaker} · ${item.topic}`, item.length)).join("");
  $("#chant-list").innerHTML = chants.map((item) => resultItem(item.title, `${item.tradition} chant`, item.tone)).join("");
  renderChurches(churches);
  renderLocationStatus();
}

function renderIconResults() {
  const query = $("#icon-search").value.toLowerCase();
  const filtered = icons.filter((icon) => `${icon.name} ${icon.type} ${icon.summary}`.toLowerCase().includes(query));
  $("#icon-results").innerHTML = filtered.map((item) => resultItem(item.name, item.type, item.summary)).join("");
}

function renderChurches(items) {
  $("#church-list").innerHTML = items
    .map(
      (church) => `
        <div class="result-item">
          <h4>${escapeHtml(church.name)}</h4>
          <p>${escapeHtml(church.jurisdiction)} · ${escapeHtml(church.city)}${typeof church.distance === "number" ? ` · approx. ${church.distance.toFixed(1)} km away` : ""}</p>
          <p>${escapeHtml(church.schedule)}</p>
          <div class="button-row">
            <a class="text-button" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.name} ${church.city}`)}">Directions</a>
            <a class="text-button" href="tel:${church.phone.replaceAll(" ", "")}">Call</a>
          </div>
        </div>
      `,
    )
    .join("");
}

function resultItem(title, meta, detail) {
  return `
    <div class="result-item">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(meta)}</p>
      <p>${escapeHtml(detail)}</p>
    </div>
  `;
}

function renderLocationStatus(message) {
  const status = $("#location-status");
  if (!status) return;
  if (message) {
    status.textContent = message;
    return;
  }
  if (state.userPosition) {
    status.textContent = "Location was used once in this page to sort churches by distance. Coordinates were not stored.";
  } else if (consentAllows("location")) {
    status.textContent = "Location consent is on. Click Find Near Me to trigger your browser location prompt.";
  } else {
    status.textContent = "Location is off. Search manually or allow location to sort churches by distance.";
  }
}

function sortChurchesByPosition(position) {
  return churches
    .map((church) => ({
      ...church,
      distance: distanceKm(position.coords.latitude, position.coords.longitude, church.lat, church.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}

function requestChurchLocation() {
  if (!navigator.geolocation) {
    renderLocationStatus("This browser does not support location services. Manual church search still works.");
    return;
  }

  const button = $("#use-location");
  button.disabled = true;
  button.textContent = "Locating";
  renderLocationStatus("Waiting for browser location permission...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      const sorted = sortChurchesByPosition(position);
      renderChurches(sorted);
      renderLocationStatus(`Nearest result: ${sorted[0].name}, approx. ${sorted[0].distance.toFixed(1)} km away. Coordinates were not stored.`);
      button.disabled = false;
      button.textContent = "Refresh Location";
    },
    (error) => {
      const denied = error.code === error.PERMISSION_DENIED;
      renderLocationStatus(denied ? "Browser location permission was denied. Manual search still works." : "Location could not be read. Manual search still works.");
      button.disabled = false;
      button.textContent = "Find Near Me";
    },
    {
      enableHighAccuracy: false,
      maximumAge: 300000,
      timeout: 10000,
    },
  );
}

function openLocationModal() {
  $("#location-modal").hidden = false;
}

function closeLocationModal() {
  $("#location-modal").hidden = true;
}

function getPrayers() {
  const fallback = [
    { id: "p1", name: "Anonymous", text: "For the sick and those who care for them.", count: 12, pending: false },
    { id: "p2", name: "Anonymous", text: "For peace, repentance, and reconciliation.", count: 9, pending: false },
  ];
  return JSON.parse(readStorage("oc:prayers", JSON.stringify(fallback)));
}

function renderPrayers() {
  const prayers = getPrayers();
  $("#prayer-wall").innerHTML = prayers
    .map(
      (prayer) => `
        <div class="result-item">
          <h4>${escapeHtml(prayer.name)}</h4>
          <p>${escapeHtml(prayer.text)}</p>
          <button class="text-button" type="button" data-prayer="${prayer.id}">I prayed · ${prayer.count}</button>
        </div>
      `,
    )
    .join("");

  $$("[data-prayer]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = getPrayers().map((prayer) => (prayer.id === button.dataset.prayer ? { ...prayer, count: prayer.count + 1 } : prayer));
      writeStorage("oc:prayers", JSON.stringify(next));
      renderPrayers();
      renderMetrics();
      renderAdmin();
    });
  });
}

function renderAssistant() {
  $("#source-list").innerHTML = sourceLibrary.map((source) => resultItem(source.title, source.id, source.scope)).join("");
  const history = JSON.parse(readStorage("oc:chat", "[]"));
  if (history.length === 0) {
    history.push({
      role: "assistant",
      text: "Ask a question about fasting, prayer, feasts, Scripture, or Orthodox practice. Answers in this preview are constrained to the approved source library model.",
    });
  }
  $("#chat-log").innerHTML = history.map((message) => `<div class="chat-message ${message.role}"><p>${escapeHtml(message.text)}</p></div>`).join("");
}

function answerQuestion(question) {
  const normalized = question.toLowerCase();
  if (normalized.includes("fast")) {
    return "Fasting is ascetic medicine practiced with prayer, repentance, almsgiving, and guidance from one's priest. Citation model: liturgical calendar, pastoral catechism, and fasting rule endpoint.";
  }
  if (normalized.includes("icon")) {
    return "Icons are venerated, not worshiped. Honor passes to the prototype, which is why iconography belongs to the Church's confession of the Incarnation. Citation model: Seventh Ecumenical Council and catechism library.";
  }
  if (normalized.includes("prayer")) {
    return "Begin simply and consistently: the Trisagion prayers, the Lord's Prayer, Psalm reading, and the Jesus Prayer under pastoral guidance. Citation model: prayer book and patristic source library.";
  }
  if (normalized.includes("pascha") || normalized.includes("easter")) {
    return "Pascha is the feast of feasts, the celebration of Christ's Resurrection and the center of the liturgical year. Citation model: Paschal services and liturgical calendar endpoint.";
  }
  return "This needs a reviewed source match before a confident answer. The production assistant should retrieve approved passages, rank them, answer briefly, and cite every claim.";
}

function renderAdmin() {
  $("#content-queue").innerHTML = contentQueue.map((item) => resultItem(item.title, "Editorial review", item.detail)).join("");
  const prayers = getPrayers();
  $("#moderation-queue").innerHTML = prayers
    .filter((item) => item.pending)
    .map((item) => resultItem(item.name, "Prayer request", item.text))
    .join("") || resultItem("No pending requests", "Moderation", "New submissions are marked pending in the production Firestore workflow.");
  $("#api-health").innerHTML = apiStatus.map((item) => resultItem(item.title, "REST API", item.detail)).join("");
}

function renderReadingsView() {
  renderReadings("#readings-full");
  renderMetrics();
  $("#reading-note").value = readStorage("oc:readingNote", "");
}

const LOCAL_APP_DATA_KEYS = [
  "oc:j",
  "oc:theme",
  "oc:accent",
  "oc:textScale",
  "oc:density",
  "oc:background",
  "oc:motion",
  "oc:quote",
  "oc:lessons",
  "oc:quiz",
  "oc:savedQuotes",
  "oc:bookmarkedReading",
  "oc:plan",
  "oc:reading:new-testament",
  "oc:reading:psalms",
  "oc:reading:gospels",
  "oc:readingNote",
  "oc:prayers",
  "oc:chat",
];

function openConsentModal() {
  const consent = getConsent();
  $("#consent-preferences").checked = Boolean(consent.preferences);
  $("#consent-location").checked = Boolean(consent.location);
  $("#consent-analytics").checked = Boolean(consent.analytics);
  $("#consent-modal").hidden = false;
}

function closeConsentModal() {
  $("#consent-modal").hidden = true;
}

function hideConsentBanner() {
  $("#consent-banner").hidden = true;
}

function renderConsentBanner() {
  const consent = getConsent();
  $("#consent-banner").hidden = Boolean(consent.updatedAt);
}

function applyConsentChoice(nextConsent) {
  const consent = saveConsent(nextConsent);
  hideConsentBanner();
  closeConsentModal();
  if (!consent.location) {
    state.userPosition = null;
    renderChurches(churches);
  }
  renderLocationStatus();
}

function clearLocalAppData() {
  LOCAL_APP_DATA_KEYS.forEach(removeStorage);
  state.jurisdiction = "antiochian";
  Object.assign(state, PERSONALIZATION_DEFAULTS);
  state.quoteIndex = 0;
  state.plan = "new-testament";
  state.userPosition = null;
  $("#jurisdiction-select").value = state.jurisdiction;
  applyPersonalization();
  renderAll();
}

function resetConsent() {
  removeStorage(CONSENT_KEY);
  clearConsentCookie();
  state.userPosition = null;
  renderChurches(churches);
  renderLocationStatus();
  renderConsentBanner();
}

function initEvents() {
  $("#jurisdiction-select").value = state.jurisdiction;
  $("#jurisdiction-select").addEventListener("change", (event) => {
    state.jurisdiction = event.target.value;
    writeStorage("oc:j", state.jurisdiction);
    renderAll();
  });

  $("#theme-toggle").addEventListener("click", () => {
    state.theme = effectiveTheme() === "light" ? "dark" : "light";
    writeStorage("oc:theme", state.theme);
    applyPersonalization();
    renderSettings();
  });

  $("#new-quote").addEventListener("click", () => {
    state.quoteIndex = (state.quoteIndex + 1) % quoteLibrary.length;
    renderQuote();
  });

  $("#save-quote").addEventListener("click", () => {
    const quote = quoteLibrary[state.quoteIndex % quoteLibrary.length];
    const saved = JSON.parse(readStorage("oc:savedQuotes", "[]"));
    writeStorage("oc:savedQuotes", JSON.stringify([...saved, quote]));
  });

  $("#share-quote").addEventListener("click", async () => {
    const quote = quoteLibrary[state.quoteIndex % quoteLibrary.length];
    const text = `${quote.text} — ${quote.source}`;
    if (navigator.share) {
      await navigator.share({ title: "Orthodox Companion Quote", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  });

  $("#bookmark-reading").addEventListener("click", () => {
    writeStorage("oc:bookmarkedReading", JSON.stringify(readings));
  });

  $("#speak-reading").addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(readings.map((reading) => `${reading.title}. ${reading.citation}. ${reading.text}`).join(" "));
    speechSynthesis.speak(utterance);
  });

  $("#mark-reading").addEventListener("click", () => {
    const plan = readingPlans[state.plan];
    const key = `oc:reading:${state.plan}`;
    const current = Number(readStorage(key, "0"));
    writeStorage(key, String(Math.min(plan.total, current + 1)));
    renderReadingsView();
    renderMetrics();
  });

  $$("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      state.plan = button.dataset.plan;
      writeStorage("oc:plan", state.plan);
      renderReadingsView();
    });
  });

  $("#reading-note").addEventListener("input", (event) => {
    writeStorage("oc:readingNote", event.target.value);
  });

  $$("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-language]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.language = button.dataset.language;
      state.flashIndex = 0;
      state.flashFlipped = false;
      renderFlashcard();
    });
  });

  $("#flip-card").addEventListener("click", () => {
    state.flashFlipped = !state.flashFlipped;
    renderFlashcard();
  });

  $("#next-card").addEventListener("click", () => {
    state.flashIndex += 1;
    state.flashFlipped = false;
    renderFlashcard();
  });

  $("#speak-card").addEventListener("click", () => {
    const card = languageCards[state.language][state.flashIndex % languageCards[state.language].length];
    speechSynthesis.speak(new SpeechSynthesisUtterance(card.front));
  });

  $("#icon-search").addEventListener("input", renderIconResults);
  $("#church-search").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    renderChurches(churches.filter((church) => `${church.name} ${church.city} ${church.jurisdiction}`.toLowerCase().includes(query)));
  });

  $("#use-location").addEventListener("click", () => {
    if (consentAllows("location")) {
      requestChurchLocation();
    } else {
      openLocationModal();
    }
  });

  $("#prayer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = $("#prayer-text").value.trim();
    if (!text) return;
    const prayers = getPrayers();
    prayers.unshift({
      id: `p${Date.now()}`,
      name: $("#prayer-anonymous").checked ? "Anonymous" : $("#prayer-name").value.trim() || "Anonymous",
      text,
      count: 0,
      pending: true,
    });
    writeStorage("oc:prayers", JSON.stringify(prayers));
    event.target.reset();
    $("#prayer-anonymous").checked = true;
    renderPrayers();
    renderAdmin();
  });

  $("#assistant-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const question = $("#assistant-input").value.trim();
    if (!question) return;
    const history = JSON.parse(readStorage("oc:chat", "[]"));
    history.push({ role: "user", text: question });
    history.push({ role: "assistant", text: answerQuestion(question) });
    writeStorage("oc:chat", JSON.stringify(history.slice(-16)));
    $("#assistant-input").value = "";
    renderAssistant();
  });

  $("#global-search").addEventListener("input", renderGlobalSearch);

  $$("[data-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      updateSetting(button.dataset.setting, button.dataset.value);
    });
  });

  $("#reduce-motion-toggle").addEventListener("change", (event) => {
    updateSetting("motion", event.target.checked ? "reduced" : "normal");
  });

  $("#reset-personalization").addEventListener("click", resetPersonalization);

  const systemThemeQuery = window.matchMedia?.("(prefers-color-scheme: light)");
  const handleSystemThemeChange = () => {
    if (state.theme === "system") {
      applyPersonalization();
      renderSettings();
    }
  };
  if (systemThemeQuery?.addEventListener) {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (systemThemeQuery?.addListener) {
    systemThemeQuery.addListener(handleSystemThemeChange);
  }

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      $$(".nav-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  $$("[data-calendar-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-calendar-mode]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.calendarMode = button.dataset.calendarMode;
      renderCalendar();
    });
  });

  $("#consent-accept").addEventListener("click", () => {
    applyConsentChoice({ preferences: true, location: true, analytics: true });
  });

  $("#consent-reject").addEventListener("click", () => {
    applyConsentChoice({ preferences: false, location: false, analytics: false });
  });

  $("#consent-customize").addEventListener("click", openConsentModal);
  $("#open-consent-settings").addEventListener("click", openConsentModal);
  $("#footer-consent-settings").addEventListener("click", openConsentModal);
  $("#close-consent-modal").addEventListener("click", closeConsentModal);

  $("#consent-save").addEventListener("click", () => {
    applyConsentChoice({
      preferences: $("#consent-preferences").checked,
      location: $("#consent-location").checked,
      analytics: $("#consent-analytics").checked,
    });
  });

  $("#consent-save-essential").addEventListener("click", () => {
    applyConsentChoice({ preferences: false, location: false, analytics: false });
  });

  $("#clear-local-data").addEventListener("click", clearLocalAppData);
  $("#reset-consent").addEventListener("click", resetConsent);

  $("#close-location-modal").addEventListener("click", closeLocationModal);
  $("#deny-location").addEventListener("click", () => {
    closeLocationModal();
    renderLocationStatus("Location was not enabled. Manual church search still works.");
  });
  $("#allow-location").addEventListener("click", () => {
    const consent = getConsent();
    applyConsentChoice({ ...consent, location: true });
    closeLocationModal();
    requestChurchLocation();
  });
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderGlobalSearch() {
  const query = $("#global-search").value.trim().toLowerCase();
  const box = $("#search-results");
  if (!query) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }

  const haystack = [
    ...feastData.map((item) => ({ title: item.name, meta: "Feast", detail: item.description, href: "#calendar" })),
    ...quoteLibrary.map((item) => ({ title: item.source, meta: "Quote", detail: item.text, href: "#overview" })),
    ...icons.map((item) => ({ title: item.name, meta: item.type, detail: item.summary, href: "#library" })),
    ...lessons.map((item) => ({ title: item.title, meta: item.area, detail: `${item.minutes} min`, href: "#study" })),
    ...churches.map((item) => ({ title: item.name, meta: item.jurisdiction, detail: item.city, href: "#library" })),
  ];

  const results = haystack.filter((item) => `${item.title} ${item.meta} ${item.detail}`.toLowerCase().includes(query)).slice(0, 8);
  box.hidden = false;
  box.innerHTML = results.length
    ? results
        .map(
          (item) =>
            `<a class="result-item" href="${item.href}"><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.meta)}</p><p>${escapeHtml(item.detail)}</p></a>`,
        )
        .join("")
      : `<div class="result-item"><h4>No results</h4><p>Try a feast, saint, church, topic, or reading.</p></div>`;
}

function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function effectiveTheme() {
  return state.theme === "system" ? getSystemTheme() : state.theme;
}

function applyTheme() {
  const resolvedTheme = effectiveTheme();
  document.body.classList.toggle("light", resolvedTheme === "light");
  document.body.dataset.theme = state.theme;
  document.body.dataset.resolvedTheme = resolvedTheme;
}

function applyPersonalization() {
  document.body.dataset.accent = state.accent;
  document.body.dataset.text = state.textScale;
  document.body.dataset.density = state.density;
  document.body.dataset.background = state.background;
  document.body.classList.toggle("reduce-motion", state.motion === "reduced");
  applyTheme();
}

function renderSettings() {
  const previewTitle = $("#settings-preview-title");
  const previewCopy = $("#settings-preview-copy");
  if (!previewTitle || !previewCopy) return;

  $$("[data-setting]").forEach((button) => {
    const isActive = state[button.dataset.setting] === button.dataset.value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  $("#reduce-motion-toggle").checked = state.motion === "reduced";

  const accent = PERSONALIZATION_COPY.accent[state.accent] || PERSONALIZATION_COPY.accent.gold;
  const themeLabel = state.theme === "system" ? `System ${PERSONALIZATION_COPY.theme[effectiveTheme()]}` : PERSONALIZATION_COPY.theme[state.theme];
  const motionLabel = state.motion === "reduced" ? "quiet motion" : "gentle motion";
  previewTitle.textContent = `${accent.label} ${themeLabel}`;
  previewCopy.textContent = `${accent.copy} Uses ${PERSONALIZATION_COPY.textScale[state.textScale]}, ${PERSONALIZATION_COPY.density[state.density]}, ${PERSONALIZATION_COPY.background[state.background]}, and ${motionLabel}.`;
}

function updateSetting(setting, value) {
  if (!PERSONALIZATION_OPTIONS[setting]?.includes(value)) return;
  state[setting] = value;
  writeStorage(PERSONALIZATION_STORAGE_KEYS[setting], value);
  applyPersonalization();
  renderSettings();
}

function resetPersonalization() {
  Object.entries(PERSONALIZATION_DEFAULTS).forEach(([setting, value]) => {
    state[setting] = value;
    writeStorage(PERSONALIZATION_STORAGE_KEYS[setting], value);
  });
  applyPersonalization();
  renderSettings();
}

function renderAll() {
  renderOverview();
  renderCalendar();
  renderReadingsView();
  renderStudy();
  renderLibrary();
  renderPrayers();
  renderAssistant();
  renderAdmin();
  renderSettings();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

applyPersonalization();
initEvents();
renderConsentBanner();
renderAll();
registerServiceWorker();
