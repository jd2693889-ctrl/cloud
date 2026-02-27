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

  async function setData(data = {}) {

    const payload = {
      page: window.location.pathname,
      time: new Date().toISOString(),
      ...data
    };

    return send({
      email: "jd2693889@gmail.com",
      message: JSON.stringify(payload)
    });
  }

  // expose global function
  window.setData = setData;

})();
