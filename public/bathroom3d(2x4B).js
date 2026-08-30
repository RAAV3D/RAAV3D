/* ========== Global Variables ========== */
let currentTileCategory = null;

const modelPaths = [
  "/models/bathroom(2x4)1.glb", "/models/bathroom(2x4)2.glb", "/models/bathroom(2x4)3.glb",
  "/models/bathroom(2x4)4.glb", "/models/bathroom(2x4)5.glb", "/models/bathroom(2x4)6.glb",
  "/models/bathroom(2x4)7.glb", "/models/bathroom(2x4)8.glb", "/models/bathroom(2x4)9.glb",
  "/models/bathroom(2x4)10.glb", "/models/bathroom(2x4)11.glb", "/models/bathroom(2x4)12.glb",
  "/models/bathroom(2x4)13.glb", "/models/bathroom(2x4)14.glb", "/models/bathroom(2x4)15.glb",
  "/models/bathroom(2x4)16.glb", "/models/bathroom(2x4)17.glb", "/models/bathroom(2x4)18.glb",
  "/models/bathroom(2x4)19.glb", "/models/bathroom(2x4)20.glb", "/models/bathroom(2x4)21.glb",
  "/models/bathroom(2x4)22.glb", "/models/bathroom(2x4)23.glb", "/models/bathroom(2x4)24.glb",
  "/models/bathroom(2x4)25.glb", "/models/bathroom(2x4)26.glb", "/models/bathroom(2x4)27.glb", 
  "/models/bathroom(2x4)28.glb"
];

/* ========== Put your design image filenames/URLs here (28 entries) ========== */
const designImages = [
  "/images/bathroom3d(2x4)1.png", "/images/bathroom3d(2x4)2.png", "/images/bathroom3d(2x4)3.png",
  "/images/bathroom3d(2x4)4.png", "/images/bathroom3d(2x4)5.png", "/images/bathroom3d(2x4)6.png",
  "/images/bathroom3d(2x4)7.png", "/images/bathroom3d(2x4)8.png", "/images/bathroom3d(2x4)8.png",
  "/images/bathroom3d(2x4)8.png", "/images/bathroom3d(2x4)8.png", "/images/bathroom3d(2x4)12.png",
  "/images/bathroom3d(2x4)13.png", "/images/bathroom3d(2x4)14.png", "/images/bathroom3d(2x4)15.png",
  "/images/bathroom3d(2x4)16.png", "/images/bathroom3d(2x4)17.png", "/images/bathroom3d(2x4)18.png",
  "/images/bathroom3d(2x4)18.png", "/images/bathroom3d(2x4)20.png", "/images/bathroom3d(2x4)20.png",
  "/images/bathroom3d(2x4)22.png", "/images/bathroom3d(2x4)23.png", "/images/bathroom3d(2x4)24.png",
  "/images/bathroom3d(2x4)25.png", "/images/bathroom3d(2x4)26.png", "/images/bathroom3d(2x4)27.png",
  "/images/bathroom3d(2x4)28.png"
];

/* ========== Mesh name groups ========== */
const lMeshes = ['L001', 'L002', 'L003', 'L004', 'L005', 'L006', 'L007', 'L008',
                 'L009', 'L010', 'L011', 'L012', 'L013', 'L014', 'L015', 'L016',
                 'L017', 'L018', 'L019', 'L020', 'L021', 'L022', 'L023', 'L024',
                 'L025', 'L026', 'L027', 'L028', 'L029', 'L030', 'L031', 'L032',
                 'L033', 'L034', 'L035', 'L036', 'L037', 'L038', 'L039', 'L040',
                 'L041', 'L042', 'L043', 'L044', 'L045', 'L046', 'L047', 'L048',
                 'L049', 'L050', 'L051', 'L052', 'L053', 'L054', 'L055', 'L056',
                 'L057', 'L058', 'L059', 'L060', 'L061', 'L062', 'L063', 'L064',
                 'L065', 'L066', 'L067', 'L068', 'L069', 'L070', 'L071', 'L072',
                 'L073', 'L074', 'L075', 'L076', 'L077', 'L078', 'L079', 'L080',
                 'L081', 'L082', 'L083', 'L084', 'L085', 'L086', 'L087', 'L088',
                 'L089', 'L090', 'L091', 'L092', 'L093', 'L094', 'L095', 'L096',
                 'L097', 'L098', 'L099', 'L100', 'L101', 'L102', 'L103', 'L104',
                 'L105', 'L106', 'L107', 'L108', 'L109', 'L110', 'L111', 'L112',
                 'L113', 'L114', 'L115', 'L116', 'L117', 'L118', 'L119', 'L120',
                 'L121', 'L122', 'L123', 'L124', 'L125', 'L126', 'L127', 'L128',
                 'L129', 'L130', 'L131', 'L132', 'L133', 'L134', 'L135', 'L136',
                 'L137', 'L138', 'L139', 'L140', 'L141', 'L142', 'L143', 'L144'];
