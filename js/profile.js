document.addEventListener("DOMContentLoaded", () => {

  const profileTranslations = {

    /* =========================
       TÜRKÇE
    ========================== */
    tr: {
      profile_title: "Profesyonel Arka Plan & Yeterlilikler",

      profile_background_title: "Profesyonel Arka Plan",
      profile_background_text: `
      Levent Marine Electro-Technical Services, 2000 yılından itibaren denizcilik sektöründe edinilen bireysel ETO (Electro-Technical Officer) tecrübesinin, offshore ve ticari gemilerde yürütülen teknik servis, arıza tespiti, bakım ve denetim süreçlerinin 2025 yılında kurumsal bir yapıya dönüştürülmesiyle kurulmuştur.<br><br>
      Kurucu ETO olarak; bulk carrier, offshore ve container gemilerinde uzun yıllar görev alınmış, sonrasında superintend ve teknik servis sorumlulukları üstlenilmiştir. Bu süreçte birçok uluslararası armatör ve teknik işletme firmasıyla çalışılmış, güvene dayalı uzun süreli iş ilişkileri geliştirilmiştir.<br><br>
      2025 yılı itibarıyla şirket, özellikle marine elektrik alanında class odaklı test, ölçüm ve sertifikasyon hizmetlerine yoğunlaşmış; teknik tecrübe, kalibrasyonlu test cihazları ve uluslararası geçerliliğe sahip sertifikalarla desteklenen profesyonel bir hizmet yapısı oluşturmuştur.
      `,

      profile_companies_title: "Çalışılan Firmalar",

      profile_cert_title: "Sertifikalar & Yeterlilikler",

      profile_cert_core: "Temel Sertifikasyon",
      profile_cert_core_text: "Electro-Technical Officer (ETO) — STCW Reg. III/6",

      profile_cert_academic: "Akademik Yeterlilik",
      profile_cert_academic_text: "Kontrol Sistemleri Teknolojisi — Üniversite Derecesi",

      profile_cert_special: "Özel Tanınma",
      profile_cert_special_text: "Mavi Vatan Hizmet Belgesi — TP Offshore tarafından verilmiştir",

      profile_cert_tech: "Teknik & Emniyet Sertifikaları",

      profile_back_btn: "← Ana Sayfaya Dön"
    },

    /* =========================
       ENGLISH
    ========================== */
    en: {
      profile_title: "Professional Background & Qualifications",

      profile_background_title: "Professional Background",
      profile_background_text: `
      Levent Marine Electro-Technical Services was established in 2025 as the corporate continuation of a professional journey that began in 2000, built on extensive experience as an Electro-Technical Officer (ETO) across bulk carriers, offshore vessels and container ships.<br><br>
      Throughout this period, responsibilities included troubleshooting, maintenance, commissioning, electrical safety testing, and later superintendent-level technical oversight. Long-term collaborations with reputable shipowners and technical management companies have shaped a strong foundation of trust and operational excellence.<br><br>
      As of 2025, the company focuses primarily on class-oriented marine electrical testing, measurement and certification services, supported by calibrated test equipment, documented procedures and internationally recognized technical qualifications.
      `,

      profile_companies_title: "Companies Served",

      profile_cert_title: "Certifications & Qualifications",

      profile_cert_core: "Core Certification",
      profile_cert_core_text: "Electro-Technical Officer (ETO) — STCW Reg. III/6",

      profile_cert_academic: "Academic Qualification",
      profile_cert_academic_text: "Control Systems Technology — University Degree",

      profile_cert_special: "Special Recognition",
      profile_cert_special_text: "Blue Homeland Service Certificate — Issued by TP Offshore",

      profile_cert_tech: "Technical & Safety Certifications",

      profile_back_btn: "← Back to Main Page"
    }
  };

  /* =========================
     APPLY LANGUAGE
  ========================== */
  function applyProfileLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (profileTranslations[lang] && profileTranslations[lang][key]) {
        el.innerHTML = profileTranslations[lang][key];
      }
    });
  }

  /* =========================
     INITIAL LANGUAGE
  ========================== */
  const savedLang = localStorage.getItem("siteLang") || "tr";
  applyProfileLang(savedLang);

  /* =========================
     BUTTON EVENTS
  ========================== */
  document.getElementById("btnLangEn")?.addEventListener("click", () => {
    localStorage.setItem("siteLang", "en");
    applyProfileLang("en");
  });

  document.getElementById("btnLangTr")?.addEventListener("click", () => {
    localStorage.setItem("siteLang", "tr");
    applyProfileLang("tr");
  });

});
