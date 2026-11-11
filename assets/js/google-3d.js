// assets/js/google-3d.js

// 1. Setup Dasar Three.js
const container = document.getElementById('canvas-container'); // Ganti dengan ID div canvas kamu di index.html
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
if (container) container.appendChild(renderer.domElement);

// Tambahkan pencahayaan
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ==========================================
// 2. BAGIAN PERBAIKAN ANIMASI (DEKLARASI)
// ==========================================
const clock = new THREE.Clock(); // Wajib untuk mengatur kecepatan animasi
let mixer; // Variabel global untuk mixer animasi

// 3. Load Model 3D
const loader = new THREE.GLTFLoader();

loader.load(
    './assets/models/google.glb', // Path disesuaikan dengan struktur foldermu
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // ==========================================
        // 4. BAGIAN PERBAIKAN ANIMASI (INISIALISASI)
        // ==========================================
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            
            // Ambil dan jalankan klip animasi index ke-0
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            console.log("Animasi berhasil dimuat dan dijalankan.");
        } else {
            console.warn("Peringatan: google.glb tidak memiliki data animasi (gltf.animations kosong).");
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% model ter-load');
    },
    (error) => {
        console.error('Gagal memuat model:', error);
    }
);

camera.position.z = 5;

// ==========================================
// 5. BAGIAN PERBAIKAN ANIMASI (RENDER LOOP)
// ==========================================
const animate = () => {
    requestAnimationFrame(animate);

    // Hitung waktu (delta) dari frame terakhir
    const delta = clock.getDelta();

    // Update mixer jika sudah diinisialisasi
    if (mixer) {
        mixer.update(delta);
    }

    renderer.render(scene, camera);
};

// Jalankan animasi
animate();

// 6. Handle Resize Window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
