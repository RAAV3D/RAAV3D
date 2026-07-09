/* Unified viewer with design buttons, auto-rotation and zoom limits
   Book Match mode - Without Firebase/Company/Scan
*/

/* ========== Global Variables ========== */
const modelPaths = [
  "/models/parkingbm1.glb", "/models/parkingbm2.glb", "/models/parkingbm3.glb",
  "/models/parkingbm4.glb", "/models/parkingbm5.glb", "/models/parkingbm6.glb",
  "/models/parkingbm7.glb", "/models/parkingbm8.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", ""
];

/* ========== Put your design image filenames/URLs here ========== */
const designImages = [
  "/images/parking3dbm1.png", "/images/parking3dbm2.png", "/images/parking3dbm3.png",
  "/images/parking3dbm4.png", "/images/parking3dbm5.png", "/images/parking3dbm6.png",
  "/images/parking3dbm7.png", "/images/parking3dbm8.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", ""
];

/* Mesh name groups - Book Match uses L meshes only */
const lMeshes = ['L001','L002','L003','L004','L005','L006','L007','L008','L009','L010','L011','L012','L013','L014','L015','L016','L017','L018','L019','L020','L021','L022','L023','L024','L025','L026','L027','L028','L029','L030','L031','L032','L033','L034','L035','L036','L037','L038','L039','L040','L041','L042','L043','L044','L045','L046','L047','L048','L049','L050','L051','L052','L053','L054','L055','L056','L057','L058','L059','L060','L061','L062','L063','L064','L065','L066','L067','L068','L069','L070','L071','L072','L073','L074','L075','L076','L077','L078','L079','L080','L081','L082','L083','L084','L085','L086','L087','L088','L089','L090','L091','L092','L093','L094','L095','L096'];

/* ========== State & Three.js vars ========== */
let scene, camera, renderer, controls;
let gltfScene = null;
let boundingBox = null;
let modelLoadedFlag = false;
let currentDesignIndex = -1;
const textureLoader = new THREE.TextureLoader();
let uploadedTextureL = null;

/* Auto rotation & clock */
let autoRotate = true;
let rotationSpeed = 0.3;
const clock = new THREE.Clock();

/* Loading flag */
let isLoading = false;

