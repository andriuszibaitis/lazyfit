(() => {
  function clearImageCache() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        img.setAttribute(
          "src",
          `${src}${src.includes("?") ? "&" : "?"}v=${Date.now()}`
        );
      }
    });
  }

  window.addEventListener("load", clearImageCache);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      clearImageCache();
    }
  });
})();
