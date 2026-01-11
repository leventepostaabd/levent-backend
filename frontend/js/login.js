document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("loginModal");
  const btnOpen = document.getElementById("btnAuthorizedLogin");
  const btnClose = document.getElementById("loginClose");
  const btnSubmit = document.getElementById("loginSubmit");

  const loginType = document.getElementById("loginType");
  const classSelectBox = document.getElementById("classSelectBox");
  const loginClass = document.getElementById("loginClass");
  const companyInfo = document.getElementById("companyInfo");

  // Modal aç
  btnOpen.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Modal kapat
  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Giriş türü değişince alanları göster/gizle
  loginType.addEventListener("change", () => {
    const type = loginType.value;

    if (type === "CLASS") {
      classSelectBox.style.display = "block";
      companyInfo.style.display = "none";
    } 
    else if (type === "COMPANY") {
      classSelectBox.style.display = "none";
      companyInfo.style.display = "block";
    } 
    else {
      classSelectBox.style.display = "none";
      companyInfo.style.display = "none";
    }
  });

  // Giriş yap
  btnSubmit.addEventListener("click", () => {
    const type = loginType.value;
    const password = document.getElementById("loginPass").value;

    let payload = {};

    if (type === "CLASS") {
      payload = {
        type: "CLASS",
        name: loginClass.value,
        password
      };
    }

    if (type === "COMPANY") {
      payload = {
        type: "COMPANY",
        password
      };
    }

    if (type === "ADMIN") {
      payload = {
        type: "ADMIN",
        password
      };
    }

    // Backend login isteği
    fetch("https://levent-backend-zxel.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          document.getElementById("loginError").textContent =
            "Hatalı giriş bilgileri";
          return;
        }

        // Giriş başarılı → role + userName kaydet
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.name);

        // authorized.html'e yönlendir
        window.location.href = "authorized.html";
      })
      .catch(err => {
        console.error("Login error:", err);
        document.getElementById("loginError").textContent =
          "Sunucuya bağlanılamadı.";
      });
  });

});


