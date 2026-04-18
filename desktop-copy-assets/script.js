const state = {
  bootstrapData: null,
  selectedOffering: null,
  currentTransaction: null,
  paymentMode: "WEB",
  galleryIndex: 0,
  galleryScale: 1,
  receipt: null,
  upiLink: "",
  isOfflineMode: false,
};

const storageKey = "bhairavaguttaPendingPayment";
const ui = {};
const bootstrapUI = window.bootstrap || {
  Modal: class {
    show() {}
    hide() {}
  },
  Toast: class {
    show() {}
    hide() {}
  },
};

const LOCAL_ASSET_ROOT = "./Bhairavagutta Temple_files";
const FALLBACK_GALLERY = [
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-8.jpg`,
    title: "Golden Steps to the Sacred Hill",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-1.jpg`,
    title: "Temple Entrance Through Sacred Greens",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-5.jpg`,
    title: "Sanctum Approach Beneath the Sacred Boulder",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-2.jpg`,
    title: "Bhairava Gutta Rock Formations",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-3.jpg`,
    title: "Passage Into the Sacred Stone Path",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-4.jpg`,
    title: "Inner Rock Corridor",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-6.jpg`,
    title: "Stone Passage Beside the Sannidhi",
  },
  {
    src: `${LOCAL_ASSET_ROOT}/bhairavagutta-7.jpg`,
    title: "Sacred Stone Passage and Water Flow",
  },
];

const FALLBACK_SPECIAL_DAYS_BY_YEAR = {
  2026: [
    { date: "2026-01-11", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Sunday", sunrise: "06:50 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Margashira", masaNameTelugu: "Margashira" },
    { date: "2026-02-09", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Monday", sunrise: "06:47 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Pushya", masaNameTelugu: "Pushya" },
    { date: "2026-02-10", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Tuesday", sunrise: "06:46 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Pushya", masaNameTelugu: "Pushya" },
    { date: "2026-03-11", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Wednesday", sunrise: "06:28 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Magha", masaNameTelugu: "Magha" },
    { date: "2026-04-10", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Friday", sunrise: "06:04 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Phalguna", masaNameTelugu: "Phalguna" },
    { date: "2026-05-10", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Sunday", sunrise: "05:46 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Chaitra", masaNameTelugu: "Chaitra" },
    { date: "2026-05-16", title: "Shani Amavasya", tag: "Shani Amavasya", description: "Saturday when Amavasya tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "05:44 AM", tithiNameEnglish: "Amavasya", tithiNameTelugu: "Amavasya", masaNameEnglish: "Vaishakha", masaNameTelugu: "Vaishakha" },
    { date: "2026-06-08", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Monday", sunrise: "05:41 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Vaishakha", masaNameTelugu: "Vaishakha" },
    { date: "2026-06-13", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "05:42 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Vaishakha", masaNameTelugu: "Vaishakha" },
    { date: "2026-06-27", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "05:44 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Jyeshtha", masaNameTelugu: "Jyeshtha" },
    { date: "2026-07-08", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Wednesday", sunrise: "05:47 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Jyeshtha", masaNameTelugu: "Jyeshtha" },
    { date: "2026-08-06", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Thursday", sunrise: "05:57 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Ashadha", masaNameTelugu: "Ashadha" },
    { date: "2026-09-04", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Friday", sunrise: "06:03 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Shravana", masaNameTelugu: "Shravana" },
    { date: "2026-10-03", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Saturday", sunrise: "06:07 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Bhadrapada", masaNameTelugu: "Bhadrapada" },
    { date: "2026-10-10", title: "Shani Amavasya", tag: "Shani Amavasya", description: "Saturday when Amavasya tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:08 AM", tithiNameEnglish: "Amavasya", tithiNameTelugu: "Amavasya", masaNameEnglish: "Bhadrapada", masaNameTelugu: "Bhadrapada" },
    { date: "2026-10-24", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:12 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Ashwayuja", masaNameTelugu: "Ashwayuja" },
    { date: "2026-11-02", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Monday", sunrise: "06:16 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Ashwayuja", masaNameTelugu: "Ashwayuja" },
    { date: "2026-11-07", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:18 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Ashwayuja", masaNameTelugu: "Ashwayuja" },
    { date: "2026-12-01", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Tuesday", sunrise: "06:31 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Kartika", masaNameTelugu: "Kartika" },
    { date: "2026-12-31", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Thursday", sunrise: "06:47 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Margashira", masaNameTelugu: "Margashira" },
  ],
  2027: [
    { date: "2027-01-29", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Friday", sunrise: "06:50 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Pushya", masaNameTelugu: "Pushya" },
    { date: "2027-02-06", title: "Shani Amavasya", tag: "Shani Amavasya", description: "Saturday when Amavasya tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:48 AM", tithiNameEnglish: "Amavasya", tithiNameTelugu: "Amavasya", masaNameEnglish: "Pushya", masaNameTelugu: "Pushya" },
    { date: "2027-02-28", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Sunday", sunrise: "06:37 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Magha", masaNameTelugu: "Magha" },
    { date: "2027-03-06", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:32 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Magha", masaNameTelugu: "Magha" },
    { date: "2027-03-20", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:21 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Phalguna", masaNameTelugu: "Phalguna" },
    { date: "2027-03-30", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Tuesday", sunrise: "06:13 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Phalguna", masaNameTelugu: "Phalguna" },
    { date: "2027-04-29", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Thursday", sunrise: "05:52 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Chaitra", masaNameTelugu: "Chaitra" },
    { date: "2027-05-29", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Saturday", sunrise: "05:42 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Vaishakha", masaNameTelugu: "Vaishakha" },
    { date: "2027-06-27", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Sunday", sunrise: "05:44 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Jyeshtha", masaNameTelugu: "Jyeshtha" },
    { date: "2027-07-27", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Tuesday", sunrise: "05:54 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Ashadha", masaNameTelugu: "Ashadha" },
    { date: "2027-07-31", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "05:55 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Ashadha", masaNameTelugu: "Ashadha" },
    { date: "2027-08-14", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "05:59 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Ashadha", masaNameTelugu: "Ashadha" },
    { date: "2027-08-25", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Wednesday", sunrise: "06:01 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Shravana", masaNameTelugu: "Shravana" },
    { date: "2027-09-23", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Thursday", sunrise: "06:06 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Bhadrapada", masaNameTelugu: "Bhadrapada" },
    { date: "2027-10-23", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Saturday", sunrise: "06:12 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Ashwayuja", masaNameTelugu: "Ashwayuja" },
    { date: "2027-11-21", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Sunday", sunrise: "06:25 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Kartika", masaNameTelugu: "Kartika" },
    { date: "2027-12-11", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:37 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Kartika", masaNameTelugu: "Kartika" },
    { date: "2027-12-20", title: "Sri Maha Kala Bhairava Ashtami", tag: "Bhairava Ashtami", description: "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.", weekdayNameEnglish: "Monday", sunrise: "06:42 AM", tithiNameEnglish: "Ashtami", tithiNameTelugu: "Ashtami", masaNameEnglish: "Margashira", masaNameTelugu: "Margashira" },
    { date: "2027-12-25", title: "Shani Trayodashi", tag: "Shani Trayodashi", description: "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.", weekdayNameEnglish: "Saturday", sunrise: "06:44 AM", tithiNameEnglish: "Trayodasi", tithiNameTelugu: "Trayodasi", masaNameEnglish: "Margashira", masaNameTelugu: "Margashira" },
  ],
};

function getFallbackBootstrapData() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const allSpecialDays = [
    ...(FALLBACK_SPECIAL_DAYS_BY_YEAR[currentYear] || []),
    ...(FALLBACK_SPECIAL_DAYS_BY_YEAR[nextYear] || []),
  ];
  const today = new Date().toISOString().slice(0, 10);

  return {
    temple: {
      name: "Bhairavagutta",
      title: "Sri Maha Kala Bhairava & Abhaya Shaneeswara Kshetram",
      owner: "Sri. M. Kalyana Ramakrishna, Advocate",
      address:
        "JGQG+QPX, Bhairava Gutta, Ravalkole Village, Medchal Mandal, R.R.dist., Ghanpur, 501401",
      mapUrl: "https://maps.app.goo.gl/SzEE4xt5XNBfVZk7A",
      whatsappUrl: "https://wa.me/919121590590",
      facebookUrl: "https://www.facebook.com/share/1H2yQsTDvU/",
      youtubeUrl: "https://youtube.com/@divyaanugraham-qh6wq?si=mp1m71HulGW6d7QS",
      about: [
        "Sri Maha Kala Bhairava Swamy is Swayambhu on a sacred rock under the Banyan tree, and the hill rock itself is revered in Shiva Linga aakara. Local tradition says Bhairava Gutta has been known for more than 300 years.",
        "Sri. M. Kalyana Ramakrishna and family installed the 6-foot Abhaya Shaneeswara Swamy deity on 27-02-2003. The first Tailabhishekam was performed on 01-03-2003, on a rare and highly sacred combination day linked to Shani Trayodashi and Maha Shiva Ratri.",
        "The temple land is also a mini forest of sacred and medicinal plants with more than 10,000 plants nurtured by the owner, creating a calm, high-energy, pollution-free devotional environment.",
      ],
      deities: [
        {
          name: "Sri Abhaya Shaneeswara Swamy",
          description:
            "Disciple of Sri Maha Kala Bhairava who has come to his Guru at Bhairava Gutta.",
        },
        {
          name: "Sri Maha Kala Bhairava Swamy",
          description:
            "Swayambhu manifestation on the sacred rock beneath the Banyan tree.",
        },
        {
          name: "Sri Vinayaka Swamy",
          description:
            "Installed at the kshetram for auspicious beginnings and devotional blessings.",
        },
        {
          name: "Sri Nagendra Swamy",
          description: "Installed deity representing serpent divinity and sacred protection.",
        },
      ],
      sacredPlants: [
        "Rudraksha",
        "Naga Lingam",
        "Srigandham",
        "Nagamalli",
        "Tani",
        "Krishna Marri",
        "Maredu",
        "Banda Nuvvu",
        "Jammi",
        "Ravi",
        "Vepa",
      ],
    },
    offerings: [
      { code: "TILA_TAILABHISHEKAM", name: "Thila Thailabhishekam to Shaneeswara Swamy", amount: 200, type: "Pooja", description: "Sacred oil abhishekam seva for Sri Abhaya Shaneeswara Swamy." },
      { code: "KALA_BHAIRAVA_ABHISHEKAM", name: "Abhishekam to Kala Bhairava Swamy", amount: 300, type: "Pooja", description: "Abhishekam seva offered to Sri Maha Kala Bhairava Swamy." },
      { code: "KUSHMANDA_DEEPA_SEVA", name: "Kushmanda Deepa Seva", amount: 500, type: "Pooja", description: "Deepa seva offered with spiritual sankalpam." },
      { code: "HOMAM", name: "Homam", amount: 10116, type: "Pooja", description: "Homam seva performed with temple sankalpam." },
      { code: "ABHISHEKAM_SET", name: "Abhishekam Set", amount: 400, type: "Pooja Set", description: "Temple-prepared abhishekam material set." },
      { code: "KOOSHMANDA_DEEPAM_SET", name: "Kooshmanda Deepam Set", amount: 300, type: "Pooja Set", description: "Deepam set for Kushmanda seva." },
    ],
    gallery: FALLBACK_GALLERY,
    formOptions: {
      gothrams: ["Kashyapa", "Bharadwaja", "Vashishta", "Atri", "Gautama", "Harita", "Srivatsa", "Koundinya", "Agastya", "Others"],
      nakshatrams: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
      raashis: ["Mesha", "Vrishabha", "Mithuna", "Karkataka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanussu", "Makara", "Kumbha", "Meena"],
      padams: [1, 2, 3, 4],
    },
    specialDays: allSpecialDays.filter((day) => day.date >= today).slice(0, 12),
    payment: {
      payeeName: "Bhairavagutta Temple",
      upiConfigured: false,
    },
  };
}

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
  cacheDom();
  wireEvents();
  await loadBootstrapData();
  restorePendingPaymentMessage();
}

function cacheDom() {
  ui.heroTitle = document.getElementById("heroTitle");
  ui.heroAddress = document.getElementById("heroAddress");
  ui.heroPrimaryImage = document.getElementById("heroPrimaryImage");
  ui.heroSecondaryImage = document.getElementById("heroSecondaryImage");
  ui.heroTertiaryImage = document.getElementById("heroTertiaryImage");
  ui.contactTempleName = document.getElementById("contactTempleName");
  ui.contactAddress = document.getElementById("contactAddress");
  ui.aboutCopy = document.getElementById("aboutCopy");
  ui.sacredPlants = document.getElementById("sacredPlants");
  ui.deityGrid = document.getElementById("deityGrid");
  ui.quickHighlights = document.getElementById("quickHighlights");
  ui.nextSpecialDayCard = document.getElementById("nextSpecialDayCard");
  ui.offeringsGrid = document.getElementById("offeringsGrid");
  ui.galleryGrid = document.getElementById("galleryGrid");
  ui.specialDaysList = document.getElementById("specialDaysList");
  ui.specialDayYear = document.getElementById("specialDayYear");
  ui.gothram = document.getElementById("gothram");
  ui.customGothramWrap = document.getElementById("customGothramWrap");
  ui.customGothram = document.getElementById("customGothram");
  ui.nakshatram = document.getElementById("nakshatram");
  ui.raashi = document.getElementById("raashi");
  ui.bookingForm = document.getElementById("bookingForm");
  ui.selectedOfferingTitle = document.getElementById("selectedOfferingTitle");
  ui.selectedOfferingAmount = document.getElementById("selectedOfferingAmount");
  ui.proceedButton = document.getElementById("proceedButton");
  ui.paymentOfferingTitle = document.getElementById("paymentOfferingTitle");
  ui.paymentOfferingMeta = document.getElementById("paymentOfferingMeta");
  ui.paymentQrImage = document.getElementById("paymentQrImage");
  ui.paymentModeBadge = document.getElementById("paymentModeBadge");
  ui.paymentInstructions = document.getElementById("paymentInstructions");
  ui.openGpayButton = document.getElementById("openGpayButton");
  ui.copyUpiButton = document.getElementById("copyUpiButton");
  ui.internalTransactionId = document.getElementById("internalTransactionId");
  ui.confirmPaymentButton = document.getElementById("confirmPaymentButton");
  ui.upiTransactionId = document.getElementById("upiTransactionId");
  ui.approvalReferenceNo = document.getElementById("approvalReferenceNo");
  ui.receiptContent = document.getElementById("receiptContent");
  ui.printReceiptButton = document.getElementById("printReceiptButton");
  ui.galleryStage = document.getElementById("galleryStage");
  ui.galleryStageImage = document.getElementById("galleryStageImage");
  ui.galleryCaption = document.getElementById("galleryCaption");
  ui.galleryPrevButton = document.getElementById("galleryPrevButton");
  ui.galleryNextButton = document.getElementById("galleryNextButton");
  ui.zoomInButton = document.getElementById("zoomInButton");
  ui.zoomOutButton = document.getElementById("zoomOutButton");
  ui.resetZoomButton = document.getElementById("resetZoomButton");
  ui.toastElement = document.getElementById("appToast");
  ui.toastBody = ui.toastElement.querySelector(".toast-body");
  ui.mapLink = document.getElementById("mapLink");
  ui.whatsAppLink = document.getElementById("whatsAppLink");
  ui.youtubeLink = document.getElementById("youtubeLink");
  ui.contactMapLink = document.getElementById("contactMapLink");
  ui.contactWhatsAppLink = document.getElementById("contactWhatsAppLink");
  ui.facebookLink = document.getElementById("facebookLink");
  ui.ownerText = document.getElementById("ownerText");

  ui.bookingModal = new bootstrapUI.Modal(document.getElementById("bookingModal"));
  ui.paymentActionModal = new bootstrapUI.Modal(
    document.getElementById("paymentActionModal")
  );
  ui.receiptModal = new bootstrapUI.Modal(document.getElementById("receiptModal"));
  ui.galleryModal = new bootstrapUI.Modal(document.getElementById("galleryModal"));
  ui.toast = new bootstrapUI.Toast(ui.toastElement, { delay: 3500 });
}

function wireEvents() {
  ui.bookingForm.addEventListener("submit", onBookingSubmit);
  ui.gothram.addEventListener("change", onGothramChange);
  ui.openGpayButton.addEventListener("click", openGooglePayLink);
  ui.copyUpiButton.addEventListener("click", copyUpiLink);
  ui.confirmPaymentButton.addEventListener("click", confirmPayment);
  ui.printReceiptButton.addEventListener("click", printReceipt);
  ui.specialDayYear.addEventListener("change", onSpecialDayYearChange);
  ui.galleryPrevButton.addEventListener("click", () => stepGallery(-1));
  ui.galleryNextButton.addEventListener("click", () => stepGallery(1));
  ui.zoomInButton.addEventListener("click", () => adjustGalleryZoom(0.2));
  ui.zoomOutButton.addEventListener("click", () => adjustGalleryZoom(-0.2));
  ui.resetZoomButton.addEventListener("click", resetGalleryZoom);
  ui.galleryStage.addEventListener("wheel", onGalleryWheel, { passive: false });
  document.addEventListener("keydown", onGalleryKeydown);
  document
    .getElementById("bookingModal")
    .addEventListener("hidden.bs.modal", resetBookingForm);
}

async function loadBootstrapData() {
  let data;

  try {
    data = await apiFetch("api/bootstrap");
    state.isOfflineMode = false;
  } catch (error) {
    data = getFallbackBootstrapData();
    state.isOfflineMode = true;
    showToast(
      "Loaded premium standalone temple preview with local content and original gallery photos."
    );
  }

  state.bootstrapData = data;
  renderTempleProfile(data.temple);
  renderHeroGalleryTeasers(data.gallery);
  renderHighlights();
  renderDeities(data.temple.deities);
  renderPlants(data.temple.sacredPlants);
  renderOfferings(data.offerings);
  renderGallery(data.gallery);
  populateFormOptions(data.formOptions);
  populateYearOptions();
  renderNextSpecialDay(data.specialDays[0]);
  await renderSpecialDaysForYear(Number(ui.specialDayYear.value));
}

function renderTempleProfile(temple) {
  ui.heroTitle.textContent = temple.title;
  ui.heroAddress.textContent = temple.address;
  ui.contactTempleName.textContent = temple.title;
  ui.contactAddress.textContent = temple.address;
  ui.ownerText.textContent = `${temple.owner}. The temple land is maintained as a sacred private devotional space.`;
  ui.aboutCopy.innerHTML = temple.about.map((paragraph) => `<p>${paragraph}</p>`).join("");

  [ui.mapLink, ui.contactMapLink].forEach((element) => {
    element.href = temple.mapUrl;
  });
  [ui.whatsAppLink, ui.contactWhatsAppLink].forEach((element) => {
    element.href = temple.whatsappUrl;
  });
  ui.youtubeLink.href = temple.youtubeUrl;
  ui.facebookLink.href = temple.facebookUrl;
}

function renderHeroGalleryTeasers(gallery) {
  const images = [gallery[0], gallery[1] || gallery[0], gallery[2] || gallery[0]];
  const targets = [ui.heroPrimaryImage, ui.heroSecondaryImage, ui.heroTertiaryImage];

  targets.forEach((target, index) => {
    if (!target || !images[index]) {
      return;
    }

    target.src = images[index].src;
    target.alt = images[index].title;
  });
}

function renderHighlights() {
  const cards = [
    { value: "300+ Years", label: "Bhairava Gutta remembered in local sacred tradition" },
    { value: "Swayambhu", label: "Sri Maha Kala Bhairava on the consecrated rock form" },
    { value: "10,000+", label: "Sacred and medicinal plants creating a mini forest" },
    { value: "Sunrise Tithi", label: "Special observances aligned to Telugu Panchang" },
  ];

  ui.quickHighlights.innerHTML = cards
    .map(
      (card) => `
        <article class="highlight-chip">
          <strong>${card.value}</strong>
          <span>${card.label}</span>
        </article>
      `
    )
    .join("");
}

function renderDeities(deities) {
  ui.deityGrid.innerHTML = deities
    .map(
      (deity) => `
        <div class="col-md-6 col-xl-3">
          <article class="deity-card">
            <p class="panel-cap">Deity</p>
            <h3>${deity.name}</h3>
            <p class="mb-0">${deity.description}</p>
          </article>
        </div>
      `
    )
    .join("");
}

function renderPlants(plants) {
  ui.sacredPlants.innerHTML = plants
    .map((plant) => `<span class="plant-chip">${plant}</span>`)
    .join("");
}

function renderOfferings(offerings) {
  ui.offeringsGrid.innerHTML = offerings
    .map(
      (offering) => `
        <div class="col-md-6 col-xl-4">
          <article class="offering-card">
            <div>
              <span class="offering-type">${offering.type}</span>
              <h3>${offering.name}</h3>
              <p>${offering.description}</p>
            </div>
            <div>
              <div class="price">Rs. ${Number(offering.amount).toFixed(2)}</div>
              <p class="subtle-copy mt-2 mb-0">Devotee details + UPI payment receipt flow</p>
              <button
                type="button"
                class="btn btn-temple-primary w-100 mt-3 offering-book-button"
                data-offering-code="${offering.code}"
              >
                Offer Seva
              </button>
            </div>
          </article>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".offering-book-button").forEach((button) => {
    button.addEventListener("click", () => openBooking(button.dataset.offeringCode));
  });
}

