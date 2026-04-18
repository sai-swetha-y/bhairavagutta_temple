// =========================
// CONFIG
// =========================
const ADMIN_PASSWORD = "temple123";
const API = "https://script.google.com/macros/s/AKfycbwXuVRkTUwgLgwrfKgczBbeZ-32zelv3goMlZChKAPSYmW1BG-OUcbBmyDEV1j98Act/exec?type=admin";

let allData = [];
let chartInstance;

// =========================
// INIT
// =========================
window.addEventListener("DOMContentLoaded", () => {

  // ✅ SESSION CHECK
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    document.getElementById("loginScreen").style.display = "none";
    loadData();
  }

  // LOGIN BUTTON
  document.getElementById("loginBtn").onclick = handleLogin;

  // ✅ ENTER KEY SUPPORT
  document.getElementById("adminPassword").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
  });

  // LOGOUT BUTTON
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = logout;

  // FILTER EVENTS (unchanged)
  document.getElementById("searchInput").addEventListener("input", applyFilter);
  document.getElementById("applyFilter").addEventListener("click", applyFilter);
  document.getElementById("statusFilter").addEventListener("change", applyFilter);
  document.getElementById("dayFilter").addEventListener("change", applyFilter);
  document.getElementById("fromDate").addEventListener("change", applyFilter);
  document.getElementById("toDate").addEventListener("change", applyFilter);

  document.getElementById("exportBtn").onclick = exportCSV;
});
// =========================
// LOAD DATA
// =========================
async function loadData() {
  const res = await fetch(API);
  const data = await res.json();

  allData = data;

  renderTable(data);
  calculateStats(data);
  renderChart(data);
}

// =========================
// HIGHLIGHT FUNCTION
// =========================
function highlight(text, search) {

  const safeText = String(text || "");

  if (!search) return safeText;

  const regex = new RegExp(`(${search})`, "gi");
  return safeText.replace(regex, `<span style="background:gold;color:black;">$1</span>`);
}
// =========================
// TABLE
// =========================
function renderTable(data) {

  const tbody = document.getElementById("tableBody");
  const matchCount = document.getElementById("matchCount");
if (matchCount) {
  matchCount.innerText = "Results: " + data.length;
}
  const searchValue = document.getElementById("searchInput")?.value || "";

  tbody.innerHTML = "";
  matchCount.innerText = "Results: " + data.length;

  // 🔥 GROUP BY PHONE
  const grouped = {};

  data.forEach(row => {
    const phone = String(row.Phone || "Unknown");

    if (!grouped[phone]) grouped[phone] = [];
    grouped[phone].push(row);
  });

  Object.keys(grouped).forEach(phone => {

    const rows = grouped[phone];

    // SORT LATEST FIRST
    rows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

    let total = rows.reduce((sum, r) => sum + Number(r.Amount || 0), 0);

    const groupId = "group_" + phone;

    // 🔥 GROUP HEADER
    tbody.innerHTML += `
      <tr class="group-row" onclick="toggleGroup('${groupId}')">
        <td class="sticky-col">${rows[0].Name || "-"}</td>
        <td class="sticky-col second">${phone}</td>
        <td colspan="8">
          ${rows.length} bookings • ₹${total}
        </td>
      </tr>
    `;

    // 🔥 CHILD ROWS
    rows.forEach(row => {

      const utr = String(row.UTR || "");
      const status = row.Status || "PAID";
      const safeRow = JSON.stringify(row).replace(/'/g, "&apos;");

      tbody.innerHTML += `
        <tr class="child-row ${groupId}" style="display:none;">

          <td class="sticky-col">${highlight(row.Name || "", searchValue)}</td>

          <td class="sticky-col second">
            <span onclick='openPopup(${safeRow})'
              style="cursor:pointer;color:gold;">
              ${row.Phone}
            </span>
          </td>

          <td>${row.Gothram || "-"}</td>
          <td>${highlight(row.Seva || "", searchValue)}</td>
          <td>₹${row.Amount || 0}</td>

          <td>
            ${highlight(utr, searchValue)}
            ${utr ? `<button onclick="copyUTR('${utr}')" class="copy-btn">📋</button>` : ""}
          </td>

          <td>${row["Special Day"] || "Normal"}</td>

          <td>
            <span class="${status === 'VERIFIED' ? 'status-verified' : 'status-pending'}">
              ${status}
            </span>
          </td>

          <td>${new Date(row.Timestamp).toLocaleString()}</td>

          <td>
            ${
              status === "VERIFIED"
                ? "✔"
                : (utr
                    ? `<button onclick="verifyPayment('${utr}')" class="btn btn-success btn-sm">Verify</button>`
                    : "-")
            }
          </td>

        </tr>
      `;
    });

  });
}
// =========================
// STATS
// =========================
function calculateStats(data) {

  let total = data.length;
  let revenue = 0;
  let today = 0;

  let verified = data.filter(r => r.Status === "VERIFIED").length;
  let pending = data.filter(r => (r.Status || "PAID") === "PAID").length;

  const todayDate = new Date().toDateString();

  data.forEach(row => {
    revenue += Number(row.Amount || 0);

    if (new Date(row.Timestamp).toDateString() === todayDate) {
      today++;
    }
  });

  document.getElementById("total").innerText = total;
  document.getElementById("revenue").innerText = revenue;
  document.getElementById("today").innerText = today;
  document.getElementById("verifiedCount").innerText = verified;
  document.getElementById("pendingCount").innerText = pending;
}

// =========================
// CHART
// =========================
function renderChart(data) {

  if (chartInstance) chartInstance.destroy();

  const grouped = {};

  data.forEach(row => {
    const d = new Date(row.Timestamp).toLocaleDateString();
    grouped[d] = (grouped[d] || 0) + Number(row.Amount || 0);
  });

  chartInstance = new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: Object.keys(grouped),
      datasets: [{
        label: "Revenue",
        data: Object.values(grouped),
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    }
  });
}

