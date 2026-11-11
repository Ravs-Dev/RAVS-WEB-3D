(() => {
  const MODEL_URL = "./assets/models/google.glb";

  const style = document.createElement("style");
  style.textContent = `
    #google-3d-stage {
      position: fixed;
      inset: 0;
      z-index: 8;
      display: grid;
      place-items: center;
      pointer-events: none;
      overflow: hidden;
    }

    #google-3d-stage model-viewer {
      display: block;
      width: min(42vw, 460px);
      height: min(42vw, 460px);
      min-width: 260px;
      min-height: 260px;
      background: transparent;
      --poster-color: transparent;
      pointer-events: auto;
      filter: drop-shadow(0 24px 48px rgba(0, 0, 0, .28));
    }

    @media (max-width: 700px) {
      #google-3d-stage model-viewer {
        width: min(78vw, 360px);
        height: min(78vw, 360px);
        min-width: 220px;
        min-height: 220px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #google-3d-stage model-viewer {
        --progress-bar-color: transparent;
      }
    }
  `;
  document.head.appendChild(style);

  const loadViewer = () => {
    if (document.querySelector("#google-3d-stage")) return;

    const stage = document.createElement("div");
    stage.id = "google-3d-stage";
    stage.setAttribute("aria-label", "Interactive Google 3D model");

    const viewer = document.createElement("model-viewer");
    viewer.setAttribute("src", MODEL_URL);
    viewer.setAttribute("alt", "Google 3D model");
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("auto-rotate-delay", "0");
    viewer.setAttribute("rotation-per-second", "18deg");
    viewer.setAttribute("interaction-prompt", "none");
    viewer.setAttribute("shadow-intensity", "0.8");
    viewer.setAttribute("exposure", "1");
    viewer.setAttribute("camera-orbit", "0deg 75deg 2.8m");
    viewer.setAttribute("field-of-view", "30deg");
    viewer.setAttribute("environment-image", "neutral");
    viewer.setAttribute("loading", "eager");

    stage.appendChild(viewer);
    document.body.appendChild(stage);
  };

  const loader = document.createElement("script");
  loader.type = "module";
  loader.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
  loader.onload = loadViewer;
  loader.onerror = () => console.error("[RAVS WEB 3D] Could not load the model-viewer component.");
  document.head.appendChild(loader);
})();