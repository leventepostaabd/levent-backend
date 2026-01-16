document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     LOGO SPLASH (replay)
     - Full screen on first load (existing)
     - Half screen on header anchor clicks
  ========================== */
  function replayLogoSplash({ mode = "half", onDone } = {}) {
    // Create a fresh splash every time so the animation always restarts cleanly
    const splash = document.createElement("div");
    splash.className = `logoSplash ${mode === "half" ? "half" : ""}`.trim();
    splash.setAttribute("aria-hidden", "true");

    // Use the same logo file; CSS turns it white for the splash.
    splash.innerHTML = `<img src="assets/logo.png" alt="Levent MarineTech" />`;
    document.body.appendChild(splash);

    // trigger show on next frame
    requestAnimationFrame(() => splash.classList.add("show"));

    // fade out near the end, then remove
    window.setTimeout(() => splash.classList.add("hide"), 1550);
    window.setTimeout(() => {
      splash.remove();
      if (typeof onDone === "function") onDone();
    }, 1800);
  }

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
      hero_title: "Marine <br> Elektro-Teknik Servis",
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

      /* DEMO */
      demo_btn: "Demo'yu Gör (Yetkili Değilim)",
      demo_note: "Demo verileri hayalidir. Sistem akışını göstermek içindir.",
      demo_page_badge: "DEMO",
      demo_page_title: "Sistemi Demo Verilerle Gör",
      demo_page_subtitle: "Bu sayfadaki tüm firma/gemi/rapor verileri hayalidir. Ama ekranlar ve akış gerçektir.",
      demo_company_title: "Demo Firma",
      demo_company_name: "NorthWave Shipping Ltd.",
      demo_company_desc: "Fleet: 3 gemi • Worldwide",
      demo_btn_sample: "Örnek Raporu Aç",
      demo_btn_home: "Ana Sayfa",
      demo_btn_authorized: "Yetkili Giriş",
      demo_vessels_title: "Demo Gemiler",
      demo_reports_title: "Demo Raporlar",
      demo_th_vessel: "Gemi",
      demo_th_type: "Tip",
      demo_th_imo: "IMO",
      demo_th_reportid: "Rapor ID",
      demo_th_service: "Servis",
      demo_th_date: "Tarih",
      demo_open: "Aç",
      demo_report_print: "Yazdır",
      demo_report_back: "Demo'ya Dön",
      demo_report_summary: "Özet",
      demo_report_disclaimer: "Bu rapor, sadece sistemi tanıtmak için hazırlanmış demo verisidir.",

      // Authorized page demo banner (HTML)
      demo_banner_html: "<div class='demoBannerTitle'><b>DEMO (Örnek Veri)</b></div><div class='demoBannerText'>Bu ekrandaki <b>firma / gemi / sertifika</b> kayıtları tanıtım amaçlıdır. <b>Yetkili kullanıcı şifreniz</b> ile giriş yaptığınızda yalnızca <b>size ait gemilerin</b> test durumu, yaklaşan test tarihleri ve dashboard bilgileri görüntülenir.</div><ul><li>Test durumlarını ve <b>yaklaşan test tarihlerini</b> takip edebilirsiniz</li><li>Kayıtlı <b>sertifikaları görüntüleyip indirebilirsiniz</b></li><li>Her test için <b>cihaza özel QR etiket çıktısı</b> alabilir (scan → rapora erişim) kullanabilirsiniz</li><li><b>Dashboard</b> üzerinden genel durumu hızlıca görebilirsiniz</li></ul>",


      /* CONTACT */
      contact_desc: "Proje, arıza veya denetim öncesi ihtiyaçlarınız için USA ve Türkiye lokasyonlarından remote veya onboard destek sağlanır.",
      contact_usa_title: "USA",
      contact_usa_desc: "32 N Gould St, Sheridan, WY 82801<br>Tel: +1 619 384 04 03",

      contact_tr_title: "Türkiye",
      contact_tr_desc: "Velibaba Mah. No:1<br>Pendik / İstanbul<br>Tel: +90 537 650 77 76",

      btn_whatsapp: "WhatsApp",
      btn_email: "Email",

      whatsapp_text: "Merhaba Levent MarineTech, servis hizmetleriniz hakkında görüşmek istiyorum.",

      contact_motto: "Projeler, arızalar veya denetim öncesi ihtiyaçlar için,\nUSA ve Türkiye lokasyonlarından remote veya onboard destek sağlanır.",
      email_subject: "Service Request",
      email_body: "Merhaba Levent MarineTech,\n\nServis hizmetleriniz hakkında görüşmek istiyorum.\n\nVessel: \nLocation/Port: \nIssue / Request: \nPreferred date: \n\nTeşekkürler,",

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
      hero_title: "Marine <br> Electro-Technical Services",
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

      /* DEMO */
      demo_btn: "View Demo (Not Authorized)",
      demo_note: "Demo data is fictional and for showcasing the workflow.",
      demo_page_badge: "DEMO",
      demo_page_title: "Explore the System with Demo Data",
      demo_page_subtitle: "All company/vessel/report data on this page is fictional. The UI and workflow are real.",
      demo_company_title: "Demo Company",
      demo_company_name: "NorthWave Shipping Ltd.",
      demo_company_desc: "Fleet: 3 vessels • Worldwide",
      demo_btn_sample: "Open Sample Report",
      demo_btn_home: "Home",
      demo_btn_authorized: "Authorized Login",
      demo_vessels_title: "Demo Vessels",
      demo_reports_title: "Demo Reports",
      demo_th_vessel: "Vessel",
      demo_th_type: "Type",
      demo_th_imo: "IMO",
      demo_th_reportid: "Report ID",
      demo_th_service: "Service",
      demo_th_date: "Date",
      demo_open: "Open",
      demo_report_print: "Print",
      demo_report_back: "Back to Demo",
      demo_report_summary: "Summary",
      demo_report_disclaimer: "This is a demo report created for presentation purposes.",

      // Authorized page demo banner (HTML)
      demo_banner_html: "<div class='demoBannerTitle'><b>DEMO (Sample Data)</b></div><div class='demoBannerText'>All <b>company / vessel / certificate</b> records on this screen are for demonstration purposes. When you sign in with your <b>authorized password</b>, you will only see <b>your own vessels</b>, including test status, upcoming deadlines and dashboard summaries.</div><ul><li>Track test status and <b>upcoming test dates</b></li><li>View and <b>download stored certificates</b></li><li>Generate a <b>device-specific QR label</b> for each test (scan → open report)</li><li>Review the overall situation quickly in the <b>Dashboard</b></li></ul>",


      /* CONTACT */
      contact_desc: "For projects, faults or pre-inspection needs, remote and onboard support is available from USA and Turkey locations.",
      contact_usa_title: "USA",
      contact_usa_desc: "32 N Gould St, Sheridan, WY 82801<br>Tel: +1 619 384 04 03",

      contact_tr_title: "Turkey",
      contact_tr_desc: "Velibaba Mah. No:1<br>Pendik / Istanbul<br>Tel: +90 537 650 77 76",

      btn_whatsapp: "WhatsApp",
      btn_email: "Email",

      whatsapp_text: "Hello Levent MarineTech, I'd like to discuss your services.",

      contact_motto: "For projects, faults or pre-inspection needs,\nremote and onboard support is available from USA and Turkey locations.",
      email_subject: "Service Request",
      email_body: "Hello Levent MarineTech,\n\nI'd like to discuss your services.\n\nVessel: \nLocation/Port: \nIssue / Request: \nPreferred date: \n\nBest regards,",

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

    // Language-aware mailto body
    const emailBtn = document.getElementById("emailBtn");
    if (emailBtn && translations[lang]) {
      const subject = encodeURIComponent(translations[lang].email_subject || "Service Request");
      const body = encodeURIComponent(translations[lang].email_body || "");
      emailBtn.setAttribute("href", `mailto:info@leventmarinetech.com?subject=${subject}&body=${body}`);
    }

    // Language-aware WhatsApp message
    const whatsappBtn = document.getElementById("whatsappBtn");
    if (whatsappBtn && translations[lang]) {
      const msg = encodeURIComponent(translations[lang].whatsapp_text || "Hello");
      whatsappBtn.setAttribute("href", `https://wa.me/16193840403?text=${msg}`);
    }

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
  // Default language: English on first visit
  applyLang(localStorage.getItem("siteLang") || "en");

  // Logo splash (index only). Shows once per tab/session.
  const splash = document.getElementById("logoSplash");
  if (splash && !sessionStorage.getItem("logoSplashShown")) {
    sessionStorage.setItem("logoSplashShown", "1");
    splash.classList.add("show");
    // Bigger splash: animate longer, then fade out and remove
    window.setTimeout(() => splash.classList.add("hide"), 1550);
    window.setTimeout(() => splash.remove(), 2350);
  } else if (splash) {
    splash.remove();
  }

  /* =========================
     HEADER ANCHOR NAV + SPLASH
  ========================== */
  const header = document.querySelector("header.header");
  if (header) {
    header.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        const id = href.replace("#", "").trim();
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        replayLogoSplash({
          mode: "half",
          onDone: () => target.scrollIntoView({ behavior: "smooth" })
        });
      });
    });
  }

});
