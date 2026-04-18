const { MhahPanchang } = require("mhah-panchang");
const { DateTime } = require("luxon");

const TIME_ZONE = "Asia/Kolkata";
const DEFAULT_COORDINATES = {
  latitude: 17.63972,
  longitude: 78.52667,
};

const TELUGU_DAY_NAMES = [
  "ఆదివారం",
  "సోమవారం",
  "మంగళవారం",
  "బుధవారం",
  "గురువారం",
  "శుక్రవారం",
  "శనివారం",
];

const TELUGU_TITHI_NAMES = [
  "పాడ్యమి",
  "విదియ",
  "తదియ",
  "చవితి",
  "పంచమి",
  "షష్ఠి",
  "సప్తమి",
  "అష్టమి",
  "నవమి",
  "దశమి",
  "ఏకాదశి",
  "ద్వాదశి",
  "త్రయోదశి",
  "చతుర్దశి",
  "పౌర్ణమి",
  "పాడ్యమి",
  "విదియ",
  "తదియ",
  "చవితి",
  "పంచమి",
  "షష్ఠి",
  "సప్తమి",
  "అష్టమి",
  "నవమి",
  "దశమి",
  "ఏకాదశి",
  "ద్వాదశి",
  "త్రయోదశి",
  "చతుర్దశి",
  "అమావాస్య",
];

const TELUGU_MASA_NAMES = [
  "చైత్రం",
  "వైశాఖం",
  "జ్యేష్ఠం",
  "ఆషాఢం",
  "శ్రావణం",
  "భాద్రపదం",
  "ఆశ్వయుజం",
  "కార్తీకం",
  "మార్గశిరం",
  "పుష్యం",
  "మాఘం",
  "ఫాల్గుణం",
];

const TELUGU_PAKSHA_NAMES = ["శుక్ల పక్షం", "కృష్ణ పక్షం"];

const panchang = new MhahPanchang();
panchang.setMhahConstant("Day", "name", TELUGU_DAY_NAMES);
panchang.setMhahConstant("Tithi", "name", TELUGU_TITHI_NAMES);
panchang.setMhahConstant("Masa", "name", TELUGU_MASA_NAMES);
panchang.setMhahConstant("Paksha", "name", TELUGU_PAKSHA_NAMES);

const yearCache = new Map();

function normalizeMasaName(masaName = "") {
  return masaName.replace(/\s+/g, "").toLowerCase();
}

function isTrayodashi(tithiIndex) {
  return tithiIndex === 12 || tithiIndex === 27;
}

function isKrishnaAshtami(tithiIndex, pakshaName) {
  return tithiIndex === 22 || (tithiIndex === 7 && pakshaName === "Krishna");
}

function getSunrisePanchang(dateInput, coordinates = DEFAULT_COORDINATES) {
  const localDate =
    typeof dateInput === "string"
      ? DateTime.fromISO(dateInput, { zone: TIME_ZONE }).startOf("day")
      : DateTime.fromJSDate(dateInput, { zone: TIME_ZONE }).startOf("day");

  const anchorDate = localDate.set({ hour: 6, minute: 0, second: 0, millisecond: 0 });
  const timer = panchang.sunTimer(
    anchorDate.toUTC().toJSDate(),
    coordinates.latitude,
    coordinates.longitude
  );
  const sunriseLocal = DateTime.fromJSDate(timer.sunRise, { zone: "utc" }).setZone(
    TIME_ZONE
  );
  const details = panchang.calendar(
    timer.sunRise,
    coordinates.latitude,
    coordinates.longitude
  );

  return {
    date: localDate.toISODate(),
    weekday: localDate.weekday,
    weekdayName: details.Day?.name || localDate.toFormat("cccc"),
    weekdayNameEnglish: details.Day?.name_en_UK || localDate.toFormat("cccc"),
    sunrise: sunriseLocal.toFormat("hh:mm a"),
    sunriseIso: sunriseLocal.toISO(),
    tithi: details.Tithi,
    paksha: details.Paksha,
    masa: details.Masa,
    nakshatra: details.Nakshatra,
    ritu: details.Ritu,
    raasi: details.Raasi,
  };
}

