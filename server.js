require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const QRCode = require("qrcode");
const { DateTime } = require("luxon");

const { executeQuery, sql } = require("./db");
const {
  DEFAULT_COORDINATES,
  TIME_ZONE,
  getUpcomingSpecialDays,
  getSpecialDaysForYear,
} = require("./services/panchangService");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const TEMPLE_PROFILE = {
  name: "Bhairavagutta",
  title: "Sri Maha Kala Bhairava & Abhaya Shaneeswara Kshetram",
  owner: "Sri. M. Kalyana Ramakrishna, Advocate",
  address:
    "JGQG+QPX, Bhairava Gutta, Ravalkole Village, Medchal Mandal, R.R.dist., Ghanpur, 501401",
  mapUrl: "https://maps.app.goo.gl/SzEE4xt5XNBfVZk7A",
  whatsapp: "9121590590",
  whatsappUrl: "https://wa.me/919121590590",
  facebookUrl: "https://www.facebook.com/share/1H2yQsTDvU/",
  youtubeUrl: "https://youtube.com/@divyaanugraham-qh6wq?si=mp1m71HulGW6d7QS",
  coordinates: DEFAULT_COORDINATES,
  about: [
    "Sri Maha Kala Bhairava Swamy is Swayambhu on a sacred rock beneath a Banyan tree, and the hill rock itself is revered in Shiva Linga aakara. Local tradition holds that Bhairava Gutta has been known for more than 300 years.",
    "Sri. M. Kalyana Ramakrishna and family installed the 6-foot Abhaya Shaneeswara Swamy deity on 27-02-2003, a Thursday Ekadasi in Chitrabhanu nama samvatsara. The first Tailabhishekam was performed on 01-03-2003, a unique day combining Shani Trayodashi and Maha Shiva Ratri.",
    "The kshetram also houses Sri Vinayaka Swamy and Nagendra Swamy, and the land has been nurtured into a mini forest with more than 10,000 medicinal and sacred plants including Rudraksha, Naga Lingam, Srigandham, Nagamalli, Tani, Krishna Marri, Maredu, Jammi, Ravi and Vepa.",
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
        "Swayambhu manifestation on the sacred rock under the Banyan tree.",
    },
    {
      name: "Sri Vinayaka Swamy",
      description: "Installed at the kshetram for auspicious beginnings and blessings.",
    },
    {
      name: "Sri Nagendra Swamy",
      description: "Installed deity representing serpent divinity and protection.",
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
};

const OFFERINGS = [
  {
    code: "TILA_TAILABHISHEKAM",
    name: "Thila Thailabhishekam to Shaneeswara Swamy",
    amount: 200,
    type: "Pooja",
    description: "Sacred oil abhishekam seva for Sri Abhaya Shaneeswara Swamy.",
  },
  {
    code: "KALA_BHAIRAVA_ABHISHEKAM",
    name: "Abhishekam to Kala Bhairava Swamy",
    amount: 300,
    type: "Pooja",
    description: "Abhishekam seva offered to Sri Maha Kala Bhairava Swamy.",
  },
  {
    code: "KUSHMANDA_DEEPA_SEVA",
    name: "Kushmanda Deepa Seva",
    amount: 500,
    type: "Pooja",
    description: "Deepa seva offered with spiritual sankalpam.",
  },
  {
    code: "HOMAM",
    name: "Homam",
    amount: 10116,
    type: "Pooja",
    description: "Homam seva performed with temple sankalpam.",
  },
  {
    code: "ABHISHEKAM_SET",
    name: "Abhishekam Set",
    amount: 400,
    type: "Pooja Set",
    description: "Temple-prepared abhishekam material set.",
  },
  {
    code: "KOOSHMANDA_DEEPAM_SET",
    name: "Kooshmanda Deepam Set",
    amount: 300,
    type: "Pooja Set",
    description: "Deepam set for Kushmanda seva.",
  },
];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function buildGalleryTitle(index) {
  const titles = [
    "Sacred Hill Darshan",
    "Sri Abhaya Shaneeswara Presence",
    "Sri Maha Kala Bhairava Sannidhi",
    "Temple Pathway & Sacred Stone",
    "Banyan Tree Devotional View",
    "Mini Forest Serenity",
    "Sacred Temple Landscape",
    "Evening Temple Glow",
  ];

  return titles[index] || `Bhairavagutta Temple View ${index + 1}`;
}

function getGalleryImages() {
  const galleryDirectory = path.join(__dirname, "public", "assets", "gallery");

  if (!fs.existsSync(galleryDirectory)) {
    return [];
  }

  return fs
    .readdirSync(galleryDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))
    .map((entry, index) => ({
      src: `/assets/gallery/${entry.name}`,
      title: buildGalleryTitle(index),
    }));
}

