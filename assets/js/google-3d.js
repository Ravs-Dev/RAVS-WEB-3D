import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

(() => {
  const ENGINE = document.querySelector("#engine");
  if (!ENGINE) return;

  const style = document.createElement("style");
  style.textContent = `
    #engine { pointer-events: none; }
    #ravs-3d-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
    #home { position: relative; z-index: 1; }
    #site-header { z-index: 2; }
    @media (max-width: 700px) {
      #ravs-3d-canvas { opacity: .88; }
    }
    @media (prefers-reduced-motion: reduce) {
      #ravs-3d-canvas { opacity: .65; }
    }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement("canvas");
  canvas.id = "ravs-3d-canvas";
  canvas.setAttribute("aria-label", "Scroll animated 3D model");
  ENGINE.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x52617b, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(4, 5, 7);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x6aaeff, 18, 30);
  rimLight.position.set(-4, 1, -3);
  scene.add(rimLight);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  const loader = new GLTFLoader();
  let model = null;
  let modelSize = 1;

  loader.load("./assets/models/google.glb", (gltf) => {
    model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    modelSize = Math.max(size.x, size.y, size.z) || 1;
    model.position.sub(center);
    model.scale.setScalar(2.15 / modelSize);
    modelRoot.add(model);
    modelRoot.rotation.set(-0.08, 0.25, 0);
  }, undefined, (error) => {
    console.error("[RAVS WEB 3D] Model failed to load:", error);
  });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smooth = (a, b, t) => a + (b - a) * t;
  let target = { x: 0, y: 0, z: 0, scale: 1, rx: -0.08, ry: 0.25, rz: 0, cameraZ: 7.2 };
  let current = { ...target };
  let frame = 0;

  const sectionIds = [
    "#intro", "#toolbox", "#intuitive", "#composition", "#scroll",
    "#staggering", "#svgUtils", "#draggable", "#clockwork",
    "#responsive", "#modules", "#sponsors"
  ];

  function getScrollTargets() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sections = sectionIds
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);
    if (!sections.length) return;

    const points = sections.map((section, index) => {
      const rect = section.getBoundingClientRect();
      const pageTop = rect.top + window.scrollY;
      const progress = clamp(pageTop / maxScroll, 0, 1);
      const side = index === 0 ? 0 : (index % 2 ? 1 : -1);
      return {
        progress,
        x: side * (window.innerWidth < 700 ? 1.05 : 2.15),
        y: index === 0 ? 0 : (index % 3 - 1) * 0.28,
        z: index === 0 ? 0 : -0.18,
        scale: index === 0 ? 1 : (window.innerWidth < 700 ? 0.72 : 0.92),
        rx: -0.08 + index * 0.13,
        ry: 0.25 + index * 0.72,
        rz: index % 2 ? 0.22 : -0.18,
        cameraZ: index === 0 ? 7.2 : 7.8
      };
    });

    const progress = clamp(window.scrollY / maxScroll, 0, 1);
    let next = points[points.length - 1];
    let previous = points[0];
    for (let i = 1; i < points.length; i++) {
      if (progress <= points[i].progress) {
        previous = points[i - 1];
        next = points[i];
        break;
      }
    }
    const span = Math.max(0.0001, next.progress - previous.progress);
    const t = clamp((progress - previous.progress) / span, 0, 1);
    const eased = t * t * (3 - 2 * t);
    target = {
      x: smooth(previous.x, next.x, eased),
      y: smooth(previous.y, next.y, eased),
      z: smooth(previous.z, next.z, eased),
      scale: smooth(previous.scale, next.scale, eased),
      rx: smooth(previous.rx, next.rx, eased),
      ry: smooth(previous.ry, next.ry, eased),
      rz: smooth(previous.rz, next.rz, eased),
      cameraZ: smooth(previous.cameraZ, next.cameraZ, eased)
    };
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(width, height);
    getScrollTargets();
  }

  function animate() {
    frame = requestAnimationFrame(animate);
    Object.keys(current).forEach((key) => {
      current[key] += (target[key] - current[key]) * 0.075;
    });

    modelRoot.position.set(current.x, current.y, current.z);
    modelRoot.scale.setScalar(current.scale);
    modelRoot.rotation.set(current.rx, current.ry, current.rz);
    camera.position.z += (current.cameraZ - camera.position.z) * 0.06;

    if (model) {
      model.rotation.y += 0.0018;
    }
    renderer.render(scene, camera);
  }

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      getScrollTargets();
      scrollTicking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(frame), { once: true });
  getScrollTargets();
  animate();
})();
