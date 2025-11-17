/* Unified viewer with design buttons, auto-rotation and zoom limits
   HL tile removed — L and D remain
*/

/* ========== Put your GLB filenames/URLs here ========== */
const modelPaths = [
  "/models/parking1.glb", // Design 1
  "/models/parking2.glb", // Design 2
  "/models/parking3.glb", // Design 3
  "/models/parking6.glb", // Design 4
  "/models/parking5.glb", // Design 5
  "/models/parking7.glb", // Design 6
  "/models/parking4.glb", // Design 7
  "/models/.glb", // Design 8
  "/models/.glb", // Design 9
  "/models/.glb", // Design 10
  "/models/.glb", // Design 11
  "/models/.glb", // Design 12
  "/models/.glb", // Design 13
  "/models/.glb", // Design 14
  "/models/.glb", // Design 15
  "/models/.glb", // Design 16
  "/models/.glb", // Design 17
  ""  // Design 18
];
/* =================================================================== */

/* Mesh name groups (keep/extend as needed) */
const lMeshes = ['L001','L002','L003','L004','L005','L006','L007','L008','L009','L010','L011','L012','L013','L014','L015','L016','L017','L018','L019','L020','L021','L022','L023','L024','L025','L026','L027','L028','L029','L030','L031','L032','L033','L034','L035','L036','L037','L038','L039','L040','L041','L042','L043','L044','L045','L046','L047','L048','L049','L050','L051','L052','L053','L054','L055','L056','L057','L058','L059','L060','L061','L062','L063','L064','L065','L066','L067','L068','L069','L070','L071','L072','L073','L074','L075','L076','L077','L078','L079','L080','L081','L082','L083','L084','L085','L086','L087','L088','L089','L090','L091','L092','L093','L094','L095','L096'];
const dMeshes = ['D001','D002','D003','D004','D005','D006','D007','D008','D009','D010','D011','D012','D013','D014','D015','D016','D017','D018','D019','D020','D021','D022','D023','D024','D025','D026','D027','D028','D029','D030','D031','D032','D033','D034','D035','D036','D037','D038','D039','D040','D041','D042','D043','D044','D045','D046','D047','D048','D049','D050','D051','D052','D053','D054','D055','D056','D057','D058','D059','D060','D061','D062','D063','D064','D065','D066','D067','D068','D069','D070','D071','D072','D073','D074','D075','D076','D077','D078','D079','D080','D081','D082','D083','D084','D085','D086','D087','D088','D089','D090','D091','D092','D093','D094','D095','D096'];

/* ========== State & Three.js vars ========== */
let scene, camera, renderer, controls;
let gltfScene = null;
let boundingBox = null;
let modelLoadedFlag = false;
let currentDesignIndex = -1; // 0-based index
const textureLoader = new THREE.TextureLoader();
let uploadedTextureL = null, uploadedTextureD = null;

/* Auto rotation & clock */
let autoRotate = true;
let rotationSpeed = 0.3; // radians/sec default
const clock = new THREE.Clock();

/* ========== Initialize Three.js ========== */
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.72), 0.1, 2000);
  camera.position.set(3, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, Math.floor(window.innerHeight * 0.72));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'none'; // hidden until Generate clicked

  // Lights (similar to original)
  scene.add(new THREE.AmbientLight(0x404040, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8); dir.position.set(1,1,1); scene.add(dir);
  const pt = new THREE.PointLight(0xffffff, 0.6); pt.position.set(0,0,2); scene.add(pt);
  const hemi = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.3); scene.add(hemi);

  // env map
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

  // animate
  (function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (autoRotate && gltfScene) {
      gltfScene.rotation.y += rotationSpeed * delta;
    }
    controls.update();
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / (window.innerHeight * 1);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, Math.floor(window.innerHeight * 1));
  });
}

/* ========== GLB Loader with textures applied ========== */
function loadGLBByIndex(idx) {
  if (idx < 0 || idx >= modelPaths.length) return;
  const path = modelPaths[idx];
  if (!path || path.trim() === "") {
    alert("No GLB path set for this design slot.");
    return;
  }

  // Remove previous
  if (gltfScene) {
    scene.remove(gltfScene);
    disposeObject(gltfScene);
    gltfScene = null;
  }

  const loader = new THREE.GLTFLoader();
  loader.load(path,
    (gltf) => {
      gltfScene = gltf.scene || gltf.scenes[0];
      // apply default placement (kept from your originals)
      gltfScene.position.set(3, -1, 4.5);
      gltfScene.scale.set(1,1,1);

      // compute bounding box & set controls target & zoom limits
      boundingBox = new THREE.Box3().setFromObject(gltfScene);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      controls.target.copy(center);

      // size-based zoom constraints
      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
      // tight min distance and a comfortable max distance
      controls.minDistance = Math.max(0.01, maxDim * 0.05);
      controls.maxDistance = Math.max(maxDim * 0.2, 2.5);

      // clone material & apply env + roughness as before
      gltfScene.traverse((child) => {
        if (!child.isMesh) return;
        let mat = (child.material && child.material.clone) ? child.material.clone() : undefined;
        if (!mat || mat.type !== "MeshStandardMaterial") mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        if (scene.environment) mat.envMap = scene.environment;
        mat.roughness = 0.1;
        mat.metalness = 0.0;
        mat.emissive = new THREE.Color(0x000000);
        child.material = mat;
        child.material.needsUpdate = true;
      });

      // apply uploaded textures to meshes
      applyUploadedTexturesToModel(gltfScene);

      scene.add(gltfScene);
      modelLoadedFlag = true;
      currentDesignIndex = idx;

      // ensure canvas visible and footer visible
      renderer.domElement.style.display = 'block';
      document.getElementById('designFooter').style.display = 'flex';
      document.getElementById('designFooter').setAttribute('aria-hidden', 'false');
      console.log("Loaded design", idx+1, "from", path);
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
    }
  );
}

function applyUploadedTexturesToModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    const name = child.name || "";
    if (lMeshes.includes(name) && uploadedTextureL) child.material.map = uploadedTextureL;
    else if (dMeshes.includes(name) && uploadedTextureD) child.material.map = uploadedTextureD;
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

/* ========== Upload / Drag-drop / Preview / Clear (same behaviour) ========== */
function setupUploadHandlers() {
  const items = [
    { inputId: "fileInputL", previewId: "previewL", clearId: "clearL", sectionId: "sectionL", errorId: "errorL", key: "L" },
    { inputId: "fileInputD", previewId: "previewD", clearId: "clearD", sectionId: "sectionD", errorId: "errorD", key: "D" }
  ];

  items.forEach(item => {
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

    // clear
    clearBtn.addEventListener('click', () => {
      input.value = "";
      preview.src = "";
      preview.style.display = 'none';
      section.classList.remove('has-image');
      clearBtn.style.display = 'none';
      errorEl.style.display = 'none';
      if (item.key === 'L') { uploadedTextureL = null; }
      else if (item.key === 'D') { uploadedTextureD = null; }
      if (gltfScene) applyUploadedTexturesToModel(gltfScene);
    });
  });
}

function handleFile(file, preview, section, clearBtn, errorEl, key) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    errorEl.textContent = "Invalid file type. Choose an image.";
    errorEl.style.display = 'block';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorEl.textContent = "File too large (max 5MB).";
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';
  const reader = new FileReader();
  reader.onload = (ev) => {
    preview.src = ev.target.result;
    preview.style.display = 'block';
    section.classList.add('has-image');
    clearBtn.style.display = 'inline-block';

    const objectUrl = URL.createObjectURL(file);
    textureLoader.load(objectUrl, (tex) => {
      tex.rotation = Math.PI / 2;
      tex.flipY = false;
      tex.center.set(0.5, 0.5);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1,1);

      if (key === 'L') uploadedTextureL = tex;
      else if (key === 'D') uploadedTextureD = tex;

      if (gltfScene) applyUploadedTexturesToModel(gltfScene);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    });
  };
  reader.readAsDataURL(file);
}

/* ========== QR scanner utility ========== */
let html5QrScanner = null;
function openQrScannerFor(key) {
  const modal = document.getElementById('qrScannerContainer');
  modal.style.display = 'block';

  const scannerDiv = document.getElementById('qrScanner');
  if (html5QrScanner) {
    try { html5QrScanner.stop(); } catch(e) {}
    html5QrScanner = null;
    scannerDiv.innerHTML = "";
  }

  html5QrScanner = new Html5Qrcode("qrScanner");
  const config = { fps: 10, qrbox: 220 };

  html5QrScanner.start({ facingMode: "environment" }, config,
    (decodedText, decodedResult) => {
      loadImageFromUrlIntoInput(decodedText, key);
      html5QrScanner.stop().then(() => { html5QrScanner.clear(); html5QrScanner = null; modal.style.display = 'none'; }).catch(()=>{ modal.style.display='none';});
    },
    (errorMessage) => { /* ignore decode errors */ }
  ).catch(err => {
    console.error("QR start failed:", err);
    alert("Could not start QR camera (permission?).");
    modal.style.display = 'none';
  });
}

function loadImageFromUrlIntoInput(url, key) {
  try {
    if (url.startsWith('data:')) {
      fetch(url).then(r => r.blob()).then(blob => {
        const file = new File([blob], `${key}_scanned.png`, { type: blob.type });
        populateFromScannedFile(file, key);
      }).catch(e => console.error(e));
    } else {
      fetch(url).then(r => {
        if (!r.ok) throw new Error("Network error");
        return r.blob();
      }).then(blob => {
        const file = new File([blob], `${key}_scanned.${(blob.type.split('/')[1]||'png')}`, { type: blob.type });
        populateFromScannedFile(file, key);
      }).catch(err => { console.error(err); alert("Couldn't fetch scanned image URL."); });
    }
  } catch (e) { console.error(e); }
}

