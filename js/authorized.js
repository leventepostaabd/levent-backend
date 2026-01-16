const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://levent-backend-zxel.onrender.com";

// ============================================================
//  GLOBAL STATE
// ============================================================
let shipRecords = {};
let currentUser = null;
let loginType = null;
let editRecordInfo = null;
let demoMode = false;

// ============================================================
//  DEMO DATA (müşterinin gördüğü ekranla birebir aynı tasarım)
// ============================================================
const DEMO_COMPANY = "NorthWave Shipping Ltd.";
const DEMO_RECORDS = {
  [DEMO_COMPANY]: [
    {
      id: "DEMO-ACB-001",
      ship: "MV North Aurora",
      location: "Istanbul / TR",
      date: "2025-10-14",
      device: "ACB Test",
      serial: "ACB-NT-2025-001",
      pdfFilename: "DEMO-ACB-001.pdf",
      nextTest: "2026-10-14"
    },
    {
      id: "DEMO-BUS-002",
      ship: "MV North Horizon",
      location: "Hamburg / DE",
      date: "2025-09-02",
      device: "Busbar Test",
      serial: "BUS-IR-2025-110",
      pdfFilename: "DEMO-BUS-002.pdf",
      nextTest: "2026-09-02"
    },
    {
      id: "DEMO-INS-003",
      ship: "MV North Vega",
      location: "Rotterdam / NL",
      date: "2025-11-20",
      device: "Insulation & Continuity Test",
      serial: "INS-500V-2025-044",
      pdfFilename: "DEMO-INS-003.pdf",
      nextTest: "2026-11-20"
    },
    {
      id: "DEMO-THM-004",
      ship: "MV North Atlas",
      location: "Piraeus / GR",
      date: "2025-08-08",
      device: "Thermal Imaging (IR)",
      serial: "THERM-IR-2025-031",
      pdfFilename: "DEMO-THM-004.pdf",
      nextTest: "2026-08-08"
    },
    {
      id: "DEMO-ELT-005",
      ship: "MV North Delta",
      location: "Singapore / SG",
      date: "2025-12-03",
      device: "Earth Fault Loop Test",
      serial: "EFL-2025-073",
      pdfFilename: "DEMO-ELT-005.pdf",
      nextTest: "2026-12-03"
    }
  ]
};

// ============================================================
//  STATUS FUNCTION
// ============================================================
function getStatus(nextTestDate) {
  if (!nextTestDate) return { cls: "statusUnknown", label: "Unknown" };

  const today = new Date();
  const testDate = new Date(nextTestDate);

  if (testDate < today) return { cls: "statusExpired", label: "Expired" };

  const diff = testDate - today;
  const days = diff / (1000 * 60 * 60 * 24);

  if (days < 30) return { cls: "statusSoon", label: "Due Soon" };

  return { cls: "statusOK", label: "OK" };
}

// ============================================================
//  PAGE LOAD
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  demoMode = localStorage.getItem("demoMode") === "1";

  if (demoMode) {
    // Demo: müşteri dashboard'ı ile aynı sayfa, uydurma kayıtlar
    currentUser = DEMO_COMPANY;
    loginType = "COMPANY";
    shipRecords = DEMO_RECORDS;

    const demoBanner = document.getElementById("demoBanner");
    if (demoBanner) demoBanner.style.display = "block";

    // Demo'da admin panel kesinlikle görünmesin
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) adminPanel.style.display = "none";

    // Demo verileriyle başlat
    initForUser();
    initFilters();
    initDashboardTab();
  } else {
    currentUser = localStorage.getItem("authorizedUser");
    loginType = localStorage.getItem("loginType");

    if (!currentUser || !loginType) {
      window.location.href = "index.html";
      return;
    }
  }

  // CLASS / COMPANY → admin butonlarını kaldır
  if (loginType !== "ADMIN") {
    const btnNew = document.getElementById("btnNewRecord");
    if (btnNew) btnNew.remove();

    const modal = document.getElementById("recordModal");
    if (modal) modal.remove();

    const adminActionsHeader = document.getElementById("adminActionsHeader");
    if (adminActionsHeader) adminActionsHeader.style.display = "none";

    // Firma ekleme (sadece admin)
    const companyModal = document.getElementById("companyModal");
    if (companyModal) companyModal.remove();
  }

  // Kayıtları backend'den çek (demo modda çekme)
  if (!demoMode) {
    fetch(`${API_BASE}/api/getRecords`)
      .then(res => res.json())
      .then(data => {
        shipRecords = data || {};
        initForUser();
        initFilters();
        initDashboardTab();
      })
      .catch(err => {
        console.error("Kayıtlar yüklenemedi", err);
        document.getElementById("noRecords").style.display = "block";
      });
  }

  // Modal kapatma
  const btnCancel = document.getElementById("btnCancelRecord");
  if (btnCancel) btnCancel.addEventListener("click", closeRecordModal);

 let uploadedPdfFilename = ""; // PDF adını burada tutacağız

