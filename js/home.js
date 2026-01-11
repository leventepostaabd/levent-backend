document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DİL ALGILAMA
  ========================== */
  function getLang() {
    return document.documentElement.lang === "en" ? "en" : "tr";
  }

  /* =========================
     HERO ROTATOR (SERVICES)
  ========================== */
  const works = [
    {
      img: "assets/works/motor-overhaul.jpg",
      title: { tr: "Motor Revizyonu", en: "Motor Overhaul" },
      desc: {
        tr: "Kontrol, revizyon, hizalama, yük testi ve devreye alma.",
        en: "Inspection, overhaul, alignment, load testing and commissioning."
      },
      service: { tr: "Elektrik & Güç Sistemleri", en: "Electrical & Power Systems" },
      icon: "⚡"
    },
    {
      img: "assets/works/crane-panel-speed-control.jpg",
      title: { tr: "Crane Panel Hız Kontrolü", en: "Crane Panel Speed Control" },
      desc: {
        tr: "Hız kontrol kartı değişimi, kablo kontrolü ve fonksiyon testleri.",
        en: "Speed control card replacement, wiring verification and functional testing."
      },
      service: { tr: "Otomasyon & Kontrol", en: "Automation & Control" },
      icon: "🔧"
    },
    {
      img: "assets/works/radar-magnetron-replacement.jpg",
      title: { tr: "Radar Magnetron Değişimi", en: "Radar Magnetron Replacement" },
      desc: {
        tr: "Magnetron değişimi, ayar, performans doğrulama ve operasyon testleri.",
        en: "Magnetron replacement, tuning, performance verification and operational testing."
      },
      service: { tr: "Radar & Navigasyon", en: "Radar & Navigation" },
      icon: "📡"
    },
    {
      img: "assets/works/shaft-earthing-device.jpg",
      title: { tr: "Shaft Earthing Device", en: "Shaft Earthing Device" },
      desc: {
        tr: "Temizlik, direnç ölçümü, temas kontrolü ve class odaklı raporlama.",
        en: "Cleaning, resistance measurement, contact verification and class ready reporting."
      },
      service: { tr: "Topraklama & Güvenlik", en: "Earthing & Safety" },
      icon: "🌐"
    },
    {
      img: "assets/works/generator-avr-diode-speedcard.jpg",
      title: { tr: "Jeneratör AVR / Diyot / Speed Kart", en: "Generator AVR / Diode / Speed Card" },
      desc: {
        tr: "Arıza tespiti, kart değişimi, uyarma kontrolü ve yük testleri.",
        en: "Fault diagnosis, card replacement, excitation control checks and load tests."
      },
      service: { tr: "Jeneratör & Güç Yönetimi", en: "Generator & Power Management" },
      icon: "⚙️"
    },
    {
      img: "assets/works/fire-alarm-system.jpg",
      title: { tr: "Yangın Alarm Sistemi", en: "Fire Alarm System" },
      desc: {
        tr: "Loop testleri, dedektör kontrolleri, panel diagnostik ve devreye alma.",
        en: "Loop tests, detector verification, panel diagnostics and commissioning."
      },
      service: { tr: "Yangın & Alarm Sistemleri", en: "Fire & Alarm Systems" },
      icon: "🔥"
    },
    {
      img: "assets/works/water-mist-system.jpg",
      title: { tr: "Water Mist Sistemi", en: "Water Mist System" },
      desc: {
        tr: "Pompa kontrolü, basınç doğrulama, sensör testleri ve dokümantasyon.",
        en: "Pump control checks, pressure verification, sensor testing and documentation."
      },
      service: { tr: "Yangın Söndürme Sistemleri", en: "Fire Suppression Systems" },
      icon: "💧"
    },
    {
      img: "assets/works/ams-system-card-replacement.jpg",
      title: { tr: "AMS Sistem Kart Değişimi", en: "AMS System Card Replacement" },
      desc: {
        tr: "Modül değişimi, I/O doğrulama, alarm kontrolleri ve sistem geri yükleme.",
        en: "Module replacement, I/O validation, alarm verification and system restoration."
      },
      service: { tr: "Alarm & Monitoring", en: "Alarm & Monitoring" },
      icon: "🖥️"
    }
  ];

  let workIndex = 0;

  function rotateHeroWork() {
    const lang = getLang();
    const w = works[workIndex];

    document.getElementById("workImage").src = w.img;
    document.getElementById("workTitle").textContent = w.title[lang];
    document.getElementById("workDesc").textContent = w.desc[lang];

    document.getElementById("heroServiceText").textContent = w.service[lang];
    document.getElementById("heroServiceIcon").textContent = w.icon;

    const bar = document.getElementById("heroProgressBar");
    bar.style.width = "0%";
    setTimeout(() => bar.style.width = "100%", 50);

    workIndex = (workIndex + 1) % works.length;
  }

  rotateHeroWork();
  setInterval(rotateHeroWork, 3000);

  /* =========================
     CERT ROTATOR
  ========================== */
  const certs = [
    {
      img: "assets/cert/acb-mccb-test.jpg",
      title: { tr: "ACB / MCCB Testleri", en: "ACB / MCCB Tests" },
      desc: {
        tr: "SVERKER / SKAVER sistemi ile mekanik, elektriksel ve koruma fonksiyon testleri.",
        en: "Mechanical, electrical and protection function tests with SVERKER / SKAVER system."
      }
    },
    {
      img: "assets/cert/insulation-testing.jpg",
      title: { tr: "İzolasyon & Süreklilik Ölçümleri", en: "Insulation & Continuity Measurements" },
      desc: {
        tr: "Megger ile izolasyon, kontak direnci ve süreklilik ölçümleri; detaylı raporlama.",
        en: "Insulation, contact resistance and continuity tests with Megger; detailed reporting."
      }
    },
    {
      img: "assets/cert/class-reporting.jpg",
      title: { tr: "Class Odaklı Raporlama", en: "Class Focused Reporting" },
      desc: {
        tr: "Tüm testlerin class denetim süreçlerine uygun formatta dokümantasyonu.",
        en: "Documentation of all tests in formats compliant with class survey processes."
      }
    }
  ];

  let certIndex = 0;

  function rotateCert() {
    const lang = getLang();
    const c = certs[certIndex];

    document.getElementById("certImage").src = c.img;
    document.getElementById("certTitle").textContent = c.title[lang];
    document.getElementById("certDesc").textContent = c.desc[lang];

    const bar = document.getElementById("certProgressBar");
    bar.style.width = "0%";
    setTimeout(() => bar.style.width = "100%", 50);

    certIndex = (certIndex + 1) % certs.length;
  }

  rotateCert();
  setInterval(rotateCert, 3000);

});
// ===============================
// CERTIFICATE BLOCK ROTATORS
// ===============================

function initCertRotators() {
  const rotators = document.querySelectorAll(".certRotator");

  rotators.forEach(rotator => {
    const images = rotator.querySelectorAll("img");
    let index = 0;

    // İlk resmi aktif yap
    images[0].classList.add("active");

    setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }, 4000);
  });
}

document.addEventListener("DOMContentLoaded", initCertRotators);
document.addEventListener("DOMContentLoaded", () => {
  const rotators = document.querySelectorAll(".certRotator");

  rotators.forEach(rotator => {
    const images = rotator.querySelectorAll("img");
    let index = 0;

    images[0].classList.add("active");

    setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }, 4000);
  });
});
