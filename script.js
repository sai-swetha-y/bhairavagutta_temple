// =============================
// GLOBALS
// =============================
let currentIndex = 0;
let images = [];
let zoomLevel = 1;

// 🔥 NEW (for drag + smooth transform)
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

// 🔥 slideshow
let slideshowInterval;

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  setupLinks();
  loadYearSpecialDays();
  initGallery();
});

// =============================
// LINKS
// =============================
function setupLinks() {
  const address = "Bhairava Gutta, Ravalkole Village, Medchal Mandal, R.R.dist., Telangana 501401, India";

  document.getElementById("mapLink").href =
    "https://maps.app.goo.gl/SzEE4xt5XNBfVZk7A";

  document.getElementById("whatsAppLink").href =
    "https://wa.me/919121590590";

  document.getElementById("youtubeLink").href =
    "https://youtube.com/@divyaanugraham-qh6wq";

  document.getElementById("facebookLink").href =
    "https://www.facebook.com/share/1H2yQsTDvU/";

  document.getElementById("heroAddress").innerText = address;
}

// =============================
// SPECIAL DAYS
// =============================
async function loadYearSpecialDays() {
  const res = await fetch("http://localhost:3000/special-days");
  const data = await res.json();
  loadSpecialDays(data);
}

function loadSpecialDays(days) {
	window.allSpecialDays = days;
  const container = document.getElementById("specialDaysList");
  if (!container) return;

  container.innerHTML = days.map((day, index) => `
  <div class="col-md-6">
    <div class="temple-panel p-3" onclick="openDay(${index})">
      <h5>${day.telugu}</h5>
      <p>${day.date}</p>
    </div>
  </div>
`).join("");
}

function openDay(index) {

  const day = window.allSpecialDays[index];

  if (!day) {
    alert("Error loading day");
    return;
  }

  // ✅ STORE CORRECTLY
  window.selectedSpecialDay = day;

  console.log("✅ Selected Day:", day); // DEBUG

  document.getElementById("specialTitle").innerText = day.telugu;
  document.getElementById("specialDate").innerText = day.date;
  document.getElementById("specialPopup").style.display = "block";
}

function closeSpecial() {
  document.getElementById("specialPopup").style.display = "none";
}

// =============================
// GALLERY (ENHANCED)
// =============================
function initGallery() {

  const imgs = document.querySelectorAll(".gallery-img");

  images = Array.from(imgs).map(img => img.src);

  imgs.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentIndex = index;
      openGalleryModal();
    });
  });

  document.getElementById("galleryPrevButton").onclick = prevImage;
  document.getElementById("galleryNextButton").onclick = nextImage;

  document.getElementById("zoomInButton").onclick = () => zoom(0.2);
  document.getElementById("zoomOutButton").onclick = () => zoom(-0.2);
  document.getElementById("resetZoomButton").onclick = resetZoom;

  const stage = document.getElementById("galleryStage");

  // 🔥 Mouse wheel zoom
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.1 : -0.1);
  });

  // 🔥 DRAG (mouse)
  stage.addEventListener("mousedown", (e) => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // 🔥 MOBILE SWIPE
  let touchStartX = 0;

  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  stage.addEventListener("touchend", (e) => {
    let diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  });
}

// =============================
// MODAL
// =============================
function openGalleryModal() {
  const img = document.getElementById("galleryStageImage");

  img.src = images[currentIndex];

  zoomLevel = 1;
  translateX = 0;
  translateY = 0;

  applyTransform();

  const modal = new bootstrap.Modal(document.getElementById("galleryModal"));
  modal.show();

  startSlideshow();
}

// =============================
// NAVIGATION
// =============================
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
}

function updateImage() {
  const img = document.getElementById("galleryStageImage");

  img.src = images[currentIndex];

  zoomLevel = 1;
  translateX = 0;
  translateY = 0;

  applyTransform();
}