// Kaydet butonu → önce PDF upload → sonra kayıt
const btnSave = document.getElementById("btnSaveRecord");
if (btnSave) {
  btnSave.addEventListener("click", () => {
    uploadPDF((filename) => {
      if (!filename) {
        alert("PDF yüklenemedi!");
        return;
      }

      // PDF adı global değişkene yazılıyor
      uploadedPdfFilename = filename;

      // PDF başarıyla yüklendikten sonra kayıt gönder
      saveRecordFromModal();
    });
  });
}


  // Export Excel
  const btnExport = document.getElementById("btnExport");
  if (btnExport) btnExport.addEventListener("click", exportCSV);

  // Search
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", applyFilters);
  }

  // Filters
  ["filterClass", "filterType", "filterYear", "filterStatus"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", applyFilters);
  });
});

// ============================================================
//  INIT USER
// ============================================================
function initForUser() {
  const allRecords = collectRecordsForUser();
  renderTable(allRecords);

  const adminPanel = document.getElementById("adminPanel");

  if (loginType === "ADMIN") {
    adminPanel.style.display = "block";
    setupAdminPanel();
  } else {
    adminPanel.style.display = "none";
  }
}

// ============================================================
//  COLLECT RECORDS
// ============================================================
function collectRecordsForUser() {
  if (loginType === "ADMIN") {
    const all = [];
    Object.entries(shipRecords).forEach(([company, arr]) => {
      (arr || []).forEach(r => all.push({ ...r, company }));
    });
    return all;
  }

  const list = shipRecords[currentUser] || [];
  return list.map(r => ({ ...r, company: currentUser }));
}

// ============================================================
//  RENDER TABLE (QR ENTEGRE EDİLDİ)
// ============================================================
function renderTable(records) {
  const tbody = document.getElementById("recordsBody");
  const noRecordsEl = document.getElementById("noRecords");

  tbody.innerHTML = "";

  if (!records || !records.length) {
    noRecordsEl.style.display = "block";
    return;
  }

  noRecordsEl.style.display = "none";

  records.forEach(rec => {
    const tr = document.createElement("tr");
    const status = getStatus(rec.nextTest);

    tr.innerHTML = `
      <td>${rec.ship || ""}</td>
      <td>${rec.location || ""}</td>
      <td>${rec.date || ""}</td>
      <td>${rec.device || ""}</td>
      <td>${rec.serial || ""}</td>

      <td>
        ${
          rec.pdfFilename
            ? `<a href="${API_BASE}/upload/${rec.pdfFilename}" target="_blank">${rec.pdfFilename}</a>`
            : ""
        }
      </td>

      <td>${rec.nextTest || ""}</td>
      <td><span class="badgeStatus ${status.cls}">${status.label}</span></td>

      <!-- QR KOLONU -->
     <td>
  ${
    rec.id
      ? (demoMode
          ? `<a href="label-demo.html?id=${encodeURIComponent(rec.id)}" target="_blank" class="btnGhost btnTiny">Yazdır</a>`
          : `<a href="${API_BASE}/label/${rec.id}" target="_blank" class="btnGhost btnTiny">Yazdır</a>`)
      : ""
  }
</td>


      ${
        loginType === "ADMIN"
          ? `<td>
              <button class="btnGhost btnTiny" data-edit="${rec.id}" data-company="${rec.company}">Düzenle</button>
              <button class="btnGhost btnTiny" data-del="${rec.id}" data-company="${rec.company}">Sil</button>
            </td>`
          : ``
      }
    `;

    tbody.appendChild(tr);
  });

  if (loginType === "ADMIN") attachAdminRowEvents();
}

