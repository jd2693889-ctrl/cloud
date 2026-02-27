// emailService.js

(function () {
  let isLoaded = false;

  function loadScript() {
    return new Promise((resolve, reject) => {
      if (isLoaded) return resolve();

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

      script.onload = function () {
        isLoaded = true;
        window.emailjs.init("GlpCP9x-1");
        resolve();
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

  // expose global function
  window.EmailService = {
    send: send
  };
})();