/* Video recording flag */
let isRecording = false;

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
  renderer.domElement.style.display = 'none';

  // Lights
  scene.add(new THREE.AmbientLight(0x404040, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8); dir.position.set(1,1,1); scene.add(dir);
  const pt = new THREE.PointLight(0xffffff, 0.6); pt.position.set(0,0,2); scene.add(pt);
  const hemi = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.3); scene.add(hemi);

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

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (autoRotate && gltfScene && !isRecording) {
      gltfScene.rotation.y += rotationSpeed * delta;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / (window.innerHeight * 1);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, Math.floor(window.innerHeight * 1));
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

  if (gltfScene) {
    scene.remove(gltfScene);
    disposeObject(gltfScene);
    gltfScene = null;
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

      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
      controls.minDistance = Math.max(0.01, maxDim * 0.05);
      controls.maxDistance = Math.max(maxDim * 0.2, 2.5);

      gltfScene.traverse((child) => {
        if (!child.isMesh) return;
        let mat = (child.material && child.material.clone) ? child.material.clone() : new THREE.MeshStandardMaterial({ color: 0xffffff });
        if (!mat || mat.type !== "MeshStandardMaterial") mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const meshName = child.name || "";
        if (lMeshes.includes(meshName)) {
          mat.roughness = 1.0;
          mat.metalness = 0.0;
          mat.envMap = null;
        } else {
          if (scene.environment) mat.envMap = scene.environment;
          mat.roughness = 0.1;
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
    }
  );
}

function applyUploadedTexturesToModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    const name = child.name || "";
    if (lMeshes.includes(name) && uploadedTextureL) child.material.map = uploadedTextureL;
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
function setupUploadHandlers() {
  const items = [
    { inputId: "fileInputL", previewId: "previewL", clearId: "clearL", sectionId: "sectionL", errorId: "errorL", key: "L" }
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

    clearBtn.addEventListener('click', () => {
      input.value = "";
      preview.src = "";
      preview.style.display = 'none';
      section.classList.remove('has-image');
      clearBtn.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (item.key === 'L') { uploadedTextureL = null; }
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

      if (gltfScene) applyUploadedTexturesToModel(gltfScene);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    });
  };
  reader.readAsDataURL(file);
}

/* ========== Wire UI Buttons ========== */
function wireUI() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    renderer.domElement.style.display = 'block';
    document.getElementById('designFooter').style.display = 'flex';
    document.getElementById('designFooter').setAttribute('aria-hidden','false');
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
        renderer.setSize(window.innerWidth, Math.floor(window.innerHeight * 0.72));
        camera.aspect = window.innerWidth / (window.innerHeight * 0.72);
        camera.updateProjectionMatrix();
      } catch (e) { console.warn("Exit fullscreen failed:", e); }
    }
  });

  // Download button
  document.getElementById("downloadBtn").addEventListener("click", async () => {
    if (isRecording) {
      alert("Recording already in progress!");
      return;
    }
    
    try {
      isRecording = true;
      
      const originalAutoRotate = autoRotate;
      autoRotate = false;
      
      const originalCameraPosition = camera.position.clone();
      const originalTarget = controls.target.clone();
      
      const videoStream = renderer.domElement.captureStream(60);
      
      const audio = new Audio("/audio/background.mp3");
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioContext.createMediaElementSource(audio);
      const audioDestination = audioContext.createMediaStreamDestination();
      audioSource.connect(audioDestination);
      audioSource.connect(audioContext.destination);
      
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);
      
      const chunks = [];
      const recorder = new MediaRecorder(combinedStream, { 
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 8000000
      });
      
      recorder.ondataavailable = (e) => { 
        if (e.data.size > 0) chunks.push(e.data); 
      };
      
      recorder.onstop = () => {
        autoRotate = originalAutoRotate;
        camera.position.copy(originalCameraPosition);
        controls.target.copy(originalTarget);
        
        audio.pause();
        audio.currentTime = 0;
        audioContext.close();
        
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `parking_design_${currentDesignIndex + 1 || 1}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        isRecording = false;
        console.log("Recording completed successfully");
      };
      
      await audioContext.resume();
      await audio.play();
      recorder.start();
      
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      const animationDuration = 10000;
      const startTime = Date.now();
      
      function animateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const easedProgress = easeInOutCubic(progress);
        
        if (gltfScene) {
          gltfScene.rotation.y += 0.01;
        }
        
        let currentPos = startPos.clone();
        let currentTarget = startTarget.clone();
        
        if (progress < 0.25) {
          const phaseProgress = progress / 0.25;
          currentPos.x = startPos.x + (2 * phaseProgress);
          currentPos.z = startPos.z - (1 * phaseProgress);
        } else if (progress < 0.5) {
          const phaseProgress = (progress - 0.25) / 0.25;
          currentPos.y = startPos.y + (1.5 * phaseProgress);
        } else if (progress < 0.75) {
          const phaseProgress = (progress - 0.5) / 0.25;
          currentPos.x = (startPos.x + 2) - (4 * phaseProgress);
          currentPos.z = (startPos.z - 1) + (2 * phaseProgress);
        } else {
          const phaseProgress = (progress - 0.75) / 0.25;
          currentPos.y = (startPos.y + 1.5) - (1.5 * phaseProgress);
        }
        
        camera.position.copy(currentPos);
        camera.lookAt(currentTarget);
        controls.update();
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      }
      
      animateCamera();
      
      alert("Recording for 10 seconds with smooth camera movement...");
      
      await new Promise(res => setTimeout(res, 10000));
      recorder.stop();
      
    } catch (e) {
      console.error("Recording failed:", e);
      isRecording = false;
      alert("Recording failed: " + e.message);
    }
  });

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

/* ========== Create footer buttons ========== */
function createFooterButtons() {
  const footer = document.getElementById('designFooter');
  footer.innerHTML = "";
  let activeBtn = null;

  for (let i = 0; i < 6; i++) {
    if (!modelPaths[i] || modelPaths[i].trim() === "") continue;

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
  const boxes = document.querySelectorAll('.design-box');
  boxes.forEach(box => box.style.pointerEvents = 'none');
}

function enableDesignButtons() {
  const boxes = document.querySelectorAll('.design-box');
  boxes.forEach(box => {
    const idx = parseInt(box.id.replace('designBox', '')) - 1;
    if (modelPaths[idx] && modelPaths[idx].trim() !== "") box.style.pointerEvents = 'auto';
  });
}

/* ========== Startup ========== */
(function startup() {
  initThree();
  setupUploadHandlers();
  wireUI();
  createFooterButtons();
})();