function renderGallery(gallery) {
  ui.galleryGrid.innerHTML = gallery
    .map(
      (image, index) => `
        <button
          type="button"
          class="gallery-card border-0"
          data-gallery-index="${index}"
          aria-label="Open ${image.title}"
        >
          <img src="${image.src}" alt="${image.title}" />
          <div class="caption">
            <strong>${image.title}</strong>
            <span>Open immersive full-screen darshan</span>
          </div>
        </button>
      `
    )
    .join("");

  document.querySelectorAll("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => openGallery(Number(button.dataset.galleryIndex)));
  });
}

function populateFormOptions(formOptions) {
  ui.gothram.innerHTML = buildSelectOptions("Select gothram", formOptions.gothrams);
  ui.nakshatram.innerHTML = buildSelectOptions(
    "Select nakshatram",
    formOptions.nakshatrams
  );
  ui.raashi.innerHTML = buildSelectOptions("Select raashi", formOptions.raashis);
}

function buildSelectOptions(placeholder, values) {
  return [`<option value="">${placeholder}</option>`]
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function populateYearOptions() {
  const years = state.isOfflineMode
    ? Object.keys(FALLBACK_SPECIAL_DAYS_BY_YEAR).map(Number)
    : [new Date().getFullYear(), new Date().getFullYear() + 1];
  ui.specialDayYear.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
}

async function onSpecialDayYearChange() {
  await renderSpecialDaysForYear(Number(ui.specialDayYear.value));
}

async function renderSpecialDaysForYear(year) {
  try {
    const specialDays = state.isOfflineMode
      ? FALLBACK_SPECIAL_DAYS_BY_YEAR[year] || []
      : (await apiFetch(`api/special-days?year=${year}`)).specialDays;

    if (!specialDays.length) {
      ui.specialDaysList.innerHTML = `
        <div class="col-12">
          <article class="special-day-card">
            <span class="tag">Panchang</span>
            <h3>No special days available</h3>
            <p class="mb-0">Open the site through the local server to load live Panchang data for this year.</p>
          </article>
        </div>
      `;
      return;
    }

    ui.specialDaysList.innerHTML = specialDays
      .map(
        (day) => `
          <div class="col-md-6 col-xl-4">
            <article class="special-day-card h-100">
              <span class="tag">${day.tag}</span>
              <h3>${day.title}</h3>
              <p>${day.description}</p>
              <div class="special-day-meta">
                <div><strong>Date:</strong> ${formatDate(day.date)} (${day.weekdayNameEnglish})</div>
                <div><strong>Sunrise:</strong> ${day.sunrise}</div>
                <div><strong>Tithi:</strong> ${day.tithiNameEnglish} (${day.tithiNameTelugu})</div>
                <div><strong>Masa:</strong> ${day.masaNameEnglish} (${day.masaNameTelugu})</div>
              </div>
            </article>
          </div>
        `
      )
      .join("");
  } catch (error) {
    showToast(error.message || "Unable to load special days.");
  }
}

function renderNextSpecialDay(day) {
  if (!day) {
    ui.nextSpecialDayCard.innerHTML = "<p>No special day data available right now.</p>";
    return;
  }

  ui.nextSpecialDayCard.innerHTML = `
    <span class="tag">${day.tag}</span>
    <strong>${day.title}</strong>
    <p class="next-day-date">${formatDate(day.date)}</p>
    <p class="subtle-copy mb-2">${day.weekdayNameEnglish} | ${day.tithiNameEnglish} | ${day.sunrise}</p>
    <p class="subtle-copy mb-0">${day.description}</p>
  `;
}

function openBooking(offeringCode) {
  const offering = state.bootstrapData.offerings.find((item) => item.code === offeringCode);
  if (!offering) {
    showToast("Offering not found.");
    return;
  }

  state.selectedOffering = offering;
  ui.selectedOfferingTitle.textContent = offering.name;
  ui.selectedOfferingAmount.textContent = `${offering.type} | Rs. ${Number(offering.amount).toFixed(
    2
  )}`;
  ui.bookingModal.show();
}

function onGothramChange(event) {
  const isOthers = event.target.value === "Others";
  ui.customGothramWrap.classList.toggle("d-none", !isOthers);
  ui.customGothram.required = isOthers;
  if (!isOthers) {
    ui.customGothram.value = "";
  }
}

async function onBookingSubmit(event) {
  event.preventDefault();

  if (!state.selectedOffering) {
    showToast("Please select a seva first.");
    return;
  }

  if (state.isOfflineMode) {
    showToast(
      "Live transaction capture requires the local server and database. This standalone page is a premium preview."
    );
    return;
  }

  const formData = new FormData(ui.bookingForm);
  const devotee = Object.fromEntries(formData.entries());
  const channel = isMobileDevice() ? "MOBILE" : "WEB";
  state.paymentMode = channel;

  setButtonLoading(ui.proceedButton, true, "Proceed");

  try {
    const response = await apiFetch("/api/payments/initiate", {
      method: "POST",
      body: JSON.stringify({
        offeringCode: state.selectedOffering.code,
        channel,
        devotee,
      }),
    });

    state.currentTransaction = response;
    state.upiLink = response.upiPayload.upiUri;
    persistPendingPayment(response);
    ui.bookingModal.hide();

    if (channel === "MOBILE") {
      const handled = await tryGooglePayPaymentRequest(response);
      if (!handled) {
        openPaymentActionModal("MOBILE");
      }
      return;
    }

    openPaymentActionModal("WEB");
  } catch (error) {
    showToast(error.message || "Unable to create payment.");
  } finally {
    setButtonLoading(ui.proceedButton, false, "Proceed");
  }
}

function openPaymentActionModal(mode) {
  if (!state.currentTransaction) {
    return;
  }

  state.paymentMode = mode;
  ui.paymentOfferingTitle.textContent = state.currentTransaction.offering.name;
  ui.paymentOfferingMeta.textContent = `Amount: Rs. ${Number(
    state.currentTransaction.amount
  ).toFixed(2)} | Receipt: ${state.currentTransaction.receiptNumber}`;
  ui.paymentQrImage.src = state.currentTransaction.qrCodeDataUrl;
  ui.paymentModeBadge.textContent = mode === "MOBILE" ? "Mobile Google Pay" : "Desktop QR";
  ui.paymentInstructions.textContent = state.currentTransaction.instructions;
  ui.internalTransactionId.textContent = state.currentTransaction.transactionId;
  ui.openGpayButton.classList.toggle("d-none", mode !== "MOBILE");
  ui.confirmPaymentButton.textContent =
    mode === "MOBILE" ? "I Completed Payment" : "Generate Offline Receipt";
  ui.paymentActionModal.show();
}

async function tryGooglePayPaymentRequest(transaction) {
  if (!window.PaymentRequest || !/Android/i.test(navigator.userAgent)) {
    return false;
  }

  try {
    const methodData = [
      {
        supportedMethods: "https://tez.google.com/pay",
        data: {
          pa: extractQueryValue(transaction.upiPayload.upiUri, "pa"),
          pn: extractQueryValue(transaction.upiPayload.upiUri, "pn"),
          tr: transaction.transactionId,
          tn: `${transaction.offering.name} - ${transaction.transactionId}`,
          am: Number(transaction.amount).toFixed(2),
          cu: "INR",
          mode: "01",
          purpose: "00",
        },
      },
    ];

    const details = {
      total: {
        label: transaction.offering.name,
        amount: {
          currency: "INR",
          value: Number(transaction.amount).toFixed(2),
        },
      },
      displayItems: [
        {
          label: "Temple Offering",
          amount: {
            currency: "INR",
            value: Number(transaction.amount).toFixed(2),
          },
        },
      ],
    };

    const request = new PaymentRequest(methodData, details);
    const canMakePayment = await request.canMakePayment();

    if (!canMakePayment) {
      return false;
    }

    const paymentResponse = await request.show();
    await paymentResponse.complete("success");

    const responseDetails = normalizePaymentResponse(paymentResponse.details);
    const status = responseDetails.status === "SUCCESS" ? "SUCCESS" : "PENDING";

    await completePaymentRequest({
      status,
      externalTransactionId:
        responseDetails.transactionId || responseDetails.txnId || transaction.transactionId,
      approvalReferenceNo:
        responseDetails.approvalRefNo || responseDetails.approvalReferenceNo || "",
      paymentResponse: responseDetails,
    });

    return true;
  } catch (error) {
    return false;
  }
}

function normalizePaymentResponse(details) {
  if (!details) {
    return {};
  }

  if (typeof details === "string") {
    const params = new URLSearchParams(details);
    return Array.from(params.entries()).reduce((result, [key, value]) => {
      result[key] = value;
      result[key.toLowerCase()] = value;
      return result;
    }, {});
  }

  return Object.keys(details).reduce((result, key) => {
    result[key] = details[key];
    result[key.toLowerCase()] = details[key];
    return result;
  }, {});
}

function openGooglePayLink() {
  if (!state.currentTransaction) {
    return;
  }

  persistPendingPayment(state.currentTransaction);
  window.location.href =
    state.currentTransaction.upiPayload.tezUri ||
    state.currentTransaction.upiPayload.gpayUri ||
    state.currentTransaction.upiPayload.upiUri;
}

async function copyUpiLink() {
  if (!state.upiLink) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.upiLink);
    showToast("UPI link copied.");
  } catch (error) {
    showToast("Unable to copy UPI link.");
  }
}

