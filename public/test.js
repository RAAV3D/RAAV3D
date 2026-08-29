import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene & Camera Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);

// 2. Renderer Setup
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// 3. Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 4. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight1.position.set(5, 10, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight2.position.set(-5, 5, -5);
scene.add(dirLight2);

// 5. Dynamic Real-Time Mirror Setup (CubeCamera)
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
});
const cubeCamera = new THREE.CubeCamera(0.05, 100, cubeRenderTarget);
scene.add(cubeCamera);

// Mirror Material (for Cube.001)
const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.0,
  envMap: cubeRenderTarget.texture,
  envMapIntensity: 2.0,
});

// Transparent Glass Material (for Cube.004)
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  metalness: 0.1,
  transmission: 0.9,
  ior: 1.5,
  side: THREE.DoubleSide
});

let mirrorMesh = null;

// 6. Model Loader
const loader = new GLTFLoader();
const modelPath = 'models/bathroom(18x12)1test.glb';

loader.load(
  modelPath,
  (gltf) => {
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide;

        const name = child.name.toLowerCase();
        
        // Mirror assignment (Cube.001)
        if (name === 'cube.001' || name.includes('mirror')) {
          mirrorMesh = child;
          mirrorMesh.material = mirrorMaterial;
        } 
        // Transparent Glass assignment (Cube.004)
        else if (name === 'cube.004' || name === 'glass' || name.includes('glass')) {
          child.material = glassMaterial;
        }
      }
    });

    scene.add(model);

    // Auto-position camera and CubeCamera target
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    if (mirrorMesh) {
      mirrorMesh.getWorldPosition(cubeCamera.position);
    } else {
      cubeCamera.position.copy(center);
    }

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 0.85;

    camera.position.set(center.x, center.y, center.z + cameraZ);
    controls.target.copy(center);
    controls.update();

    console.log('Model loaded: Mirror and Transparent Glass applied!');
  },
  (xhr) => {
    if (xhr.lengthComputable) {
      console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
    }
  },
  (error) => {
    console.error('Error loading GLB model:', error);
  }
);

// 7. Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. Render Loop with Dynamic Reflection Update
function animate() {
  requestAnimationFrame(animate);

  if (mirrorMesh) {
    mirrorMesh.visible = false;
    cubeCamera.update(renderer, scene);
    mirrorMesh.visible = true;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();