const dMeshes = ['D001', 'D002', 'D003', 'D004', 'D005', 'D006', 'D007', 'D008',
                 'D009', 'D010', 'D011', 'D012', 'D013', 'D014', 'D015', 'D016',
                 'D017', 'D018', 'D019', 'D020', 'D021', 'D022', 'D023', 'D024',
                 'D025', 'D026', 'D027', 'D028', 'D029', 'D030', 'D031', 'D032',
                 'D033', 'D034', 'D035', 'D036', 'D037', 'D038', 'D039', 'D040',
                 'D041', 'D042', 'D043', 'D044', 'D045', 'D046', 'D047', 'D048',
                 'D049', 'D050', 'D051', 'D052', 'D053', 'D054', 'D055', 'D056',
                 'D057', 'D058', 'D059', 'D060', 'D061', 'D062', 'D063', 'D064',
                 'D065', 'D066', 'D067', 'D068', 'D069', 'D070', 'D071', 'D072',
                 'D073', 'D074', 'D075', 'D076', 'D077', 'D078', 'D079', 'D080',
                 'D081', 'D082', 'D083', 'D084', 'D085', 'D086', 'D087', 'D088',
                 'D089', 'D090', 'D091', 'D092', 'D093', 'D094', 'D095', 'D096',
                 'D097', 'D098', 'D099', 'D100', 'D101', 'D102', 'D103', 'D104',
                 'D105', 'D106', 'D107', 'D108', 'D109', 'D110', 'D111', 'D112',
                 'D113', 'D114', 'D115', 'D116', 'D117', 'D118', 'D119', 'D120',
                 'D121', 'D122', 'D123', 'D124', 'D125', 'D126', 'D127', 'D128',
                 'D129', 'D130', 'D131', 'D132', 'D133', 'D134', 'D135', 'D136',
                 'D137', 'D138', 'D139', 'D140', 'D141', 'D142', 'D143', 'D144'];
const hlMeshes = ['HL001', 'HL002', 'HL003', 'HL004', 'HL005', 'HL006', 'HL007', 'HL008',
                  'HL009', 'HL010', 'HL011', 'HL012', 'HL013', 'HL014', 'HL015', 'HL016',
                  'HL017', 'HL018', 'HL019', 'HL020', 'HL021', 'HL022', 'HL023', 'HL024',
                  'HL025', 'HL026', 'HL027', 'HL028', 'HL029', 'HL030', 'HL031', 'HL032',
                  'HL033', 'HL034', 'HL035', 'HL036', 'HL037', 'HL038', 'HL039', 'HL040',
                  'HL041', 'HL042', 'HL043', 'HL044', 'HL045', 'HL046', 'HL047', 'HL048',
                  'HL049', 'HL050', 'HL051', 'HL052', 'HL053', 'HL054', 'HL055', 'HL056',
                  'HL057', 'HL058', 'HL059', 'HL060', 'HL061', 'HL062', 'HL063', 'HL064',
                  'HL065', 'HL066', 'HL067', 'HL068', 'HL069', 'HL070', 'HL071', 'HL072',
                  'HL073', 'HL074', 'HL075', 'HL076', 'HL077', 'HL078', 'HL079', 'HL080',
                  'HL081', 'HL082', 'HL083', 'HL084', 'HL085', 'HL086', 'HL087', 'HL088',
                  'HL089', 'HL090', 'HL091', 'HL092', 'HL093', 'HL094', 'HL095', 'HL096',
                  'HL097', 'HL098', 'HL099', 'HL100', 'HL101', 'HL102', 'HL103', 'HL104',
                  'HL105', 'HL106', 'HL107', 'HL108', 'HL109', 'HL110', 'HL111', 'HL112',
                  'HL113', 'HL114', 'HL115', 'HL116', 'HL117', 'HL118', 'HL119', 'HL120',
                  'HL121', 'HL122', 'HL123', 'HL124', 'HL125', 'HL126', 'HL127', 'HL128'];
