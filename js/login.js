document.addEventListener("DOMContentLoaded", () => {

  // Parola eşleşmeleri
  const passwords = {
    "TL": "tl123",
    "BV": "bv222",
    "DNV": "dnv333",
    "ABS": "abs444",
    "LR": "lr555",
    "RINA": "rina666",
    "ClassNK": "nk111",

    // Company Representative → sadece şifre ile belirleniyor
    "COMPANY": "company2025",

    // Admin
    "ADMIN": "admin2025"
  };

  const modal = document.getElementById("loginModal");
  const btnSubmit = document.getElementById("loginSubmit");
  const btnClose = document.getElementById("loginClose");

  // Modal kapat
  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Giriş yap
  btnSubmit.addEventListener("click", () => {
    const loginType = document.getElementById("loginType").value;
    const loginPass = document.getElementById("loginPass").value;

    let selectedUser = "";

    if (loginType === "CLASS") {
      selectedUser = document.getElementById("loginClass").value;
    } 
    else if (loginType === "COMPANY") {
      selectedUser = "COMPANY";
    } 
    else if (loginType === "ADMIN") {
      selectedUser = "ADMIN";
    }

    // Parola kontrolü
    if (passwords[selectedUser] === loginPass) {

      // Yetkili kullanıcıyı kaydet
      localStorage.setItem("authorizedUser", selectedUser);

      // authorized.html'e yönlendir
      window.location.href = "authorized.html";

    } else {
      document.getElementById("loginError").textContent =
        "Hatalı parola. Lütfen tekrar deneyin.";
    }
  });

});