function populateFromScannedFile(file, key) {
  const map = { L: 'fileInputL', D: 'fileInputD' };
  const input = document.getElementById(map[key]);
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  // reuse handler
  if (key === 'L') handleFile(file, document.getElementById('previewL'), document.getElementById('sectionL'), document.getElementById('clearL'), document.getElementById('errorL'), 'L');
  if (key === 'D') handleFile(file, document.getElementById('previewD'), document.getElementById('sectionD'), document.getElementById('clearD'), document.getElementById('errorD'), 'D');
}

/* ========== Wire UI Buttons ========== */
function wireUI() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    // show canvas and load first available model (if any)
    renderer.domElement.style.display = 'block';
    // show footer
    document.getElementById('designFooter').style.display = 'flex';
    document.getElementById('designFooter').setAttribute('aria-hidden','false');
    // find first non-empty modelPaths
    const idx = modelPaths.findIndex(p => p && p.trim() !== "");
    if (idx >= 0) loadGLBByIndex(idx);
    else alert("No GLB files provided in modelPaths. Edit the modelPaths array in the JS.");
  });

  // fullscreen
  document.getElementById('fullscreenBtn').addEventListener('click', async () => {
    const el = renderer.domElement;

    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        // Resize renderer and camera to full screen
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } catch (e) {
        console.warn("Fullscreen failed:", e);
      }
    } else {
      try {
        await document.exitFullscreen();
        // Restore normal size (70vh container)
        const container = document.getElementById("viewerContainer");
        renderer.setSize(container ? container.clientWidth : window.innerWidth, container ? container.clientHeight : window.innerHeight);
        camera.aspect = (container ? container.clientWidth : window.innerWidth) / (container ? container.clientHeight : window.innerHeight);
        camera.updateProjectionMatrix();
      } catch (e) {
        console.warn("Exit fullscreen failed:", e);
      }
    }
  });

  // Download (10s webm) - unchanged
  document.getElementById("downloadBtn").addEventListener("click", async () => {
    try {
      const stream = renderer.domElement.captureStream(30); // 30 FPS video stream
      const chunks = [];
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bathroom_design_${currentDesignIndex + 1 || 1}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      alert("Recording 10 seconds of your 3D view...");
      await new Promise((res) => setTimeout(res, 10000)); // ⏱ record for 10 seconds
      recorder.stop();
    } catch (e) {
      console.error("Recording failed:", e);
      alert("Recording failed: " + e.message);
    }
  });

  // rotation toggle & speed
  document.getElementById('autoRotateToggle').addEventListener('change', (e) => {
    autoRotate = e.target.checked;
  });
  document.getElementById('rotationSpeed').addEventListener('input', (e) => {
    rotationSpeed = parseFloat(e.target.value) || 0.0;
  });
}

/* ========== Wire QR buttons & close ========== */
function wireQrButtons() {
  document.getElementById('scanL').addEventListener('click', () => openQrScannerFor('L'));
  document.getElementById('scanD').addEventListener('click', () => openQrScannerFor('D'));
  document.getElementById('closeScannerBtn').addEventListener('click', () => {
    const modal = document.getElementById('qrScannerContainer');
    modal.style.display = 'none';
    if (html5QrScanner) {
      html5QrScanner.stop().then(()=>{ html5QrScanner.clear(); html5QrScanner=null; }).catch(()=>{ html5QrScanner=null; });
    }
  });
}

/* ========== Create footer buttons and attach handlers ========== */
function createFooterButtons() {
  const footer = document.getElementById('designFooter');
  footer.innerHTML = "";

  let activeBtn = null; // track the currently selected button

  // keep 7 buttons as in original
  for (let i = 0; i < 7; i++) {
    const btn = document.createElement('button');
    btn.id = `designBtn${i + 1}`;
    btn.textContent = `D${i + 1}`; // label
    if (!modelPaths[i] || modelPaths[i].trim() === "") btn.disabled = true;

    btn.addEventListener('click', () => {
      if (!modelPaths[i] || modelPaths[i].trim() === "") {
        alert("No GLB set for this design slot.");
        return;
      }

      loadGLBByIndex(i);

      // highlight active button and reset previous
      if (activeBtn) {
        activeBtn.style.background = "black";
        activeBtn.style.color = "white";
        activeBtn.style.border = "1px solid #fff";
      }
      btn.style.background = "#6c63ff";
      btn.style.color = "black";
      btn.style.border = "2px solid black";
      activeBtn = btn;
    });

    footer.appendChild(btn);
  }

  // Keep footer visible and usable during fullscreen
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

/* ========== Startup ========== */
(function startup() {
  initThree();
  setupUploadHandlers();
  wireUI();
  wireQrButtons();
  createFooterButtons();
})();