// =============================
// ZOOM + TRANSFORM
// =============================
function zoom(step) {
  zoomLevel = Math.min(4, Math.max(1, zoomLevel + step));
  applyTransform();
}

function applyTransform() {
  const img = document.getElementById("galleryStageImage");

  img.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
}

function resetZoom() {
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  applyTransform();
}

// =============================
// SLIDESHOW
// =============================
function startSlideshow() {
  stopSlideshow();

  slideshowInterval = setInterval(() => {
    nextImage();
  }, 3000);
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}

// stop on modal close
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("galleryModal");

  modal.addEventListener("hidden.bs.modal", () => {
    stopSlideshow();
  });
});

// =============================
// KEYBOARD
// =============================
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("galleryModal");

  if (modal.classList.contains("show")) {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") bootstrap.Modal.getInstance(modal)?.hide();
  }
});
const fullscreenBtn = document.getElementById("fullscreenBtn");

if (fullscreenBtn) {
  fullscreenBtn.onclick = () => {
    const modal = document.getElementById("galleryModal");

    if (!document.fullscreenElement) {
      modal.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
}
const poojaLink = document.querySelector('a[href="#poojaSection"]');

if (poojaLink) {
  poojaLink.addEventListener("click", function (e) {
    e.preventDefault();

    const section = document.getElementById("poojaSection");

    section.classList.remove("hidden");
    section.classList.add("show");

    section.scrollIntoView({ behavior: "smooth" });
  });
}
// ACCORDION
document.addEventListener("DOMContentLoaded", function () {

  console.log("🔥 SCRIPT FULLY READY");

  // ACCORDION
  document.querySelectorAll(".pooja-header").forEach(header => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("active");
    });
  });

  // PRICE CLICK
  document.querySelectorAll(".price").forEach(el => {
    el.addEventListener("click", () => {
      document.getElementById("selectedSeva").innerText = el.dataset.seva;
      document.getElementById("selectedAmount").innerText = el.dataset.amount;
      openModal();
    });
  });

  // NITYA BUTTON
  const nityaBtn = document.getElementById("nityaBtn");
  if (nityaBtn) {
    nityaBtn.addEventListener("click", () => {
      document.getElementById("selectedSeva").innerText = "Nitya Seva Sankalpam";
      document.getElementById("selectedAmount").innerText = "4400";
      openModal();
    });
  }

  // GOTRAM
  const gotram = document.getElementById("gotram");
  if (gotram) {
    gotram.addEventListener("change", function () {
      document.getElementById("otherGotram").style.display =
        this.value === "Others" ? "block" : "none";
    });
  }

});

// PRICE CLICK (Sevas + Saaman)
document.querySelectorAll(".price").forEach(el => {
  el.addEventListener("click", () => {

    const seva = el.dataset.seva;
    const amount = el.dataset.amount;

    document.getElementById("selectedSeva").innerText = seva;
    document.getElementById("selectedAmount").innerText = amount;

    openModal();
  });
});

// NITYA BUTTON
document.getElementById("nityaBtn").addEventListener("click", () => {
  document.getElementById("selectedSeva").innerText = "Nitya Seva Sankalpam";
  document.getElementById("selectedAmount").innerText = "4400";

  openModal();
});

