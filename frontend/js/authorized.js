// js/authorized.js

let role = localStorage.getItem("role");
let userName = localStorage.getItem("userName");
let shipRecords = {};
let editRecordInfo = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!role || !userName) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("recordsUser").textContent =
    `Authorized account: ${userName} (${role})`;

  fetch("https://levent-backend-zxel.onrender.com/api/getRecords")
    .then(res => res.json())
    .then(data => {
      shipRecords = data || {};
      applyRoleFilter();
      if (role === "ADMIN") setupAdminPanel();
    })
    .catch(err => {
      console.error("Kayıtlar yüklenemedi", err);
      document.getElementById("noRecords").style.display = "block";
    });

  const btnCancel = document.getElementById("btnCancelRecord");
  if (btnCancel) btnCancel.addEventListener("click", closeRecordModal);

  const btnSave = document.getElementById("btnSaveRecord");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      uploadPDF((filename) => {
        if (filename) document.getElementById("recCert").value = filename;
        saveRecordFromModal();
      });
    });
  }
});

function applyRoleFilter() {
  let filtered = [];

  if (role === "ADMIN") {
    Object.entries(shipRecords).forEach(([company, arr]) => {
      arr.forEach(r => filtered.push({ ...r, company }));
    });
  }

  if (role === "CLASS") {
    Object.entries(shipRecords).forEach(([company, arr]) => {
      arr.forEach(r => {
        if (r.class === userName) {
          filtered.push({ ...r, company });
        }
      });
    });
  }

  if (role === "COMPANY") {
    const list = shipRecords[userName] || [];
    list.forEach(r => filtered.push({ ...r, company: userName }));
  }

  renderTable(filtered);
}

function getStatus(nextTest) {
  if (!nextTest) return { label: "N/A", cls: "badge-ok" };

  const today = new Date();
  const next = new Date(nextTest);
  const diffDays = Math.round((next - today) / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) return { label: "N/A", cls: "badge-ok" };
  if (diffDays < 0) return { label: "Overdue", cls: "badge-overdue" };
  if (diffDays <= 60) return { label: "Due soon", cls: "badge-soon" };
  return { label: "OK", cls: "badge-ok" };
}

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
      <td>${rec.certificate ? `<a href="uploads/${rec.certificate}" target="_blank">${rec.certificate}</a>` : ""}</td>
      <td>${rec.nextTest || ""}</td>
      <td><span class="badgeStatus ${status.cls}">${status.label}</span></td>
      ${
        role === "ADMIN"
          ? `<td>
              <button class="btnGhost btnTiny" data-edit="${rec.id}" data-company="${rec.company}">Düzenle</button>
              <button class="btnGhost btnTiny" data-del="${rec.id}" data-company="${rec.company}">Sil</button>
            </td>`
          : ``
      }
    `;

    tbody.appendChild(tr);
  });

  if (role === "ADMIN") attachAdminRowEvents();
}

function setupAdminPanel() {
  const panel = document.getElementById("adminPanel");
  if (panel) panel.style.display = "block";

  const btnNew = document.getElementById("btnNewRecord");
  if (btnNew) btnNew.addEventListener("click", () => openRecordModal("new"));
}

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

function clearRecordForm() {
  document.getElementById("recCompany").value = "TP Offshore";
  document.getElementById("recClass").value = "TL";
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
  document.getElementById("recClass").value = rec.class || "TL";
  document.getElementById("recShip").value = rec.ship || "";
  document.getElementById("recLocation").value = rec.location || "";
  document.getElementById("recDate").value = rec.date || "";
  document.getElementById("recDevice").value = rec.device || "";
  document.getElementById("recSerial").value = rec.serial || "";
  document.getElementById("recCert").value = rec.certificate || "";
  document.getElementById("recNextTest").value = rec.nextTest || "";
}

function saveRecordFromModal() {
  const company = document.getElementById("recCompany").value;
  const recClass = document.getElementById("recClass").value;
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
    class: recClass,
    ship,
    location,
    date,
    device,
    serial,
    certificate: cert,
    nextTest
  };

  fetch("https://levent-backend-zxel.onrender.com/api/saveRecord", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, record: newRecord })
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
      applyRoleFilter();
      closeRecordModal();
    })
    .catch(err => {
      console.error("Kayıt kaydedilemedi", err);
      document.getElementById("recordError").textContent =
        "Kayıt kaydedilirken bir hata oluştu.";
    });
}

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
      applyRoleFilter();
    })
    .catch(err => {
      console.error("Kayıt silinemedi", err);
      alert("Kayıt silinirken bir hata oluştu.");
    });
}

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
    .then(data => callback(data.filename))
    .catch(err => {
      console.error("PDF yüklenemedi", err);
      callback(null);
    });
}