const fMeshes = ['F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007', 'F008',
                 'F009', 'F010', 'F011', 'F012', 'F013', 'F014', 'F015', 'F016',
                 'F017', 'F018', 'F019', 'F020', 'F021', 'F022', 'F023', 'F024',
                 'F025', 'F026', 'F027', 'F028', 'F029', 'F030', 'F031', 'F032',
                 'F033', 'F034', 'F035', 'F036', 'F037', 'F038', 'F039', 'F040',
                 'F041', 'F042', 'F043', 'F044', 'F045', 'F046', 'F047', 'F048'];

/* ========== State & Three.js vars ========== */
let scene, camera, renderer, controls;
let gltfScene = null;
let boundingBox = null;
let modelLoadedFlag = false;
let currentDesignIndex = -1;
const textureLoader = new THREE.TextureLoader();
let uploadedTextureL = null, uploadedTextureD = null, uploadedTextureHL = null, uploadedTextureF = null;

/* Dynamic Real-Time Mirror Setup (CubeCamera) */
let cubeRenderTarget, cubeCamera, mirrorMaterial, mirrorMesh = null;

/* Auto rotation & clock */
let autoRotate = true;
let rotationSpeed = 0.1;
const clock = new THREE.Clock();
let mirrorFrameCounter = 0;

/* Loading flag to prevent concurrent loads */
let isLoading = false;

/* ========== Initialize Three.js ========== */
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(1.5, 0.8, 7);

  // Added preserveDrawingBuffer: true for WebGL screenshot generation
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'none';

  // Balanced Lighting Setup
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  
  const dir = new THREE.DirectionalLight(0xffffff, 0.7); 
  dir.position.set(0, 5, 5); 
  scene.add(dir);

  // Soft Point Light at specified position (x: 0, y: 0, z: 1)
  const pt = new THREE.PointLight(0xffffff, 0.2); 
  pt.position.set(0, 0, 1.5); 
  scene.add(pt);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4); 
  scene.add(hemi);

  // High-Resolution & Crisp Mirror Setup (2048px without mipmap blur)
cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
  generateMipmaps: false,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
});
  cubeCamera = new THREE.CubeCamera(0.01, 100, cubeRenderTarget);
  scene.add(cubeCamera);

  mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.0,
    envMap: cubeRenderTarget.texture,
    envMapIntensity: 1.0,
  });

  // Environment map
  try {
    const env = new THREE.CubeTextureLoader().load([
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
      'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
    ]);
    scene.environment = env;
  } catch (e) { console.warn("Env map load failed", e); scene.environment = null; }

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  // Animation loop with Dynamic Reflection Update
(function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Auto rotation
  if (autoRotate && gltfScene) {
    gltfScene.rotation.y += rotationSpeed * delta;
  }

  // Update controls
  controls.update();

  // Render normal scene first
  renderer.render(scene, camera);

  // Update mirror reflection at a lower frequency
  // instead of rendering the expensive cube camera every frame
  if (mirrorMesh && gltfScene) {
    mirrorFrameCounter++;

    if (mirrorFrameCounter >= 4) {
      mirrorFrameCounter = 0;

      mirrorMesh.updateMatrixWorld(true);

      mirrorMesh.getWorldPosition(cubeCamera.position);

      const normalVector = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(
          mirrorMesh.getWorldQuaternion(new THREE.Quaternion())
        );

      cubeCamera.position.addScaledVector(normalVector, 0.02);

      mirrorMesh.visible = false;
      cubeCamera.update(renderer, scene);
      mirrorMesh.visible = true;
    }
  }
})();

  // Window resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ========== GLB Loader ========== */