// OPEN MODAL
function openModal() {
  new bootstrap.Modal(document.getElementById("bookingModal")).show();
}
document.addEventListener("change", function (e) {

  if (e.target && e.target.id === "gotram") {

    const otherInput = document.getElementById("otherGotram");

    if (e.target.value === "Others") {
      otherInput.style.display = "block";
    } else {
      otherInput.style.display = "none";
    }

  }

});
function getDevoteeDetails() {

  const name = document.getElementById("name").value.trim();
  const rashi = document.getElementById("rashi").value;
  const nakshatram = document.getElementById("nakshatram").value;
  const padam = document.getElementById("padam").value;
  const gotramSelect = document.getElementById("gotram").value;
  const otherGotram = document.getElementById("otherGotram").value.trim();
  const phone = document.querySelector('input[placeholder="Phone Number"]').value.trim();
  const family = document.getElementById("familyDetails").value.trim();

  let gotram = gotramSelect === "Others" ? otherGotram : gotramSelect;

  // VALIDATION
  if (!name) {
    alert("Please enter Devotee Name");
    return null;
  }

  if (!rashi || !nakshatram || !padam || !gotram) {
    alert("Please complete Sankalpam details");
    return null;
  }

  if (!phone || phone.length < 10) {
    alert("Enter valid phone number");
    return null;
  }

  return {
    name,
    rashi,
    nakshatram,
    padam,
    gotram,
    phone,
    family
  };
}

document.addEventListener("click", function (e) {

  if (e.target && e.target.id === "proceedBtn") {

    console.log("🔥 PROCEED CLICKED");

    const name = document.getElementById("name").value.trim();
    const rasi = document.getElementById("rashi").value;
    const gothramSelect = document.getElementById("gotram").value;
    const otherGotram = document.getElementById("otherGotram").value.trim();
    const nakshatram = document.getElementById("nakshatram").value;
    const padam = document.getElementById("padam").value;
    const phone = document.getElementById("phone").value.trim();
    const sankalpam = document.getElementById("familyDetails").value;

    // 🔥 CLEAN AMOUNT (VERY IMPORTANT)
    let rawAmount = document.getElementById("selectedAmount").innerText;
    let amount = rawAmount.replace(/[₹,/ -]/g, "");

    let gothram = gothramSelect === "Others" ? otherGotram : gothramSelect;

    // ================= VALIDATION =================
    if (!name) return alert("Enter name");
    if (!rasi || !nakshatram || !padam || !gothram)
      return alert("Complete Sankalpam details");
    if (!phone || phone.length < 10)
      return alert("Enter valid phone number");

    const txnId = "TXN" + Date.now();

window.bookingData = {
  name,
  phone,
  rasi,
  nakshatram,
  padam,
  gothram,
  amount,
  seva: document.getElementById("selectedSeva").innerText,
  sankalpam,
  txnId,
  specialDay: window.selectedSpecialDay
    ? `${window.selectedSpecialDay.telugu} (${window.selectedSpecialDay.date})`
    : "Normal"
};

    // ================= PAYMENT =================
    const upiId = "srivalli9603@oksbi";

    const upiLink =
      `upi://pay?pa=${upiId}&pn=BhairavaguttaTemple&am=${amount}&cu=INR&tn=${txnId}`;

    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    // ================= UPDATE UI =================
    document.getElementById("upiQrImage").src = qrUrl;
    document.getElementById("summaryName").innerText = name;
    document.getElementById("summaryPhone").innerText = phone;
    document.getElementById("summaryRasi").innerText = rasi;
    document.getElementById("summaryGothram").innerText = gothram;
    document.getElementById("summaryNakshatram").innerText = nakshatram;
    document.getElementById("summaryPadam").innerText = padam;
    document.getElementById("summarySankalpam").innerText = sankalpam;
    document.getElementById("summaryAmount").innerText = "₹" + amount;
    document.getElementById("txnId").innerText = txnId;

    document.getElementById("payNowBtn").href = upiLink;

    // ================= SWITCH MODALS =================
    bootstrap.Modal.getInstance(document.getElementById("bookingModal")).hide();
    new bootstrap.Modal(document.getElementById("paymentActionModal")).show();

    // ================= UX FEEDBACK =================
    setTimeout(() => {
      console.log("🙏 Booking submitted. Check Google Sheet.");
    }, 1500);
	
	document.getElementById("summarySpecialDay").innerText =
  window.selectedSpecialDay
    ? window.selectedSpecialDay.telugu + " (" + window.selectedSpecialDay.date + ")"
    : "Normal Day";
  }

});
// ================= COPY TXN =================
document.addEventListener("click", function (e) {

  if (e.target.id === "copyTxnBtn") {
    const txn = document.getElementById("txnId").innerText;

    navigator.clipboard.writeText(txn);

    alert("Transaction ID copied!");
  }

});