// ============================================================
//  FILTERS + SEARCH
// ============================================================
function initFilters() {
  const yearSelect = document.getElementById("filterYear");
  const all = collectRecordsForUser();

  const years = [...new Set(all.map(r => r.date?.split("-")[0]))].filter(Boolean);

  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });
}

function applyFilters() {
  let list = collectRecordsForUser();

  const q = document.getElementById("searchBox").value.toLowerCase();
  const fClass = document.getElementById("filterClass").value;
  const fType = document.getElementById("filterType").value;
  const fYear = document.getElementById("filterYear").value;
  const fStatus = document.getElementById("filterStatus").value;

  list = list.filter(r =>
    (r.ship || "").toLowerCase().includes(q) ||
    (r.location || "").toLowerCase().includes(q) ||
    (r.device || "").toLowerCase().includes(q) ||
    (r.serial || "").toLowerCase().includes(q)
  );

  if (fClass !== "ALL") list = list.filter(r => r.class === fClass);
  if (fType !== "ALL") list = list.filter(r => r.device === fType);
  if (fYear !== "ALL") list = list.filter(r => r.date?.startsWith(fYear));

  if (fStatus !== "ALL") {
    list = list.filter(r => {
      const s = getStatus(r.nextTest).label;
      if (fStatus === "OK") return s === "OK";
      if (fStatus === "SOON") return s === "Due Soon";
      if (fStatus === "EXPIRED") return s === "Expired";
    });
  }

  renderTable(list);
  updateDashboard(list);
}