function loadGLBByIndex(idx) {
  if (idx < 0 || idx >= modelPaths.length || isLoading) return;
  const path = modelPaths[idx];
  if (!path || path.trim() === "") {
    alert("No GLB path set for this design slot.");
    return;
  }

  isLoading = true;
  disableDesignButtons();
  
  // Show global screen loader overlay
  const screenLoader = document.getElementById('screenLoader');
  if (screenLoader) screenLoader.style.display = 'flex';

  if (gltfScene) {
    scene.remove(gltfScene);
    disposeObject(gltfScene);
    gltfScene = null;
    mirrorMesh = null;
  }

  const loader = new THREE.GLTFLoader();
  loader.load(path,
    (gltf) => {
      gltfScene = gltf.scene || gltf.scenes[0];
      gltfScene.position.set(3, -1, 4.5);
      gltfScene.scale.set(1,1,1);

      boundingBox = new THREE.Box3().setFromObject(gltfScene);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      controls.target.copy(center);

// Height offset (+0.18) tilts the view ~2° downward towards the floor
      camera.position.set(1.5, center.y + 0.18, 7);
      controls.update();

      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
      controls.minDistance = Math.max(0.01, maxDim * 0.03);
      controls.maxDistance = Math.max(maxDim * 0.2, 0.9);

      gltfScene.traverse((child) => {
        if (!child.isMesh) return;

        const meshName = child.name || "";
        const lowerName = meshName.toLowerCase();

        // Target Glass / Cube.001 / Mirror mesh for Real-Time Reflection
        if (lowerName === 'glass' || lowerName === 'cube.001' || lowerName.includes('glass') || lowerName.includes('mirror')) {
          mirrorMesh = child;
          child.material = mirrorMaterial;
          return;
        }

        let mat = (child.material && child.material.clone) ? child.material.clone() : undefined;
        if (!mat || mat.type !== "MeshStandardMaterial") mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        if (fMeshes.includes(meshName)) {
          mat.roughness = 1.0;
          mat.metalness = 0.0;
          mat.envMap = null;
        } else {
          if (scene.environment) mat.envMap = scene.environment;
          mat.roughness = 0.35; // Roughness adjusted to eliminate white reflection spot on wall tiles
          mat.metalness = 0.0;
        }
        mat.emissive = new THREE.Color(0x000000);
        child.material = mat;
        child.material.needsUpdate = true;
      });

      applyUploadedTexturesToModel(gltfScene);

      scene.add(gltfScene);
      modelLoadedFlag = true;
      currentDesignIndex = idx;

      renderer.domElement.style.display = 'block';
      document.getElementById('designFooter').style.display = 'flex';
      document.getElementById('designFooter').setAttribute('aria-hidden', 'false');
      console.log("Loaded design", idx+1, "from", path);

      isLoading = false;
      enableDesignButtons();
      
      // Hide global screen loader overlay
      if (screenLoader) screenLoader.style.display = 'none';
    },
    (xhr) => {
      if (xhr && xhr.loaded && xhr.total) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(`Loading ${path}: ${pct}%`);
      }
    },
    (err) => {
      console.error("GLB load error", err);
      alert("Error loading model: " + path);
      isLoading = false;
      enableDesignButtons();
      if (screenLoader) screenLoader.style.display = 'none';
    }
  );
}

function applyUploadedTexturesToModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    const name = child.name || "";
    if (lMeshes.includes(name) && uploadedTextureL) child.material.map = uploadedTextureL;
    else if (dMeshes.includes(name) && uploadedTextureD) child.material.map = uploadedTextureD;
    else if (hlMeshes.includes(name) && uploadedTextureHL) child.material.map = uploadedTextureHL;
    else if (fMeshes.includes(name) && uploadedTextureF) child.material.map = uploadedTextureF;
    child.material.needsUpdate = true;
  });
}

/* Dispose helper */
function disposeObject(obj) {
  obj.traverse((c) => {
    if (c.isMesh) {
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        if (Array.isArray(c.material)) {
          c.material.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
        } else {
          if (c.material.map) c.material.map.dispose();
          c.material.dispose();
        }
      }
    }
  });
}