// ================= PAYMENT CONFIRM =================
document.addEventListener("click", async function (e) {

  if (e.target.id === "paidBtn") {

    const btn = e.target;

    if (btn.disabled) return;

    const data = window.bookingData;
    const utr = document.getElementById("utrNumber").value.trim();

    if (!utr || utr.length < 8) {
      alert("Enter valid UTR number");
      return;
    }

    btn.disabled = true;
    btn.innerText = "Processing...";

    try {

      const formData = new FormData();

      if (data.sevaList) {
  formData.append("sevaList", JSON.stringify(data.sevaList));
} else {
  formData.append("seva", data.seva);
}

formData.append("name", data.name);
formData.append("phone", data.phone);
formData.append("rashi", data.rashi);
formData.append("nakshatram", data.nakshatram);
formData.append("padam", data.padam);
formData.append("gothram", data.gothram);
formData.append("amount", data.amount);
formData.append("txnId", data.txnId);
formData.append("sankalpam", data.sankalpam);
formData.append("specialDay", data.specialDay);
      formData.append("utr", utr);
	  formData.append("specialDay", data.specialDay);

      const res = await fetch("https://script.google.com/macros/s/AKfycbwXuVRkTUwgLgwrfKgczBbeZ-32zelv3goMlZChKAPSYmW1BG-OUcbBmyDEV1j98Act/exec", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      console.log("SERVER RESPONSE:", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (result.status === "SUCCESS") {

        alert("✅ Booking Confirmed");

        bootstrap.Modal.getInstance(
          document.getElementById("paymentActionModal")
        ).hide();

      } 
      else if (result.status === "DUPLICATE_TXN") {
        alert("⚠️ Transaction already used");
      } 
      else if (result.status === "DUPLICATE_UTR") {
        alert("⚠️ UTR already used");
      } 
      else {
        alert("❌ " + result.status);
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error: " + err.message);
    }

    // ✅ ALWAYS RESET BUTTON
    btn.disabled = false;
    btn.innerText = "I Have Paid";
  }

});

document.addEventListener("hidden.bs.modal", function () {

  // Remove stuck backdrop
  document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());

  // Restore body scroll
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0px";

});


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    bootstrap.Modal.getInstance(e.target)?.hide();
  }
});

