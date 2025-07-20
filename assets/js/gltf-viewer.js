import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const container = document.getElementById('gltf-viewer');
if (container) {
    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
        'assets/gltf/withoutglass/1686239633188.gltf',
        function (gltf) {
            const model = gltf.scene;
            model.scale.setScalar(0.5);
            model.position.y = -1;
            scene.add(model);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
        },
        function (progress) {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        function (error) {
            console.error('Error loading GLTF:', error);
            // Fallback: create a simple rotating cube
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
        }
    );

    // Camera position
    camera.position.z = 225;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = Math.min(400, window.innerWidth * 0.8);
        const height = width * 0.75;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
