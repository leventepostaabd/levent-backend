// js/authorized.js

let shipRecords = {};
let currentUser = null;
let editRecordInfo = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1) Giriş kontrolü
  currentUser = localStorage.getItem("authorizedUser");
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  // 2) Kullanıcı adını başlığa yaz
  const userEl = document.getElementById("recordsUser");
  if (userEl) {
    userEl.textContent = `Authorized account: ${currentUser}`;
  }

  // 3) Kayıtları backend'den çek
  fetch("https://levent-backend-zxel.onrender.com/api/getRecords")
    .then(res => res.json())
    .then(data => {
      shipRecords = data || {};
      initForUser();
    })
    .catch(err => {
      console.error("Kayıtlar yüklenemedi", err);
      document.getElementById("noRecords").style.display = "block";
    });

  // 4) Modal butonları (iptal)
  const btnCancel = document.getElementById("btnCancelRecord");
  if (btnCancel) {
    btnCancel.addEventListener("click", closeRecordModal);
  }

  // 5) Kaydet butonu → önce PDF upload, sonra kayıt kaydet
  const btnSave = document.getElementById("btnSaveRecord");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      uploadPDF((filename) => {
        if (filename) {
          document.getElementById("recCert").value = filename;
        }
        saveRecordFromModal();
      });
    });
  }
});

// Kullanıcıya göre başlangıç
function initForUser() {
  const allRecords = collectRecordsForUser(currentUser);
  renderTable(allRecords);

  if (currentUser === "ADMIN") {
    setupAdminPanel();
  }
}

// Sadece ilgili kullanıcının göreceği kayıtları topla
function collectRecordsForUser(user) {
  if (user === "ADMIN") {
    const all = [];
    Object.entries(shipRecords).forEach(([company, arr]) => {
      (arr || []).forEach(r => all.push({ ...r, company }));
    });
    return all;
  }

  const list = shipRecords[user] || [];
  return (list || []).map(r => ({ ...r, company: user }));
}

// Tarih durumunu hesapla
function getStatus(nextTest) {
  if (!nextTest) {
    return { label: "N/A", cls: "badge-ok" };
  }

  const today = new Date();
  const next = new Date(nextTest);
  const diffDays = Math.round((next - today) / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) {
    return { label: "N/A", cls: "badge-ok" };
  }

  if (diffDays < 0) {
    return { label: "Overdue", cls: "badge-overdue" };
  } else if (diffDays <= 60) {
    return { label: "Due soon", cls: "badge-soon" };
  }
  return { label: "OK", cls: "badge-ok" };
}

// Tabloyu doldur
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
      <td>${
        rec.certificate
          ? `<a href="uploads/${rec.certificate}" target="_blank">${rec.certificate}</a>`
          : ""
      }</td>
      <td>${rec.nextTest || ""}</td>
      <td><span class="badgeStatus ${status.cls}">${status.label}</span></td>
      ${
        currentUser === "ADMIN"
          ? `<td>
              <button class="btnGhost btnTiny" data-edit="${rec.id}" data-company="${rec.company}">Düzenle</button>
              <button class="btnGhost btnTiny" data-del="${rec.id}" data-company="${rec.company}">Sil</button>
            </td>`
          : ``
      }
    `;

    tbody.appendChild(tr);
  });

  if (currentUser === "ADMIN") {
    attachAdminRowEvents();
  }
}

// Admin panelini aç
function setupAdminPanel() {
  const panel = document.getElementById("adminPanel");
  if (panel) panel.style.display = "block";

  const btnNew = document.getElementById("btnNewRecord");
  if (btnNew) {
    btnNew.addEventListener("click", () => openRecordModal("new"));
  }
}

// Satır butonlarına event bağla (Düzenle / Sil)
function attachAdminRowEvents() {
  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const company = btn.getAttribute("data-company");
      openRecordModal("edit", { company, id });
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

// Modal aç/kapat
function openRecordModal(mode, info = null) {
  editRecordInfo = null;
  document.getElementById("recordError").textContent = "";

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

// Form temizle
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

// Formu doldur (düzenleme için)
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
  document.getElementById("recCert").value = rec.certificate || "";
  document.getElementById("recNextTest").value = rec.nextTest || "";
}

// Kayıt kaydet (yeni veya düzenleme) → BACKEND'E POST
function saveRecordFromModal() {
  const company = document.getElementById("recCompany").value;
  const ship = document.getElementById("recShip").value.trim();
  const location = document.getElementById("recLocation").value.trim();
  const date = document.getElementById("recDate").value;
  const device = document.getElementById("recDevice").value.trim();
  const serial = document.getElementById("recSerial").value.trim();
  const cert = document.getElementById("recCert").value.trim();
  const nextTest = document.getElementById("recNextTest").value;

  if (!ship || !date || !device) {
    document.getElementById("recordError").textContent =
      "Gemi adı, test tarihi ve cihaz alanları zorunludur.";
    return;
  }

  const newRecord = {
    id: editRecordInfo ? editRecordInfo.id : company + "-" + Date.now(),
    ship,
    location,
    date,
    device,
    serial,
    certificate: cert,
    nextTest
  };

  const url = "https://levent-backend-zxel.onrender.com/api/saveRecord";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company,
      record: newRecord
    })
  })
    .then(res => res.json())
    .then(() => {
      if (!shipRecords[company]) shipRecords[company] = [];
      const list = shipRecords[company];

      if (editRecordInfo) {
        const idx = list.findIndex(r => r.id === editRecordInfo.id);
        if (idx !== -1) list[idx] = newRecord;
      } else {
        list.push(newRecord);
      }

      shipRecords[company] = list;
      renderTable(collectRecordsForUser(currentUser));
      closeRecordModal();
    })
    .catch(err => {
      console.error("Kayıt kaydedilemedi", err);
      document.getElementById("recordError").textContent =
        "Kayıt kaydedilirken bir hata oluştu.";
    });
}

// Kayıt sil → BACKEND'E POST
function deleteRecord(company, id) {
  if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

  fetch("https://levent-backend-zxel.onrender.com/api/deleteRecord", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, id })
  })
    .then(res => res.json())
    .then(() => {
      shipRecords[company] = (shipRecords[company] || []).filter(r => r.id !== id);
      renderTable(collectRecordsForUser(currentUser));
    })
    .catch(err => {
      console.error("Kayıt silinemedi", err);
      alert("Kayıt silinirken bir hata oluştu.");
    });
}

// PDF upload → BACKEND'E GÖNDER
function uploadPDF(callback) {
  const fileInput = document.getElementById("pdfUpload");
  if (!fileInput || !fileInput.files.length) {
    callback(null);
    return;
  }

  const formData = new FormData();
  formData.append("pdf", fileInput.files[0]);

  fetch("https://levent-backend-zxel.onrender.com/api/uploadCert", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      callback(data.filename);
    })
    .catch(err => {
      console.error("PDF yüklenemedi", err);
      callback(null);
    });
}