// ============================================================
//  EXPORT CSV
// ============================================================
function exportCSV() {
  const rows = collectRecordsForUser();
  let csv = "Ship,Location,Date,Device,Serial,Certificate,NextTest\n";

  rows.forEach(r => {
    csv += `${r.ship},${r.location},${r.date},${r.device},${r.serial},${r.pdfFilename},${r.nextTest}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "records.csv";
  a.click();
}

// ============================================================
//  DASHBOARD
// ============================================================
let chartTypes = null;
let chartYears = null;

function initDashboardTab() {
  const tabRecords = document.getElementById("tabRecords");
  const tabDashboard = document.getElementById("tabDashboard");

  const recordsSection = document.getElementById("recordsSection");
  const dashboardSection = document.getElementById("dashboardSection");

  tabRecords.addEventListener("click", () => {
    tabRecords.classList.add("active");
    tabDashboard.classList.remove("active");
    recordsSection.style.display = "block";
    dashboardSection.style.display = "none";
  });

  tabDashboard.addEventListener("click", () => {
    tabDashboard.classList.add("active");
    tabRecords.classList.remove("active");
    recordsSection.style.display = "none";
    dashboardSection.style.display = "block";

    updateDashboard(collectRecordsForUser());
  });
}

function updateDashboard(list) {
  document.getElementById("dashTotal").textContent = list.length;
  document.getElementById("dashExpired").textContent =
    list.filter(r => getStatus(r.nextTest).label === "Expired").length;
  document.getElementById("dashSoon").textContent =
    list.filter(r => getStatus(r.nextTest).label === "Due Soon").length;

  // TYPES CHART
  const typeCounts = {};
  list.forEach(r => {
    typeCounts[r.device] = (typeCounts[r.device] || 0) + 1;
  });

  const ctx1 = document.getElementById("chartTypes");
  if (chartTypes) chartTypes.destroy();
  chartTypes = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
      }]
    }
  });

  // YEARS CHART
  const yearCounts = {};
  list.forEach(r => {
    const y = r.date?.split("-")[0];
    if (y) yearCounts[y] = (yearCounts[y] || 0) + 1;
  });

  const ctx2 = document.getElementById("chartYears");
  if (chartYears) chartYears.destroy();
  chartYears = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: Object.keys(yearCounts),
      datasets: [{
        label: "Tests",
        data: Object.values(yearCounts),
        backgroundColor: "#3b82f6"
      }]
    }
  });
}

// ============================================================
//  ADMIN PANEL
// ============================================================
function setupAdminPanel() {
  const btnNew = document.getElementById("btnNewRecord");
  if (btnNew) btnNew.addEventListener("click", () => openRecordModal("new"));
}

// ============================================================
//  MODAL
// ============================================================
function openRecordModal(mode, info = null) {
  if (loginType !== "ADMIN") return;

  editRecordInfo = null;
  document.getElementById("recordError").textContent = "";

  // Class dropdown
  const classSelect = document.getElementById("recClass");
  classSelect.innerHTML = `
    <option value="TL">TL</option>
    <option value="BV">BV</option>
    <option value="DNV">DNV</option>
    <option value="ABS">ABS</option>
    <option value="LR">LR</option>
    <option value="RINA">RINA</option>
    <option value="ClassNK">ClassNK</option>
  `;

  // Company dropdown
  const companySelect = document.getElementById("recCompany");
  companySelect.innerHTML = `
    <option value="TP Offshore">TP Offshore</option>
    <option value="MEDLOG">MEDLOG</option>
    <option value="Reederei NORD">Reederei NORD</option>
    <option value="Polaris">Polaris</option>
    <option value="Levent Marine">Levent Marine</option>
  `;

  // Device dropdown
  const deviceSelect = document.getElementById("recDevice");
  deviceSelect.innerHTML = `
    <option value="Vibration Test">Vibration Test</option>
    <option value="ACB Test">ACB Test</option>
    <option value="Busbar Test">Busbar Test</option>
    <option value="Insulation & Continuity Test">Insulation & Continuity Test</option>
    <option value="Earth Fault Loop Test">Earth Fault Loop Test</option>
    <option value="Grounding Test">Grounding Test</option>
    <option value="Thermal Imaging (IR)">Thermal Imaging (IR)</option>
    <option value="Megger Test">Megger Test</option>
    <option value="Harmonic Analysis">Harmonic Analysis</option>
    <option value="Load Test">Load Test</option>
    <option value="Fire Detection Loop Test">Fire Detection Loop Test</option>
    <option value="Bridge Equipment Power Supply Test">Bridge Equipment Power Supply Test</option>
    <option value="Service Report">Service Report</option>
  `;

  if (mode === "new") {
    document.getElementById("recordModalTitle").textContent = "Yeni Test Kaydı";
    clearRecordForm();
  } else {
    document.getElementById("recordModalTitle").textContent = "Kaydı Düzenle";
    editRecordInfo = info;
    fillRecordForm(info.company, info.id);
  }

  document.getElementById("recordModal").style.display = "flex";
}

function closeRecordModal() {
  document.getElementById("recordModal").style.display = "none";
}

// ============================================================
//  FORM
// ============================================================
function clearRecordForm() {
  document.getElementById("recCompany").value = "TP Offshore";
  document.getElementById("recShip").value = "";
  document.getElementById("recLocation").value = "";
  document.getElementById("recDate").value = "";
  document.getElementById("recDevice").value = "";
  document.getElementById("recSerial").value = "";
  document.getElementById("recCert").value = "";
  document.getElementById("recNextTest").value = "";
  const fileInput = document.getElementById("pdfUpload");
  if (fileInput) fileInput.value = "";
}

function fillRecordForm(company, id) {
  const list = shipRecords[company] || [];
  const rec = list.find(r => r.id === id);
  if (!rec) return;

  document.getElementById("recCompany").value = company;
  document.getElementById("recShip").value = rec.ship || "";
  document.getElementById("recLocation").value = rec.location || "";
  document.getElementById("recDate").value = rec.date || "";
  document.getElementById("recDevice").value = rec.device || "";
  document.getElementById("recSerial").value = rec.serial || "";
  document.getElementById("recCert").value = rec.pdfFilename || "";
  document.getElementById("recNextTest").value = rec.nextTest || "";
}

// ============================================================
//  SAVE RECORD (QR SİSTEMİNE TAM UYUMLU - FINAL)
// ============================================================
function saveRecordFromModal() {
  if (loginType !== "ADMIN") return;

  const company = document.getElementById("recCompany").value;
  const ship = document.getElementById("recShip").value.trim();
  const location = document.getElementById("recLocation").value.trim();
  const date = document.getElementById("recDate").value;
  const device = document.getElementById("recDevice").value.trim();
  const serial = document.getElementById("recSerial").value.trim();
  const nextTest = document.getElementById("recNextTest").value;

  // PDF adı artık input'tan değil → uploadPDF'ten geliyor
  const pdfFilename = uploadedPdfFilename;

  if (!ship || !date || !device) {
    document.getElementById("recordError").textContent =
      "Gemi adı, test tarihi ve cihaz alanları zorunludur.";
    return;
  }

  const record = {
    ship,
    location,
    date,
    device,
    serial,
    pdfFilename,
    nextTest
  };

  console.log("GÖNDERİLEN RECORD:", record);

  fetch(`${API_BASE}/api/saveRecord`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, record })
  })
    .then(res => res.json())
    .then(data => {
      console.log("BACKEND'DEN GELEN DATA:", data);
      if (!shipRecords[company]) shipRecords[company] = [];
      shipRecords[company].push(data.record);

      renderTable(collectRecordsForUser());
      closeRecordModal();
    })
    .catch(err => {
      console.error("Kayıt kaydedilemedi", err);
      document.getElementById("recordError").textContent =
        "Kayıt kaydedilirken bir hata oluştu.";
    });
}

// ============================================================
//  DELETE RECORD
// ============================================================
function deleteRecord(company, id) {
  if (loginType !== "ADMIN") return;

  if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

  fetch(`${API_BASE}/api/deleteRecord`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, id })
  })
    .then(res => res.json())
    .then(() => {
      shipRecords[company] = (shipRecords[company] || []).filter(r => r.id !== id);
      renderTable(collectRecordsForUser());
    })
    .catch(err => {
      console.error("Kayıt silinemedi", err);
      alert("Kayıt silinirken bir hata oluştu.");
    });
}

// ============================================================
//  PDF UPLOAD (FINAL)
// ============================================================
function uploadPDF(callback) {
  const fileInput = document.getElementById("pdfUpload");
  if (!fileInput || !fileInput.files.length) {
    callback(null);
    return;
  }

  const formData = new FormData();
  formData.append("pdf", fileInput.files[0]);

  fetch(`${API_BASE}/api/uploadCert`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log("UPLOAD RESPONSE:", data);

      // ⭐ KRİTİK SATIR — EKSİK OLAN BUYDU
      uploadedPdfFilename = data.filename;

      callback(data.filename);
    })
    .catch(err => {
      console.error("PDF yüklenemedi", err);
      callback(null);
    });
}

// ============================================================
//  ADMIN ROW EVENTS (EDIT / DELETE)
// ============================================================
function attachAdminRowEvents() {
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const company = btn.getAttribute("data-company");
      openRecordModal("edit", { id, company });
    });
  });

  document.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const company = btn.getAttribute("data-company");
      deleteRecord(company, id);
    });
  });
}

// ============================================================
//  PDF PREVIEW — YENİ PENCEREDE AÇILIR
// ============================================================
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.closest("td")) {
    const href = e.target.getAttribute("href");

    if (href && href.includes("/upload/")) {
      e.preventDefault();
      openPDFWindow(href);
    }
  }
});

function openPDFWindow(url) {
  const win = window.open("", "_blank", "width=900,height=700");

  win.document.write(`
    <html>
      <head>
        <title>PDF Preview</title>
      </head>
      <body style="margin:0; padding:0; background:#111; color:white; font-family:sans-serif;">
        
        <div style="padding:10px; text-align:right;">
          <button onclick="document.getElementById('pdfFrame').contentWindow.print()" 
                  style="padding:8px 14px; font-size:14px; cursor:pointer;">
            Print PDF
          </button>
        </div>

        <iframe id="pdfFrame" src="${url}" 
                style="width:100%; height:90vh; border:none;"></iframe>

      </body>
    </html>
  `);
}

// ============================================================
//  COMPANY MODAL
// ============================================================
document.getElementById("btnAddCompany").addEventListener("click", () => {
  document.getElementById("companyModal").style.display = "flex";
});

document.getElementById("btnSaveCompany").addEventListener("click", () => {
  const name = document.getElementById("newCompanyName").value.trim();

  if (!name) {
    document.getElementById("companyError").textContent = "Firma adı boş olamaz.";
    return;
  }

  const sel = document.getElementById("recCompany");
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  sel.appendChild(opt);
  sel.value = name;

  document.getElementById("companyModal").style.display = "none";
  document.getElementById("newCompanyName").value = "";
  document.getElementById("companyError").textContent = "";
});

document.getElementById("btnCancelCompany").addEventListener("click", () => {
  document.getElementById("companyModal").style.display = "none";
});