const GOTHRAM_OPTIONS = [
  "కాశ్యపస",
  "భారద్వాజస",
  "వశిష్ఠస",
  "అత్రిస",
  "గౌతమస",
  "హరితస",
  "శ్రీवत్సస",
  "కౌండిన్యస",
  "అగస్త్యస",
  "Others",
];

const NAKSHATRAM_OPTIONS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Moola",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const RAASHI_OPTIONS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karkataka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrischika",
  "Dhanussu",
  "Makara",
  "Kumbha",
  "Meena",
];

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function getOfferingOrThrow(offeringCode) {
  const offering = OFFERINGS.find((item) => item.code === offeringCode);
  if (!offering) {
    const error = new Error("Invalid offering selected.");
    error.status = 400;
    throw error;
  }
  return offering;
}

function buildTransactionId() {
  return `BGT${DateTime.now().setZone(TIME_ZONE).toFormat("yyyyLLddHHmmss")}${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

function buildReceiptNumber(transactionId) {
  return `RCT-${DateTime.now().setZone(TIME_ZONE).toFormat("yyLLdd")}-${transactionId.slice(
    -6
  )}`;
}

function buildUpiPayload({ amount, offeringName, transactionId }) {
  const searchParams = new URLSearchParams({
    pa: process.env.TEMPLE_UPI_ID || "replace-with-your-upi-id@bank",
    pn: process.env.TEMPLE_UPI_PAYEE_NAME || "Bhairavagutta Temple",
    tr: transactionId,
    tn: `${offeringName} - ${transactionId}`,
    am: amount.toFixed(2),
    cu: "INR",
  });

  if (process.env.TEMPLE_GPAY_MERCHANT_CODE) {
    searchParams.set("mc", process.env.TEMPLE_GPAY_MERCHANT_CODE);
  }

  const queryString = searchParams.toString();
  return {
    upiUri: `upi://pay?${queryString}`,
    gpayUri: `gpay://upi/pay?${queryString}`,
    tezUri: `tez://upi/pay?${queryString}`,
  };
}

async function insertTemplePaymentRecord(payload) {
  const query = `
    INSERT INTO dbo.TemplePayments
    (
      TransactionId,
      ReceiptNumber,
      DevoteeName,
      Gothram,
      CustomGothram,
      Nakshatram,
      Padam,
      Raashi,
      Sankalpam,
      OfferingCode,
      OfferingName,
      OfferingType,
      Amount,
      PaymentChannel,
      PaymentMethod,
      PaymentStatus,
      DeviceInfo,
      CreatedAt,
      UpdatedAt
    )
    VALUES
    (
      @transactionId,
      @receiptNumber,
      @devoteeName,
      @gothram,
      @customGothram,
      @nakshatram,
      @padam,
      @raashi,
      @sankalpam,
      @offeringCode,
      @offeringName,
      @offeringType,
      @amount,
      @paymentChannel,
      @paymentMethod,
      @paymentStatus,
      @deviceInfo,
      SYSDATETIMEOFFSET(),
      SYSDATETIMEOFFSET()
    );
  `;

  await executeQuery(query, [
    { name: "transactionId", type: sql.NVarChar(40), value: payload.transactionId },
    { name: "receiptNumber", type: sql.NVarChar(40), value: payload.receiptNumber },
    { name: "devoteeName", type: sql.NVarChar(120), value: payload.devoteeName },
    { name: "gothram", type: sql.NVarChar(120), value: payload.gothram },
    {
      name: "customGothram",
      type: sql.NVarChar(120),
      value: payload.customGothram || null,
    },
    { name: "nakshatram", type: sql.NVarChar(60), value: payload.nakshatram },
    { name: "padam", type: sql.Int, value: payload.padam },
    { name: "raashi", type: sql.NVarChar(40), value: payload.raashi },
    {
      name: "sankalpam",
      type: sql.NVarChar(sql.MAX),
      value: payload.sankalpam || null,
    },
    { name: "offeringCode", type: sql.NVarChar(50), value: payload.offeringCode },
    { name: "offeringName", type: sql.NVarChar(150), value: payload.offeringName },
    { name: "offeringType", type: sql.NVarChar(30), value: payload.offeringType },
    { name: "amount", type: sql.Decimal(12, 2), value: payload.amount },
    {
      name: "paymentChannel",
      type: sql.NVarChar(30),
      value: payload.paymentChannel,
    },
    { name: "paymentMethod", type: sql.NVarChar(20), value: payload.paymentMethod },
    { name: "paymentStatus", type: sql.NVarChar(20), value: payload.paymentStatus },
    { name: "deviceInfo", type: sql.NVarChar(500), value: payload.deviceInfo },
  ]);
}

