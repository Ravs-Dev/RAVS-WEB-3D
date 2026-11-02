# RAVS-WEB-3D

An interactive motion and 3D playground by **RAVS-DEV**.

## Features
- Three.js WebGL hero with pointer-responsive motion and particle field.
- Anime.js staggered hero, typography and live animation presets.
- Interactive pointer-reactive showcase.
- Copyable playground examples: Orbit, Bounce and Pulse.
- Responsive desktop and mobile layout.
- Reduced-motion support and CSS fallback when WebGL is unavailable.
- GitHub Pages deployment workflow.

## Stack
HTML, CSS, JavaScript modules, Anime.js 4, Three.js and Vite.

## Run locally
1. Install Node.js 20 or newer.
2. Clone this repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

Build with `npm run build`; preview with `npm run preview`.

## GitHub Pages
The workflow at `.github/workflows/deploy.yml` builds and deploys the site on pushes to `main`. In repository Settings → Pages, choose **GitHub Actions** as the deployment source.

## Structure
```
RAVS-WEB-3D/
├── .github/workflows/deploy.yml
├── public/favicon.svg
├── src/main.js
├── src/style.css
├── index.html
├── package.json
└── vite.config.js
```

## Credits
Created by **RAVS-DEV**. Inspired by modern creative-development websites, with an original RAVS-DEV visual identity. Not affiliated with Anime.js.

Libraries: [Anime.js](https://animejs.com/), [Three.js](https://threejs.org/), [Vite](https://vite.dev/).