async function confirmPayment() {
  if (!state.currentTransaction) {
    return;
  }

  const externalTransactionId =
    ui.upiTransactionId.value.trim() || state.currentTransaction.transactionId;
  const approvalReferenceNo = ui.approvalReferenceNo.value.trim();
  const status = state.paymentMode === "MOBILE" ? "SUCCESS" : "OFFLINE";

  await completePaymentRequest({
    status,
    externalTransactionId,
    approvalReferenceNo,
    paymentResponse: {
      mode: state.paymentMode,
      confirmedBy: "devotee",
    },
  });
}

async function completePaymentRequest(payload) {
  setButtonLoading(ui.confirmPaymentButton, true, ui.confirmPaymentButton.textContent);

  try {
    const response = await apiFetch(
      `/api/payments/${state.currentTransaction.transactionId}/complete`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    state.receipt = response.receipt;
    clearPendingPayment();
    renderReceipt(response.receipt);
    ui.paymentActionModal.hide();
    ui.receiptModal.show();
  } catch (error) {
    showToast(error.message || "Unable to confirm payment.");
  } finally {
    setButtonLoading(
      ui.confirmPaymentButton,
      false,
      state.paymentMode === "MOBILE" ? "I Completed Payment" : "Generate Offline Receipt"
    );
  }
}

function renderReceipt(receipt) {
  ui.receiptContent.innerHTML = `
    <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
      <div>
        <h4>Bhairavagutta Temple Receipt</h4>
        <p class="subtle-copy mb-0">Sri Maha Kala Bhairava & Abhaya Shaneeswara Kshetram</p>
      </div>
      <div class="text-md-end">
        <div class="payment-mode-badge">${receipt.PaymentStatus}</div>
        <p class="subtle-copy mt-2 mb-0">Receipt No. ${receipt.ReceiptNumber}</p>
      </div>
    </div>
    <div class="receipt-grid">
      ${receiptItem("Transaction ID", receipt.TransactionId)}
      ${receiptItem("Offering", receipt.OfferingName)}
      ${receiptItem("Amount", `Rs. ${Number(receipt.Amount).toFixed(2)}`)}
      ${receiptItem("Devotee Name", receipt.DevoteeName)}
      ${receiptItem(
        "Gothram",
        receipt.CustomGothram ? `${receipt.Gothram} - ${receipt.CustomGothram}` : receipt.Gothram
      )}
      ${receiptItem("Nakshatram", `${receipt.Nakshatram} | Padam ${receipt.Padam}`)}
      ${receiptItem("Raashi", receipt.Raashi)}
      ${receiptItem(
        "Completed At",
        receipt.CompletedAt ? formatDateTime(receipt.CompletedAt) : "Pending"
      )}
      ${receiptItem("UPI Ref", receipt.ExternalTransactionId || "Not provided")}
      ${receiptItem("Approval Ref", receipt.ApprovalReferenceNo || "Not provided")}
      ${receiptItem("Payment Channel", receipt.PaymentChannel)}
      ${receiptItem("Sankalpam", receipt.Sankalpam || "Temple sankalpam")}
    </div>
  `;
}

function receiptItem(label, value) {
  return `
    <div class="receipt-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function printReceipt() {
  if (!state.receipt) {
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    showToast("Please allow popups to print the receipt.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Temple Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
          h1 { margin-bottom: 6px; }
          p { margin-top: 0; color: #444; }
          .receipt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 24px; }
          .receipt-item { border: 1px solid #d8d8d8; border-radius: 12px; padding: 14px; }
          .receipt-item span { display: block; font-size: 11px; text-transform: uppercase; color: #777; margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <h1>Bhairavagutta Temple Receipt</h1>
        <p>Sri Maha Kala Bhairava & Abhaya Shaneeswara Kshetram</p>
        ${ui.receiptContent.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function openGallery(index) {
  state.galleryIndex = index;
  resetGalleryZoom();
  syncGalleryView();
  ui.galleryModal.show();
}

function syncGalleryView() {
  const galleryItem = state.bootstrapData.gallery[state.galleryIndex];
  if (!galleryItem) {
    return;
  }

  ui.galleryStageImage.src = galleryItem.src;
  ui.galleryStageImage.alt = galleryItem.title;
  ui.galleryCaption.textContent = `${galleryItem.title} (${state.galleryIndex + 1}/${
    state.bootstrapData.gallery.length
  })`;
  applyGalleryZoom();
}

function stepGallery(direction) {
  const galleryLength = state.bootstrapData.gallery.length;
  state.galleryIndex = (state.galleryIndex + direction + galleryLength) % galleryLength;
  resetGalleryZoom();
  syncGalleryView();
}

function adjustGalleryZoom(change) {
  state.galleryScale = clamp(state.galleryScale + change, 1, 4);
  applyGalleryZoom();
}

function resetGalleryZoom() {
  state.galleryScale = 1;
  applyGalleryZoom();
}

function applyGalleryZoom() {
  ui.galleryStageImage.style.transform = `scale(${state.galleryScale})`;
}

function onGalleryWheel(event) {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.12 : 0.12;
  adjustGalleryZoom(delta);
}

function onGalleryKeydown(event) {
  if (!document.getElementById("galleryModal").classList.contains("show")) {
    return;
  }

  if (event.key === "ArrowRight") {
    stepGallery(1);
  } else if (event.key === "ArrowLeft") {
    stepGallery(-1);
  }
}

function setButtonLoading(button, isLoading, idleText) {
  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? '<span class="spinner-border spinner-border-sm me-2"></span>Please wait'
    : idleText;
}

function resetBookingForm() {
  ui.bookingForm.reset();
  ui.customGothramWrap.classList.add("d-none");
  ui.customGothram.required = false;
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function persistPendingPayment(transaction) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      transactionId: transaction.transactionId,
      offeringName: transaction.offering.name,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    })
  );
}

function clearPendingPayment() {
  localStorage.removeItem(storageKey);
}

function restorePendingPaymentMessage() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return;
  }

  try {
    const pending = JSON.parse(raw);
    showToast(
      `Pending payment found for ${pending.offeringName}. If you already paid, open the seva again and confirm the payment.`
    );
  } catch (error) {
    clearPendingPayment();
  }
}

function extractQueryValue(upiUri, key) {
  const [, queryString = ""] = upiUri.split("?");
  return new URLSearchParams(queryString).get(key) || "";
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${dateValue}T00:00:00+05:30`));
}

function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(dateValue));
}

function showToast(message) {
  ui.toastBody.textContent = message;
  ui.toast.show();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}
