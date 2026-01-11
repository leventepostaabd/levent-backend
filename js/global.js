document.addEventListener("DOMContentLoaded", () => {

  const translations = {

    /* =========================
       TÜRKÇE
    ========================== */
    tr: {
      /* HEADER */
      brand_name: "Levent Marine Electro-Technical Services LLC",
      brand_tag: "leventmarinetech.com",
nav_about: "Hakkımızda",

      nav_services: "Hizmetler",
      nav_certification: "Test & Sertifikasyon",
      nav_contact: "İletişim",

      /* HERO (MAIN) */
      hero_badge: "Marine Elektro-Teknik Servis",
      hero_title: "Class Ready <br> Elektro-Teknik Servis",
      hero_subtitle: "Arıza tespiti, bakım, devreye alma ve class denetimlerine uygun teknik servis hizmetleri.",
      hero_support: "7/24 Remote & Onboard Destek",
      btn_service_request: "Servis Talebi Oluştur",

      /* CERT HERO */
      cert_badge: "Test & Sertifikasyon",
      cert_title: "Test & Sertifika Hizmetleri",
      cert_subtitle: "Tüm test ve ölçümler class denetimlerinde kabul gören yöntem ve dokümantasyon ile gerçekleştirilir.",
      cert_btn_request: "Test & Sertifika Talebi Oluştur",
      cert_btn_login: "Yetkili Kullanıcı Girişi",
      login_info: "Bu panel, tarafımızca gerçekleştirilen tüm testlerin gemi bazında kayıt altına alındığı güvenli bir erişim sistemidir. Yetkili kullanıcılar; test tarihleri, cihaz seri numaraları, sertifikalar ve yaklaşan test sürelerini görüntüleyebilir. Class denetimleri ve iç denetimler için tam şeffaflık sağlar.",


      /* CONTACT */
      contact_desc: "Proje, arıza veya denetim öncesi ihtiyaçlarınız için USA ve Türkiye lokasyonlarından remote veya onboard destek sağlanır.",
      contact_usa_title: "USA",
      contact_usa_desc: "Wyoming Registered Agent Services LLC<br>32 N Gould St, Sheridan, WY 82801<br>Tel: +1 619 384 04 03",

      contact_tr_title: "Türkiye",
      contact_tr_desc: "Velibaba Mah. No:1<br>Pendik / İstanbul<br>Tel: +90 537 650 77 76",

      btn_whatsapp_us: "WhatsApp (USA)",
      btn_whatsapp_tr: "WhatsApp (TR)",
      btn_email: "Email",

      /* FOOTER */
      footer_profile: "Profesyonel Arka Plan & Yeterlilikler",
      footer_rights: "© 2026 Levent Marine Electro Technical Services. Tüm hakları saklıdır."
    },

    /* =========================
       ENGLISH
    ========================== */
    en: {
      /* HEADER */
      brand_name: "Levent Marine Electro-Technical Services LLC",
      brand_tag: "leventmarinetech.com",
nav_about: "About",

      nav_services: "Services",
      nav_certification: "Testing & Certification",
      nav_contact: "Contact",

      /* HERO (MAIN) */
      hero_badge: "Marine Electro-Technical Services",
      hero_title: "Class Ready <br> Electro-Technical Services",
      hero_subtitle: "Fault diagnosis, maintenance, commissioning and class-ready technical services.",
      hero_support: "24/7 Remote & Onboard Support",
      btn_service_request: "Request Service",

      /* CERT HERO */
      cert_badge: "Testing & Certification",
      cert_title: "Testing & Certification Services",
      cert_subtitle: "All tests and measurements are performed using class-approved methods and documentation.",
      cert_btn_request: "Request Test & Certification",
      cert_btn_login: "Authorized User Login",
      login_info: "This panel provides secure access to all vessel-based test records performed by our team. Authorized users can view test dates, device serial numbers, certificates, and upcoming test deadlines. Designed to ensure full transparency for class surveys and internal audits.",


      /* CONTACT */
      contact_desc: "For projects, faults or pre-inspection needs, remote and onboard support is available from USA and Turkey locations.",
      contact_usa_title: "USA",
      contact_usa_desc: "Wyoming Registered Agent Services LLC<br>32 N Gould St, Sheridan, WY 82801<br>Tel: +1 619 384 04 03",

      contact_tr_title: "Turkey",
      contact_tr_desc: "Velibaba Mah. No:1<br>Pendik / Istanbul<br>Tel: +90 537 650 77 76",

      btn_whatsapp_us: "WhatsApp (USA)",
      btn_whatsapp_tr: "WhatsApp (TR)",
      btn_email: "Email",

      /* FOOTER */
      footer_profile: "Professional Background & Qualifications",
      footer_rights: "© 2026 Levent Marine Electro Technical Services. All rights reserved."
    }
  };

  /* =========================
     APPLY LANGUAGE
  ========================== */
  function applyLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    localStorage.setItem("siteLang", lang);
    document.documentElement.lang = lang;
  }

  /* =========================
     BUTTON EVENTS
  ========================== */
  document.getElementById("btnLangEn")?.addEventListener("click", () => applyLang("en"));
  document.getElementById("btnLangTr")?.addEventListener("click", () => applyLang("tr"));

  /* =========================
     INITIAL LANGUAGE
  ========================== */
  applyLang(localStorage.getItem("siteLang") || "tr");

});