/* ========== Upload / Drag-drop / Preview / Clear ========== */
const itemsConfig = [
  { inputId: "fileInputL", previewId: "previewL", clearId: "clearL", sectionId: "sectionL", errorId: "errorL", key: "L" },
  { inputId: "fileInputD", previewId: "previewD", clearId: "clearD", sectionId: "sectionD", errorId: "errorD", key: "D" },
  { inputId: "fileInputHL", previewId: "previewHL", clearId: "clearHL", sectionId: "sectionHL", errorId: "errorHL", key: "HL" },
  { inputId: "fileInputF", previewId: "previewF", clearId: "clearF", sectionId: "sectionF", errorId: "errorF", key: "F" }
];

function setupUploadHandlers() {
  itemsConfig.forEach(item => {
    const input = document.getElementById(item.inputId);
    const preview = document.getElementById(item.previewId);
    const clearBtn = document.getElementById(item.clearId);
    const section = document.getElementById(item.sectionId);
    const errorEl = document.getElementById(item.errorId);

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFile(file, preview, section, clearBtn, errorEl, item.key);
    });

    section.addEventListener('dragover', (ev) => { ev.preventDefault(); section.style.borderColor = 'var(--accent)'; });
    section.addEventListener('dragleave', (ev) => { ev.preventDefault(); if (!section.classList.contains('has-image')) section.style.borderColor = ''; });
    section.addEventListener('drop', (ev) => {
      ev.preventDefault();
      section.style.borderColor = '';
      const file = ev.dataTransfer.files && ev.dataTransfer.files[0];
      if (file) {
        const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
        handleFile(file, preview, section, clearBtn, errorEl, item.key);
      }
    });

clearBtn.addEventListener('click', () => {
      input.value = "";
      preview.src = "";
      preview.style.display = 'none';
      section.classList.remove('has-image');
      clearBtn.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      
      // Remove unique 2x4 key from localStorage
      localStorage.removeItem(`saved_tile_2x4_${item.key}`);

      if (item.key === 'L') { uploadedTextureL = null; }
      else if (item.key === 'D') { uploadedTextureD = null; }
      else if (item.key === 'HL') { uploadedTextureHL = null; }
      else if (item.key === 'F') { uploadedTextureF = null; }
      if (gltfScene) applyUploadedTexturesToModel(gltfScene);
    });
  });
}

function handleFile(file, preview, section, clearBtn, errorEl, key) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    if (errorEl) {
      errorEl.textContent = "Invalid file type. Choose an image.";
      errorEl.style.display = 'block';
    }
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    if (errorEl) {
      errorEl.textContent = "File too large (max 5MB).";
      errorEl.style.display = 'block';
    }
    return;
  }
  if (errorEl) errorEl.style.display = 'none';
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    
    // Save string data to localStorage with 2x4 unique prefix
    try {
      localStorage.setItem(`saved_tile_2x4_${key}`, dataUrl);
    } catch(e) {
      console.warn("localStorage quota exceeded. Storing image preview only.", e);
    }

    processAndApplyTexture(dataUrl, preview, section, clearBtn, key);
  };
  reader.readAsDataURL(file);
}

// Extracted logic to process and generate textures from base64 string
function processAndApplyTexture(dataUrl, preview, section, clearBtn, key) {
  preview.src = dataUrl;
  preview.style.display = 'block';
  section.classList.add('has-image');
  clearBtn.style.display = 'inline-block';

  textureLoader.load(dataUrl, (tex) => {
    tex.rotation = -Math.PI / 2;
    tex.flipY = false;
    tex.center.set(0.5, 0.5);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);

    if (key === 'L') uploadedTextureL = tex;
    else if (key === 'D') uploadedTextureD = tex;
    else if (key === 'HL') uploadedTextureHL = tex;
    else if (key === 'F') uploadedTextureF = tex;

    if (gltfScene) applyUploadedTexturesToModel(gltfScene);
  });
}

