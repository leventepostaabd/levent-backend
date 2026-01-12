document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("loginModal");
  const btnOpen = document.getElementById("authorizedBtn");
  const btnClose = document.getElementById("loginClose");
  const btnSubmit = document.getElementById("loginSubmit");
  const API = "https://levent-backend-zxel.onrender.com";  // Backend URL


  // Login type değişince ilgili alanları göster/gizle
document.getElementById("loginType").addEventListener("change", function () {
  const type = this.value;

  const classBox = document.getElementById("classSelectBox");
  const companyBox = document.getElementById("companyInfo");

  if (type === "CLASS") {
    classBox.style.display = "block";
    companyBox.style.display = "none";
  } 
  else if (type === "COMPANY") {
    classBox.style.display = "none";
    companyBox.style.display = "block";
  } 
  else {
    classBox.style.display = "none";
    companyBox.style.display = "none";
  }
});

  // Modal aç
  btnOpen.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Modal kapat
  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Giriş yap
  btnSubmit.addEventListener("click", () => {

    document.getElementById("loginError").textContent = "";

    const loginType = document.getElementById("loginType").value;
    const loginPass = document.getElementById("loginPass").value;

    let selectedUser = "";

    if (loginType === "CLASS") {
      selectedUser = document.getElementById("loginClass").value;
    } 
    else if (loginType === "COMPANY") {
      selectedUser = document.getElementById("loginCompany").value;
    } 
    else if (loginType === "ADMIN") {
      selectedUser = "ADMIN";
    }

    // Backend'e istek gönder
    fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: selectedUser,
        password: loginPass
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("authorizedUser", selectedUser);
        window.location.href = "authorized.html";
      } else {
        document.getElementById("loginError").textContent =
          "Hatalı giriş bilgileri";
      }
    })
    .catch(() => {
      document.getElementById("loginError").textContent =
        "Sunucuya bağlanılamadı.";
    });

  });

});