async function updateTemplePaymentStatus(transactionId, payload) {
  const query = `
    UPDATE dbo.TemplePayments
    SET
      PaymentStatus = @paymentStatus,
      ExternalTransactionId = @externalTransactionId,
      ApprovalReferenceNo = @approvalReferenceNo,
      PaymentResponse = @paymentResponse,
      UpdatedAt = SYSDATETIMEOFFSET(),
      CompletedAt = CASE
        WHEN @paymentStatus IN ('SUCCESS', 'OFFLINE') THEN SYSDATETIMEOFFSET()
        ELSE CompletedAt
      END
    WHERE TransactionId = @transactionId;
  `;

  await executeQuery(query, [
    { name: "transactionId", type: sql.NVarChar(40), value: transactionId },
    { name: "paymentStatus", type: sql.NVarChar(20), value: payload.paymentStatus },
    {
      name: "externalTransactionId",
      type: sql.NVarChar(120),
      value: payload.externalTransactionId || null,
    },
    {
      name: "approvalReferenceNo",
      type: sql.NVarChar(120),
      value: payload.approvalReferenceNo || null,
    },
    {
      name: "paymentResponse",
      type: sql.NVarChar(sql.MAX),
      value: payload.paymentResponse
        ? JSON.stringify(payload.paymentResponse)
        : null,
    },
  ]);
}

async function getReceiptByTransactionId(transactionId) {
  const query = `
    SELECT TOP 1
      TransactionId,
      ReceiptNumber,
      DevoteeName,
      Gothram,
      CustomGothram,
      Nakshatram,
      Padam,
      Raashi,
      Sankalpam,
      OfferingName,
      OfferingType,
      Amount,
      PaymentChannel,
      PaymentStatus,
      ExternalTransactionId,
      ApprovalReferenceNo,
      CreatedAt,
      CompletedAt
    FROM dbo.TemplePayments
    WHERE TransactionId = @transactionId;
  `;

  const result = await executeQuery(query, [
    { name: "transactionId", type: sql.NVarChar(40), value: transactionId },
  ]);
  return result.recordset[0] || null;
}

function validateDevoteePayload(devotee = {}) {
  const { name, gothram, customGothram, nakshatram, padam, raashi, sankalpam } = devotee;

  if (!name || !gothram || !nakshatram || !padam || !raashi) {
    const error = new Error("Please complete all required devotee details.");
    error.status = 400;
    throw error;
  }

  if (gothram === "Others" && !customGothram) {
    const error = new Error("Please enter the gothram name when Others is selected.");
    error.status = 400;
    throw error;
  }

  return {
    devoteeName: String(name).trim(),
    gothram: String(gothram).trim(),
    customGothram: customGothram ? String(customGothram).trim() : "",
    nakshatram: String(nakshatram).trim(),
    padam: Number(padam),
    raashi: String(raashi).trim(),
    sankalpam: sankalpam ? String(sankalpam).trim() : "",
  };
}