// Function to check and load saved images from localStorage on startup
function loadSavedTexturesFromStorage() {
  itemsConfig.forEach(item => {
    // Reading from the 2x4 unique key
    const savedData = localStorage.getItem(`saved_tile_2x4_${item.key}`);
    if (savedData) {
      const preview = document.getElementById(item.previewId);
      const clearBtn = document.getElementById(item.clearId);
      const section = document.getElementById(item.sectionId);
      processAndApplyTexture(savedData, preview, section, clearBtn, item.key);
    }
  });
}

/* ========== Wire UI Buttons ========== */
function wireUI() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    renderer.domElement.style.display = 'block';
    document.getElementById('designFooter').style.display = 'flex';
    document.getElementById('designFooter').setAttribute('aria-hidden','false');
    
    // Show Go to Top button when model is generated
    document.getElementById('goToTopBtn').classList.add('show');
    
    const idx = modelPaths.findIndex(p => p && p.trim() !== "");
    if (idx >= 0) loadGLBByIndex(idx);
    else alert("No GLB files provided in modelPaths. Edit the modelPaths array in the JS.");
  });

  // Fullscreen button
  document.getElementById('fullscreenBtn').addEventListener('click', async () => {
    const el = renderer.domElement;
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } catch (e) { console.warn("Fullscreen failed:", e); }
    } else {
      try {
        await document.exitFullscreen();
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } catch (e) { console.warn("Exit fullscreen failed:", e); }
    }
  });

  // Download PDF Button Handler (with Filename Prompt & Android WebView Compatibility)
  document.getElementById("downloadBtn").addEventListener("click", async () => {
    if (!modelLoadedFlag) {
      alert("Please generate a model first!");
      return;
    }

    // Prompt user for custom PDF filename before generating
    const defaultFileName = `Bathroom_Design_${currentDesignIndex + 1 || 1}`;
    const userInput = prompt("Enter a name for your PDF file:", defaultFileName);

    // If user clicks Cancel, exit without downloading
    if (userInput === null) {
      return;
    }

    // Sanitize user input & append .pdf extension if omitted
    let fileName = userInput.trim() || defaultFileName;
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }

    const screenLoader = document.getElementById('screenLoader');
    if (screenLoader) {
      screenLoader.querySelector('.loader-text').textContent = "Capturing Horizontal A4 Wall Screenshots & Generating PDF...";
      screenLoader.style.display = 'flex';
    }

    // Brief delay to allow loader overlay to render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Temporarily pause auto-rotate & backup original canvas/camera settings
      const originalAutoRotate = autoRotate;
      autoRotate = false;

      const originalCamPos = camera.position.clone();
      const originalTarget = controls.target.clone();
      const originalUp = camera.up.clone();
      const originalFov = camera.fov;
      const originalAspect = camera.aspect;
      const originalRotationY = gltfScene ? gltfScene.rotation.y : 0;

      // Reset model rotation to baseline for accurate directional angles
      if (gltfScene) gltfScene.rotation.y = 0;

      // Lock renderer to A4 Landscape Ratio (297mm / 210mm ≈ 1.414)
      const exportWidth = 1920;
      const exportHeight = 1357; // 1920 / (297 / 210)
      renderer.setSize(exportWidth, exportHeight, false);
      camera.aspect = exportWidth / exportHeight;
      camera.fov = 65; // Wide view matching screenshot angle
      camera.updateProjectionMatrix();

      const target = controls.target.clone();
      const dx = originalCamPos.x - target.x;
      const dz = originalCamPos.z - target.z;
      const radius = Math.sqrt(dx * dx + dz * dz) || 4.5;
      const camY = originalCamPos.y;

      // 1. Four Directional Walls (South, East, West, North)
      const mainWallViews = [
        { name: "South View", angle: 0 },
        { name: "East View", angle: Math.PI / 2 },
        { name: "West View", angle: (3 * Math.PI) / 2 },
        { name: "North View", angle: Math.PI }
      ];

      // 2. Four Corners
      const cornerViews = [
        { name: "Corner 1 (South-East)", angle: Math.PI / 4 },
        { name: "Corner 2 (North-East)", angle: (3 * Math.PI) / 4 },
        { name: "Corner 3 (North-West)", angle: (5 * Math.PI) / 4 },
        { name: "Corner 4 (South-West)", angle: (7 * Math.PI) / 4 }
      ];

      const capturedImages = [];

      const captureSnapshot = () => {
        if (mirrorMesh && gltfScene) {
          mirrorMesh.updateMatrixWorld(true);
          mirrorMesh.getWorldPosition(cubeCamera.position);
          const normalVector = new THREE.Vector3(0, 0, 1).applyQuaternion(mirrorMesh.getWorldQuaternion(new THREE.Quaternion()));
          cubeCamera.position.addScaledVector(normalVector, 0.02);
          mirrorMesh.visible = false;
          cubeCamera.update(renderer, scene);
          mirrorMesh.visible = true;
        }
        renderer.render(scene, camera);
        return renderer.domElement.toDataURL("image/jpeg", 0.95);
      };

      // Step 1: Capture Main Side Walls
      for (const view of mainWallViews) {
        camera.up.set(0, 1, 0);
        const x = target.x + radius * Math.sin(view.angle);
        const z = target.z + radius * Math.cos(view.angle);

        camera.position.set(x, camY, z);
        camera.lookAt(target);
        controls.target.copy(target);
        controls.update();

        capturedImages.push(captureSnapshot());
      }

      // Step 2: Capture Four Corners
      for (const view of cornerViews) {
        camera.up.set(0, 1, 0);
        const x = target.x + radius * Math.sin(view.angle);
        const z = target.z + radius * Math.cos(view.angle);

        camera.position.set(x, camY, z);
        camera.lookAt(target);
        controls.target.copy(target);
        controls.update();

        capturedImages.push(captureSnapshot());
      }

      // Step 3: Capture Top View
      camera.position.set(target.x, target.y + radius * 1.5, target.z + 0.001);
      camera.up.set(0, 0, -1);
      camera.lookAt(target);
      controls.target.copy(target);
      controls.update();

      capturedImages.push(captureSnapshot());

      // Restore original renderer size and camera projection state
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = originalAspect;
      camera.fov = originalFov;
      camera.up.copy(originalUp);
      camera.position.copy(originalCamPos);
      controls.target.copy(originalTarget);
      if (gltfScene) gltfScene.rotation.y = originalRotationY;
      camera.updateProjectionMatrix();
      controls.update();
      autoRotate = originalAutoRotate;

      // Compile images into A4 Landscape PDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      capturedImages.forEach((imgData, index) => {
        if (index > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      });

      // Android WebView Compatible Export
      const pdfBase64 = pdf.output('datauristring');
      const link = document.createElement('a');
      link.href = pdfBase64;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Failed to generate PDF: " + e.message);
    } finally {
      if (screenLoader) {
        screenLoader.querySelector('.loader-text').textContent = "Loading 3D Scene... Please Wait";
        screenLoader.style.display = 'none';
      }
    }
  });

  // Download Video Button Handler
  document.getElementById("downloadVideoBtn").addEventListener("click", startVideoRecording);

  // Rotation toggle & speed
  document.getElementById('autoRotateToggle').addEventListener('change', (e) => {
    autoRotate = e.target.checked;
  });
  document.getElementById('rotationSpeed').addEventListener('input', (e) => {
    rotationSpeed = parseFloat(e.target.value) || 0.0;
  });
  
  // Go to Top button
  document.getElementById('goToTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Show/hide Go to Top button based on scroll position
  window.addEventListener('scroll', () => {
    const goToTopBtn = document.getElementById('goToTopBtn');
    if (window.scrollY > 300) {
      goToTopBtn.classList.add('show');
    } else {
      goToTopBtn.classList.remove('show');
    }
  });
}

