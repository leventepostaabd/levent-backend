document.addEventListener("DOMContentLoaded", () => {

    const authorizedBtn = document.getElementById("authorizedBtn");
    const loginModal = document.getElementById("loginModal");

    // Modal aç
    authorizedBtn.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });

    const loginTypeEl = document.getElementById("loginType");
    const classSelectBox = document.getElementById("classSelectBox");
    const companySelectBox = document.getElementById("companySelectBox");
    const loginClassEl = document.getElementById("loginClass");
    const loginCompanyEl = document.getElementById("loginCompany");
    const loginPassEl = document.getElementById("loginPass");
    const loginErrorEl = document.getElementById("loginError");
    const loginSubmit = document.getElementById("loginSubmit");
    const loginClose = document.getElementById("loginClose");

    // Giriş türü değişince ilgili alanları göster/gizle
    loginTypeEl.addEventListener("change", () => {
        const type = loginTypeEl.value;

        if (type === "CLASS") {
            classSelectBox.style.display = "block";
            companySelectBox.style.display = "none";
        } 
        else if (type === "COMPANY") {
            classSelectBox.style.display = "none";
            companySelectBox.style.display = "block";
        } 
        else {
            classSelectBox.style.display = "none";
            companySelectBox.style.display = "none";
        }
    });

    // Modal kapatma
    loginClose.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    // Giriş butonu
    loginSubmit.addEventListener("click", () => {
        const type = loginTypeEl.value;
        const pass = loginPassEl.value.trim();
        let selectedUser = null;

        loginErrorEl.textContent = ""; // eski hatayı temizle

        // CLASS LOGIN
        if (type === "CLASS") {
            selectedUser = loginClassEl.value;
            if (pass !== "class2025") {
                loginErrorEl.textContent = "Hatalı parola.";
                return;
            }
        }

        // COMPANY LOGIN
        else if (type === "COMPANY") {
            selectedUser = loginCompanyEl.value;
            if (pass !== "company2025") {
                loginErrorEl.textContent = "Hatalı parola.";
                return;
            }
        }

        // ADMIN LOGIN
        else if (type === "ADMIN") {
            selectedUser = "ADMIN";
            if (pass !== "admin2025") {
                loginErrorEl.textContent = "Hatalı parola.";
                return;
            }
        }

        // Başarılı giriş → bilgileri kaydet
        localStorage.setItem("authorizedUser", selectedUser);
        localStorage.setItem("loginType", type);

        // Modal kapat
        loginModal.style.display = "none";

        // Yönlendir
        window.location.href = "authorized.html";
    });

});