function buildSpecialDayEntry(type, sunriseData, extra = {}) {
  return {
    type,
    date: sunriseData.date,
    weekdayName: sunriseData.weekdayName,
    weekdayNameEnglish: sunriseData.weekdayNameEnglish,
    sunrise: sunriseData.sunrise,
    tithiNameTelugu: sunriseData.tithi.name,
    tithiNameEnglish: sunriseData.tithi.name_en_IN,
    pakshaNameTelugu: sunriseData.paksha.name,
    pakshaNameEnglish: sunriseData.paksha.name_en_IN,
    masaNameTelugu: sunriseData.masa.name,
    masaNameEnglish: sunriseData.masa.name_en_UK,
    description: extra.description,
    title: extra.title,
    tag: extra.tag,
  };
}

function getSpecialDaysForYear(year, coordinates = DEFAULT_COORDINATES) {
  const cacheKey = `${year}-${coordinates.latitude}-${coordinates.longitude}`;
  if (yearCache.has(cacheKey)) {
    return yearCache.get(cacheKey);
  }

  const start = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: TIME_ZONE });
  const end = start.endOf("year");
  const specialDays = [];

  for (let cursor = start; cursor <= end; cursor = cursor.plus({ days: 1 })) {
    const sunriseData = getSunrisePanchang(cursor.toISODate(), coordinates);
    const tithiIndex = sunriseData.tithi.ino;
    const pakshaEnglish = sunriseData.paksha.name_en_IN;
    const masaEnglish = sunriseData.masa.name_en_UK;
    const masaKey = normalizeMasaName(masaEnglish);

    if (cursor.weekday === 6 && isTrayodashi(tithiIndex)) {
      specialDays.push(
        buildSpecialDayEntry("SHANI_TRAYODASHI", sunriseData, {
          title: "Shani Trayodashi",
          tag: "శని త్రయోదశి",
          description:
            "Saturday when Trayodashi tithi is present during sunrise as per Telugu Panchang.",
        })
      );
    }

    if (cursor.weekday === 6 && tithiIndex === 29) {
      specialDays.push(
        buildSpecialDayEntry("SHANI_AMAVASYA", sunriseData, {
          title: "Shani Amavasya",
          tag: "శని అమావాస్య",
          description:
            "Saturday when Amavasya tithi is present during sunrise as per Telugu Panchang.",
        })
      );
    }

    if (isKrishnaAshtami(tithiIndex, pakshaEnglish)) {
      const isJayanti = masaKey.includes("kartika") || masaKey.includes("karthika");
      specialDays.push(
        buildSpecialDayEntry(
          isJayanti ? "KALA_BHAIRAVA_JAYANTI" : "KALA_BHAIRAVA_ASHTAMI",
          sunriseData,
          {
            title: isJayanti
              ? "Kala Bhairava Jayanti"
              : "Sri Maha Kala Bhairava Ashtami",
            tag: isJayanti ? "కాల భైరవ జయంతి" : "భైరవ అష్టమి",
            description: isJayanti
              ? "Annual Kala Bhairava Jayanti observed on Krishna Ashtami in Kartika masa."
              : "Monthly Sri Maha Kala Bhairava Ashtami observed on Krishna Paksha Ashtami.",
          }
        )
      );
    }
  }

  const sorted = specialDays.sort((left, right) => left.date.localeCompare(right.date));
  yearCache.set(cacheKey, sorted);
  return sorted;
}

function getUpcomingSpecialDays(limit = 10, coordinates = DEFAULT_COORDINATES) {
  const today = DateTime.now().setZone(TIME_ZONE).toISODate();
  const currentYear = DateTime.now().setZone(TIME_ZONE).year;
  const allDays = [
    ...getSpecialDaysForYear(currentYear, coordinates),
    ...getSpecialDaysForYear(currentYear + 1, coordinates),
  ];

  return allDays.filter((entry) => entry.date >= today).slice(0, limit);
}

module.exports = {
  TIME_ZONE,
  DEFAULT_COORDINATES,
  getSunrisePanchang,
  getSpecialDaysForYear,
  getUpcomingSpecialDays,
};