app.get("/api/bootstrap", async (request, response, next) => {
  try {
    response.json({
      temple: TEMPLE_PROFILE,
      offerings: OFFERINGS,
      gallery: getGalleryImages(),
      formOptions: {
        gothrams: GOTHRAM_OPTIONS,
        nakshatrams: NAKSHATRAM_OPTIONS,
        raashis: RAASHI_OPTIONS,
        padams: [1, 2, 3, 4],
      },
      specialDays: getUpcomingSpecialDays(12),
      payment: {
        payeeName: process.env.TEMPLE_UPI_PAYEE_NAME || "Bhairavagutta Temple",
        upiConfigured:
          !String(process.env.TEMPLE_UPI_ID || "").includes("replace-with-your-upi-id"),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/special-days", async (request, response, next) => {
  try {
    const year = Number(request.query.year || DateTime.now().setZone(TIME_ZONE).year);
    response.json({
      year,
      specialDays: getSpecialDaysForYear(year),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/payments/initiate", async (request, response, next) => {
  try {
    const { offeringCode, channel, devotee } = request.body;
    const offering = getOfferingOrThrow(offeringCode);
    const devoteeData = validateDevoteePayload(devotee);
    const transactionId = buildTransactionId();
    const receiptNumber = buildReceiptNumber(transactionId);
    const upiPayload = buildUpiPayload({
      amount: offering.amount,
      offeringName: offering.name,
      transactionId,
    });
    const qrCodeDataUrl = await QRCode.toDataURL(upiPayload.upiUri, {
      width: 360,
      margin: 1,
      color: {
        dark: "#1b1306",
        light: "#fff8ec",
      },
    });

    await insertTemplePaymentRecord({
      ...devoteeData,
      transactionId,
      receiptNumber,
      offeringCode: offering.code,
      offeringName: offering.name,
      offeringType: offering.type,
      amount: offering.amount,
      paymentChannel: channel === "MOBILE" ? "MOBILE_GPAY" : "WEB_QR",
      paymentMethod: "UPI",
      paymentStatus: "INITIATED",
      deviceInfo: String(request.headers["user-agent"] || "").slice(0, 500),
    });

    response.status(201).json({
      transactionId,
      receiptNumber,
      amount: offering.amount,
      offering,
      devotee: devoteeData,
      qrCodeDataUrl,
      upiPayload,
      createdAt: DateTime.now().setZone(TIME_ZONE).toISO(),
      instructions:
        channel === "MOBILE"
          ? "Open Google Pay, finish the payment, then confirm payment on the page to save the success receipt."
          : "Scan the QR code with any UPI app, then generate the offline receipt once the transfer is completed.",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/payments/:transactionId/complete", async (request, response, next) => {
  try {
    const { transactionId } = request.params;
    const { status, externalTransactionId, approvalReferenceNo, paymentResponse } =
      request.body;
    const allowedStatuses = ["OFFLINE", "SUCCESS", "FAILED", "PENDING"];

    if (!allowedStatuses.includes(status)) {
      const error = new Error("Invalid payment status.");
      error.status = 400;
      throw error;
    }

    await updateTemplePaymentStatus(transactionId, {
      paymentStatus: status,
      externalTransactionId,
      approvalReferenceNo,
      paymentResponse,
    });

    const receipt = await getReceiptByTransactionId(transactionId);
    if (!receipt) {
      const error = new Error("Receipt not found.");
      error.status = 404;
      throw error;
    }

    response.json({
      message: "Payment status updated successfully.",
      receipt,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/payments/:transactionId/receipt", async (request, response, next) => {
  try {
    const receipt = await getReceiptByTransactionId(request.params.transactionId);
    if (!receipt) {
      const error = new Error("Receipt not found.");
      error.status = 404;
      throw error;
    }

    response.json({ receipt });
  } catch (error) {
    next(error);
  }
});

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((error, request, response, next) => {
  const status = error.status || 500;
  response.status(status).json({
    message:
      status === 500
        ? "Something went wrong while processing the request."
        : error.message,
    details:
      process.env.NODE_ENV === "development" && status === 500
        ? error.message
        : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Bhairavagutta app running on http://localhost:${PORT}`);
});