// =========================
// FILTER (FULLY WORKING)
// =========================
function applyFilter() {

  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const statusFilter = document.getElementById("statusFilter").value;
  const dayFilter = document.getElementById("dayFilter").value.toLowerCase();
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const filtered = allData.filter(row => {

    const name = String(row.Name || "").toLowerCase().toLowerCase();
    const phone = String(row.Phone || "").toString();
    const seva = String(row.Seva || "").toLowerCase().toLowerCase();
    const utr = String(row.UTR || "").toLowerCase();
    const status = String(row.Status || "PAID").toUpperCase();
    const special = String(row["Special Day"] || "").toLowerCase().toLowerCase();

    const date = row.Timestamp ? new Date(row.Timestamp) : null;

    let searchMatch = true;
    if (search) {
      searchMatch =
        name.includes(search) ||
        phone.includes(search) ||
        seva.includes(search) ||
        utr.includes(search);
    }

    let statusMatch = true;
    if (statusFilter) {
      statusMatch = status === statusFilter;
    }

    let dayMatch = true;
if (dayFilter) {

  const map = {
    amavasya: ["amavasya", "అమావాస్య"],
    trayodashi: ["trayodashi", "త్రయోదశి"]
  };

  const keywords = map[dayFilter] || [dayFilter];

  dayMatch = keywords.some(k => special.includes(k));
}

    let dateMatch = true;
    if (date) {

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0,0,0,0);
        dateMatch = dateMatch && date >= fromDate;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23,59,59,999);
        dateMatch = dateMatch && date <= toDate;
      }
    }

    return searchMatch && statusMatch && dayMatch && dateMatch;
  });

  renderTable(filtered);
  calculateStats(filtered);
  renderChart(filtered);
}

// =========================
// EXPORT
// =========================
function exportCSV() {

  let csv = [];
  const headers = Object.keys(allData[0] || {});
  csv.push(headers.join(","));

  allData.forEach(row => {
    csv.push(headers.map(h => `"${row[h] || ""}"`).join(","));
  });

  const blob = new Blob([csv.join("\n")]);

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "bookings.csv";
  a.click();
}

// =========================
// COPY UTR
// =========================
function copyUTR(value) {
  navigator.clipboard.writeText(value);
  alert("Copied: " + value);
}

// =========================
// VERIFY
// =========================
async function verifyPayment(utr) {

  if (!confirm("Verify payment?")) return;

  const res = await fetch("https://script.google.com/macros/s/AKfycbwXuVRkTUwgLgwrfKgczBbeZ-32zelv3goMlZChKAPSYmW1BG-OUcbBmyDEV1j98Act/exec", {
    method: "POST",
    body: new URLSearchParams({
      action: "verify",
      utr: utr
    })
  });

  const data = await res.json();

  if (data.status === "VERIFIED_SUCCESS") {

    const msg = `Dear ${data.name}, your seva is verified. Amount ₹${data.amount}`;

    window.open(`https://wa.me/91${data.phone}?text=${encodeURIComponent(msg)}`);

    loadData();
  }
}

// =========================
// POPUP
// =========================
function openPopup(row) {

  const phone = String(row.Phone || "");

  const records = allData.filter(r => String(r.Phone) === phone);

  let totalAmount = 0;

  let tableRows = records.map(r => {

    totalAmount += Number(r.Amount || 0);

    return `
      <tr>
        <td>${r.Name || "-"}</td>
        <td>${r.Gothram || "-"}</td>
        <td>${r.Seva || "-"}</td>
        <td>₹${r.Amount || 0}</td>
        <td>${r["Special Day"] || "Normal"}</td>
        <td>${r.Status || "PAID"}</td>
        <td>${new Date(r.Timestamp).toLocaleString()}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("popupContent").innerHTML = `

    <div class="popup-summary">
      <div><b>📞 Phone:</b> ${phone}</div>
      <div><b>💰 Total Paid:</b> ₹${totalAmount}</div>
      <div><b>📊 Transactions:</b> ${records.length}</div>
    </div>

    <div class="popup-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gothram</th>
            <th>Seva</th>
            <th>Amount</th>
            <th>Day</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

  `;

  document.getElementById("devoteePopup").style.display = "flex";
}
function closePopup() {
  document.getElementById("devoteePopup").style.display = "none";
}
function handleLogin() {

  const val = document.getElementById("adminPassword").value;

  if (val === ADMIN_PASSWORD) {

    // ✅ SAVE SESSION
    localStorage.setItem("isAdminLoggedIn", "true");

    document.getElementById("loginScreen").style.display = "none";
    loadData();

  } else {
    alert("Wrong password");
  }
}
function logout() {

  // ❌ CLEAR SESSION
  localStorage.removeItem("isAdminLoggedIn");

  // SHOW LOGIN SCREEN
  document.getElementById("loginScreen").style.display = "flex";

  // OPTIONAL RESET
  document.getElementById("adminPassword").value = "";
}
function toggleGroup(groupId) {

  const rows = document.querySelectorAll("." + groupId);

  rows.forEach(row => {
    row.style.display = (row.style.display === "none") ? "" : "none";
  });
}