document.addEventListener("click", function (e) {

  if (e.target.id === "bookSpecialDayBtn") {

    const day = window.selectedSpecialDay;

    console.log("🔥 Booking for:", day);

    if (!day) {
      alert("No day selected");
      return;
    }

    // CLOSE POPUP
    document.getElementById("specialPopup").style.display = "none";

    // CLOSE SPECIAL DAYS MODAL
    const specialModal = document.getElementById("specialDaysModal");
    const modalInstance = bootstrap.Modal.getInstance(specialModal);
    if (modalInstance) modalInstance.hide();

    // OPEN SPECIAL BOOKING MODAL
    setTimeout(() => {
      new bootstrap.Modal(
        document.getElementById("specialBookingModal")
      ).show();
    }, 300);

  }

});
function calculateSpecialAmount() {

  let total = 0;

  const sevaOptions = document.getElementById("specialSevas").selectedOptions;
  const saamanOptions = document.getElementById("specialSaaman").selectedOptions;

  let sevaText = [];
  let saamanText = [];

  [...sevaOptions].forEach(o => {
    total += Number(o.value);
    sevaText.push(o.text);
  });

  [...saamanOptions].forEach(o => {
    total += Number(o.value);
    saamanText.push(o.text);
  });

  document.getElementById("specialTotal").innerText = total;
  document.getElementById("selectedSevasText").value = sevaText.join("\n");
  document.getElementById("selectedSaamanText").value = saamanText.join("\n");

}
document.addEventListener("DOMContentLoaded", function () {

  const sevas = document.getElementById("specialSevas");
  const saaman = document.getElementById("specialSaaman");

  if (sevas && saaman) {
    sevas.addEventListener("change", calculateSpecialAmount);
    saaman.addEventListener("change", calculateSpecialAmount);
  }

});
document.addEventListener("change", function (e) {
  if (e.target.id === "sp_gotram") {
    document.getElementById("sp_otherGotram").style.display =
      e.target.value === "Others" ? "block" : "none";
  }
});
document.addEventListener("click", function (e) {

  if (e.target.id === "specialProceedBtn") {

    const name = document.getElementById("sp_name").value.trim();
    const rashi = document.getElementById("sp_rashi").value;
    const nakshatram = document.getElementById("sp_nakshatram").value;
    const padam = document.getElementById("sp_padam").value;
    const gothramSelect = document.getElementById("sp_gotram").value;
    const otherGotram = document.getElementById("sp_otherGotram").value.trim();
    const phone = document.getElementById("sp_phone").value.trim();
    const family = document.getElementById("sp_family").value.trim();

    const sevaText = document.getElementById("selectedSevasText").value;
    const saamanText = document.getElementById("selectedSaamanText").value;

    const amount = document.getElementById("specialTotal").innerText;

    let gothram = gothramSelect === "Others" ? otherGotram : gothramSelect;

    if (!name || !rashi || !nakshatram || !padam || !gothram || !phone) {
      alert("Fill all details");
      return;
    }

    const txnId = "TXN" + Date.now();

    // 🔥 IMPORTANT: STORE MULTIPLE ITEMS
    const allItems = (sevaText + "\n" + saamanText)
      .split("\n")
      .filter(x => x.trim() !== "");

    window.bookingData = {
      name,
      phone,
      rashi,
      nakshatram,
      padam,
      gothram,
      amount,
      sevaList: allItems,   // 🔥 ARRAY
      sankalpam: family,
      txnId,
      specialDay: window.selectedSpecialDay
        ? `${window.selectedSpecialDay.telugu} (${window.selectedSpecialDay.date})`
        : "Special"
    };

    // CLOSE SPECIAL MODAL
    bootstrap.Modal.getInstance(
      document.getElementById("specialBookingModal")
    ).hide();

    // OPEN PAYMENT
   // ================= PAYMENT (COPY FROM NORMAL FLOW) =================

const upiId = "srivalli9603@oksbi";

const upiLink =
  `upi://pay?pa=${upiId}&pn=BhairavaguttaTemple&am=${amount}&cu=INR&tn=${txnId}`;

const qrUrl =
  `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

// ✅ SET QR
document.getElementById("upiQrImage").src = qrUrl;

// ✅ SET SUMMARY
document.getElementById("summaryName").innerText = name;
document.getElementById("summaryPhone").innerText = phone;
document.getElementById("summaryRasi").innerText = rashi;
document.getElementById("summaryGothram").innerText = gothram;
document.getElementById("summaryNakshatram").innerText = nakshatram;
document.getElementById("summaryPadam").innerText = padam;
document.getElementById("summarySankalpam").innerText = family;
document.getElementById("summaryAmount").innerText = "₹" + amount;
document.getElementById("txnId").innerText = txnId;

// ✅ SPECIAL DAY
document.getElementById("summarySpecialDay").innerText =
  window.selectedSpecialDay
    ? window.selectedSpecialDay.telugu + " (" + window.selectedSpecialDay.date + ")"
    : "Special";

// ✅ UPI BUTTON
document.getElementById("payNowBtn").href = upiLink;

// ================= OPEN PAYMENT =================
new bootstrap.Modal(
  document.getElementById("paymentActionModal")
).show();

  }

});