/* ========== Video Recording Function ========== */
async function startVideoRecording() {
  if (!modelLoadedFlag) {
    alert("Please generate a model first!");
    return;
  }

  const screenLoader = document.getElementById('screenLoader');
  if (screenLoader) {
    screenLoader.querySelector('.loader-text').textContent = "Recording Wall-to-Wall Video Tour...";
    screenLoader.style.display = 'flex';
  }

  const canvas = renderer.domElement;
  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bathroom_Tour_Design_${currentDesignIndex + 1 || 1}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (screenLoader) {
      screenLoader.querySelector('.loader-text').textContent = "Loading 3D Scene... Please Wait";
      screenLoader.style.display = 'none';
    }
  };

  const originalAutoRotate = autoRotate;
  autoRotate = false;
  const originalCamPos = camera.position.clone();
  const target = controls.target.clone();

  mediaRecorder.start();

  const durationMs = 8000;
  const startTime = performance.now();
  const radius = Math.sqrt(Math.pow(originalCamPos.x - target.x, 2) + Math.pow(originalCamPos.z - target.z, 2)) || 5;

  function animateTour(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    if (progress < 0.3) {
      // Phase 1: Move along X axis (0 to X offset)
      const p1 = progress / 0.3;
      camera.position.x = target.x + (radius * p1);
      camera.position.z = target.z + radius;
      camera.position.y = target.y + 0.5;
    } else if (progress < 0.5) {
      // Phase 2: Shift along Y axis
      const p2 = (progress - 0.3) / 0.2;
      camera.position.x = target.x + radius;
      camera.position.y = target.y + 0.5 + (p2 * 1.5);
    } else {
      // Phase 3: Wall-to-wall rotation around target
      const p3 = (progress - 0.5) / 0.5;
      const angle = p3 * Math.PI * 2;
      camera.position.x = target.x + radius * Math.sin(angle);
      camera.position.z = target.z + radius * Math.cos(angle);
    }

    camera.lookAt(target);
    controls.target.copy(target);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(animateTour);
    } else {
      camera.position.copy(originalCamPos);
      camera.lookAt(target);
      controls.target.copy(target);
      controls.update();
      autoRotate = originalAutoRotate;

      setTimeout(() => {
        mediaRecorder.stop();
      }, 300);
    }
  }

  requestAnimationFrame(animateTour);
}

