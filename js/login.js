document.addEventListener("DOMContentLoaded", () => {

  // Kullanıcı adı → parola eşleşmeleri
  const passwords = {
    "TP Offshore": "tp123",
    "MEDLOG": "med456",
    "Reederei NORD": "nord789",
    "Polaris": "pol999",
    "ClassNK": "nk111",
    "BV": "bv222",
    "DNV": "dnv333",
    "ADMIN": "admin2025"
  };

  const modal = document.getElementById("loginModal");
  const btnOpen = document.getElementById("btnAuthorizedLogin");
  const btnClose = document.getElementById("loginClose");
  const btnSubmit = document.getElementById("loginSubmit");

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
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    if (passwords[user] === pass) {
      // 🔥 KRİTİK NOKTA: authorizedUser kaydediliyor
      localStorage.setItem("authorizedUser", user);

      // 🔥 KRİTİK NOKTA: authorized.html'e yönlendirme
      window.location.href = "authorized.html";
    } else {
      document.getElementById("loginError").textContent =
        "Hatalı kullanıcı adı veya parola";
    }
  });

});

