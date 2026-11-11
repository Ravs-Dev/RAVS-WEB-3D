// ==========================================
// 1. SETUP DASAR THREE.JS
// ==========================================
const container = document.getElementById('canvas-container'); // Pastikan ID ini sesuai dengan yang ada di index.html
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
if (container) container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ==========================================
// 2. VARIABEL GLOBAL UNTUK ANIMASI SCROLL
// ==========================================
let mixer;
let action;
let animationDuration = 0;

// ==========================================
// 3. LOAD MODEL 3D
// ==========================================
const loader = new THREE.GLTFLoader();

loader.load(
    './assets/models/google.glb', // Pastikan path ini benar mengarah ke modelmu
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Jika model memiliki animasi, set up mixer tapi JANGAN di-play otomatis
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            action = mixer.clipAction(gltf.animations[0]);
            
            // Simpan durasi total animasi untuk dipetakan dengan scroll
            animationDuration = action.getClip().duration; 
            console.log("Animasi scroll siap. Durasi:", animationDuration);
        } else {
            console.warn("Model tidak memiliki animasi.");
        }
    },
    undefined,
    (error) => console.error('Error loading model:', error)
);

camera.position.z = 5;

// ==========================================
// 4. RENDER LOOP (SINKRONISASI SCROLL)
// ==========================================
const animate = () => {
    requestAnimationFrame(animate);

    // Jalankan logika scroll hanya jika mixer sudah siap
    if (mixer && animationDuration > 0) {
        // Hitung total tinggi halaman yang bisa di-scroll
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        // Cegah pembagian dengan nol jika halaman tidak bisa di-scroll
        if (maxScroll > 0) {
            // Dapatkan persentase scroll (0.0 di atas, 1.0 di paling bawah)
            const scrollPercent = window.scrollY / maxScroll;

            // Petakan persentase ke detik animasi
            const currentAnimationTime = scrollPercent * animationDuration;

            // Paksa animasi berada di detik tersebut
            mixer.setTime(currentAnimationTime);
        }
    }

    renderer.render(scene, camera);
};

// Mulai loop
animate();

// ==========================================
// 5. RESPONSIVE RESIZE
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