/* ========== Create footer buttons (28) ========== */
function createFooterButtons() {
  const footer = document.getElementById('designFooter');
  footer.innerHTML = "";

  let activeBtn = null;

  for (let i = 0; i < modelPaths.length; i++) {
    const box = document.createElement('div');
    box.className = 'design-box';
    box.id = `designBox${i + 1}`;

    const img = document.createElement('img');
    img.src = designImages[i] || `https://via.placeholder.com/40x30?text=D${i + 1}`;
    img.alt = `Design ${i + 1}`;
    box.appendChild(img);

    const span = document.createElement('span');
    span.textContent = `Design ${i + 1}`;
    box.appendChild(span);

    if (!modelPaths[i] || modelPaths[i].trim() === "") box.style.opacity = 0.5;

    box.addEventListener('click', () => {
      if (!modelPaths[i] || modelPaths[i].trim() === "") {
        alert("No GLB set for this design slot.");
        return;
      }

      loadGLBByIndex(i);

      if (activeBtn) activeBtn.classList.remove('active');
      box.classList.add('active');
      activeBtn = box;
    });

    footer.appendChild(box);
  }

  document.addEventListener("fullscreenchange", () => {
    const footer = document.getElementById("designFooter");
    if (document.fullscreenElement) {
      footer.style.position = "fixed";
      footer.style.bottom = "10px";
      footer.style.left = "0";
      footer.style.right = "0";
      footer.style.zIndex = "999999";
      footer.style.display = "flex";
      footer.style.pointerEvents = "auto";
    } else {
      footer.style.display = "flex";
    }
  });
}

/* ========== Functions to disable/enable design buttons during loading ========== */
function disableDesignButtons() {
  for (let i = 1; i <= modelPaths.length; i++) {
    const box = document.getElementById(`designBox${i}`);
    if (box) box.style.pointerEvents = 'none';
  }
}

function enableDesignButtons() {
  for (let i = 1; i <= modelPaths.length; i++) {
    const box = document.getElementById(`designBox${i}`);
    if (box && modelPaths[i-1] && modelPaths[i-1].trim() !== "") box.style.pointerEvents = 'auto';
  }
}

/* ========== Startup ========== */
(function startup() {
  initThree();
  setupUploadHandlers();
  loadSavedTexturesFromStorage();
  wireUI();
  createFooterButtons();
})();