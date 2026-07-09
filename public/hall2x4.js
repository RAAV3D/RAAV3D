/* Unified viewer with auto-rotation and zoom limits
   2x2 mode - Supports both L meshes (Tile) and D meshes (D_Tile)
   Includes "Apply to Other" feature
   UPDATED: Removed Firebase, QR Scanner, and Company features
*/

/* ========== Global Variables ========== */

/* ========== Put your GLB filenames/URLs here ========== */
const modelPaths = [
  "/models/hall.glb", "/models/room.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", "/models/.glb",
  "/models/.glb", "/models/.glb", ""
];

/* ========== Put your design image filenames/URLs here ========== */
const designImages = [
  "/images/hall.png", "/images/room.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", "/images/.png",
  "/images/.png", "/images/.png", ""
];

/* ========== L Mesh names (Original) ========== */
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

/* ========== D Mesh names (New - for second container) ========== */
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

/* ========== State & Three.js vars ========== */
let scene, camera, renderer, controls;
let gltfScene = null;
let boundingBox = null;
let modelLoadedFlag = false;
let currentDesignIndex = -1;
const textureLoader = new THREE.TextureLoader();
let uploadedTextureL = null;
let uploadedTextureD = null;

/* Auto rotation & clock */
let autoRotate = true;
let rotationSpeed = 0.6;
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

  scene.add(new THREE.AmbientLight(0x404040, 0.4));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6); dir.position.set(1,1,1); scene.add(dir);
  const pt = new THREE.PointLight(0xffffff, 0.4); pt.position.set(0,0,2); scene.add(pt);
  const hemi = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.2); scene.add(hemi);

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

  (function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (autoRotate && gltfScene && !isRecording) {
      gltfScene.rotation.y += rotationSpeed * delta;
    }
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    if (camera) {
      camera.aspect = window.innerWidth / (window.innerHeight * 1);
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(window.innerWidth, Math.floor(window.innerHeight * 1));
    }
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
      if (controls && controls.target) {
        controls.target.copy(center);
      }

      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
      controls.minDistance = Math.max(0.01, maxDim * 0.05);
      controls.maxDistance = Math.max(maxDim * 0.2, 2.5);

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

      applyUploadedTexturesToModel(gltfScene);

      scene.add(gltfScene);
      modelLoadedFlag = true;
      currentDesignIndex = idx;

      renderer.domElement.style.display = 'block';
      const footer = document.getElementById('designFooter');
      if (footer) {
        footer.style.display = 'flex';
        footer.setAttribute('aria-hidden', 'false');
      }
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

/* ========== Apply Textures to Model ========== */
function applyUploadedTexturesToModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    const name = child.name || "";
    
    if (lMeshes.includes(name) && uploadedTextureL) {
      child.material.map = uploadedTextureL;
      console.log('Applied L texture to mesh:', name);
    }
    
    if (dMeshes.includes(name) && uploadedTextureD) {
      child.material.map = uploadedTextureD;
      console.log('Applied D texture to mesh:', name);
    }
    
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
    { inputId: "fileTile", previewId: "previewTile", clearId: "clearTile", errorId: "errorTile", key: "Tile" },
    { inputId: "fileDTile", previewId: "previewDTile", clearId: "clearDTile", errorId: "errorDTile", key: "D_Tile" }
  ];

  items.forEach(item => {
    const input = document.getElementById(item.inputId);
    const preview = document.getElementById(item.previewId);
    const clearBtn = document.getElementById(item.clearId);
    const section = document.querySelector(`[data-category="${item.key}"]`);
    const errorEl = document.getElementById(item.errorId);
    const rotateBtn = document.getElementById(item.key === 'Tile' ? 'rotateTile' : 'rotateDTile');

    if (!input) {
      console.warn(`Input element not found: ${item.inputId}`);
      return;
    }

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFile(file, preview, section, clearBtn, errorEl, item.key, rotateBtn);
    });

    if (section) {
      section.addEventListener('dragover', (ev) => { ev.preventDefault(); section.style.borderColor = 'var(--accent)'; });
      section.addEventListener('dragleave', (ev) => { ev.preventDefault(); if (!section.classList.contains('has-image')) section.style.borderColor = ''; });
      section.addEventListener('drop', (ev) => {
        ev.preventDefault();
        section.style.borderColor = '';
        const file = ev.dataTransfer.files && ev.dataTransfer.files[0];
        if (file) {
          const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
          handleFile(file, preview, section, clearBtn, errorEl, item.key, rotateBtn);
        }
      });
    }

    if (rotateBtn) {
      rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentRotation = parseInt(rotateBtn.dataset.rotation || '0');
        const newRotation = (currentRotation + 90) % 360;
        rotateBtn.dataset.rotation = newRotation;
        if (preview) preview.style.transform = `rotate(${newRotation}deg)`;
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = "";
        if (preview) {
          preview.src = "";
          preview.style.display = 'none';
          preview.style.transform = 'rotate(0deg)';
        }
        if (section) section.classList.remove('has-image');
        clearBtn.style.display = 'none';
        if (rotateBtn) {
          rotateBtn.style.display = 'none';
          rotateBtn.dataset.rotation = '0';
        }
        if (errorEl) errorEl.style.display = 'none';
        
        if (item.key === 'Tile') { 
          uploadedTextureL = null;
          const applyLToD = document.getElementById('applyLToD');
          if (applyLToD) applyLToD.style.display = 'none';
        }
        if (item.key === 'D_Tile') { 
          uploadedTextureD = null;
          const applyDToL = document.getElementById('applyDToL');
          if (applyDToL) applyDToL.style.display = 'none';
        }
        
        if (gltfScene) applyUploadedTexturesToModel(gltfScene);
      });
    }
  });

  // ========== Apply to Other Container Buttons ==========
  const applyLToD = document.getElementById('applyLToD');
  if (applyLToD) {
    applyLToD.addEventListener('click', (e) => {
      e.stopPropagation();
      if (uploadedTextureL) {
        uploadedTextureD = uploadedTextureL.clone();
        uploadedTextureD.needsUpdate = true;
        
        const previewDTile = document.getElementById('previewDTile');
        const previewTile = document.getElementById('previewTile');
        if (previewDTile && previewTile) {
          previewDTile.src = previewTile.src;
          previewDTile.style.display = 'block';
        }
        
        const dSection = document.querySelector('[data-category="D_Tile"]');
        if (dSection) {
          dSection.classList.add('has-image');
          const clearBtn = dSection.querySelector('.clear-btn');
          if (clearBtn) clearBtn.style.display = 'inline-block';
          const rotateBtn = dSection.querySelector('.rotate-btn');
          if (rotateBtn) rotateBtn.style.display = 'block';
          const dragText = dSection.querySelector('.drag-text');
          if (dragText) dragText.style.display = 'none';
        }
        
        const applyDToL = document.getElementById('applyDToL');
        if (applyDToL) applyDToL.style.display = 'inline-block';
        
        if (gltfScene) applyUploadedTexturesToModel(gltfScene);
        
        alert('Same Tile in Wall and Floor applied successfully');
      }
    });
  }

  const applyDToL = document.getElementById('applyDToL');
  if (applyDToL) {
    applyDToL.addEventListener('click', (e) => {
      e.stopPropagation();
      if (uploadedTextureD) {
        uploadedTextureL = uploadedTextureD.clone();
        uploadedTextureL.needsUpdate = true;
        
        const previewTile = document.getElementById('previewTile');
        const previewDTile = document.getElementById('previewDTile');
        if (previewTile && previewDTile) {
          previewTile.src = previewDTile.src;
          previewTile.style.display = 'block';
        }
        
        const lSection = document.querySelector('[data-category="Tile"]');
        if (lSection) {
          lSection.classList.add('has-image');
          const clearBtn = lSection.querySelector('.clear-btn');
          if (clearBtn) clearBtn.style.display = 'inline-block';
          const rotateBtn = lSection.querySelector('.rotate-btn');
          if (rotateBtn) rotateBtn.style.display = 'block';
          const dragText = lSection.querySelector('.drag-text');
          if (dragText) dragText.style.display = 'none';
        }
        
        const applyLToD = document.getElementById('applyLToD');
        if (applyLToD) applyLToD.style.display = 'inline-block';
        
        if (gltfScene) applyUploadedTexturesToModel(gltfScene);
        
        alert('D tile applied to L mesh successfully!');
      }
    });
  }
}

function handleFile(file, preview, section, clearBtn, errorEl, key, rotateBtn) {
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
    if (preview) {
      preview.src = ev.target.result;
      preview.style.display = 'block';
    }
    if (section) section.classList.add('has-image');
    if (clearBtn) clearBtn.style.display = 'inline-block';
    if (rotateBtn) rotateBtn.style.display = 'block';

    const objectUrl = URL.createObjectURL(file);
    textureLoader.load(objectUrl, (tex) => {
      tex.rotation = Math.PI / 2;
      tex.flipY = false;
      tex.center.set(0.5, 0.5);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);

      if (key === 'Tile') {
        uploadedTextureL = tex;
        console.log('L texture loaded');
        const applyLToD = document.getElementById('applyLToD');
        if (applyLToD) applyLToD.style.display = 'inline-block';
      } else if (key === 'D_Tile') {
        uploadedTextureD = tex;
        console.log('D texture loaded');
        const applyDToL = document.getElementById('applyDToL');
        if (applyDToL) applyDToL.style.display = 'inline-block';
      }

      if (gltfScene) applyUploadedTexturesToModel(gltfScene);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    });
  };
  reader.readAsDataURL(file);
}

/* ========== Wire UI Buttons ========== */
function wireUI() {
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      if (renderer) renderer.domElement.style.display = 'block';
      const footer = document.getElementById('designFooter');
      if (footer) {
        footer.style.display = 'flex';
        footer.setAttribute('aria-hidden','false');
      }
      const goToTopBtn = document.getElementById('goToTopBtn');
      if (goToTopBtn) goToTopBtn.classList.add('show');
      
      const idx = modelPaths.findIndex(p => p && p.trim() !== "");
      if (idx >= 0) loadGLBByIndex(idx);
      else alert("No GLB files provided in modelPaths. Edit the modelPaths array.");
    });
  }

  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', async () => {
      if (!renderer) return;
      const el = renderer.domElement;

      if (!document.fullscreenElement) {
        try {
          await el.requestFullscreen();
          renderer.setSize(window.innerWidth, window.innerHeight);
          if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
          }
        } catch (e) { console.warn("Fullscreen failed:", e); }
      } else {
        try {
          await document.exitFullscreen();
        } catch (e) { console.warn("Exit fullscreen failed:", e); }
      }
    });
  }

  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      if (!renderer || isRecording) {
        if (isRecording) {
          alert("Recording already in progress!");
          return;
        }
      }
      
      if (!renderer) {
        alert("Renderer not initialized!");
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
          a.download = `hall_design_${currentDesignIndex + 1 || 1}.webm`;
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
  }

  const autoRotateToggle = document.getElementById('autoRotateToggle');
  if (autoRotateToggle) {
    autoRotateToggle.addEventListener('change', (e) => {
      autoRotate = e.target.checked;
    });
  }
  
  const rotationSpeedInput = document.getElementById('rotationSpeed');
  if (rotationSpeedInput) {
    rotationSpeedInput.addEventListener('input', (e) => {
      rotationSpeed = parseFloat(e.target.value) || 0.0;
    });
  }
  
  const goToTopBtn = document.getElementById('goToTopBtn');
  if (goToTopBtn) {
    goToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('goToTopBtn');
    if (btn) {
      if (window.scrollY > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }
  });
}

/* ========== Create footer buttons ========== */
function createFooterButtons() {
  const footer = document.getElementById('designFooter');
  if (!footer) return;
  
  footer.innerHTML = "";
  let activeBtn = null;

  for (let i = 0; i < 2; i++) {
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
    const f = document.getElementById("designFooter");
    if (f) {
      if (document.fullscreenElement) {
        f.style.position = "fixed";
        f.style.bottom = "10px";
        f.style.left = "0";
        f.style.right = "0";
        f.style.zIndex = "999999";
        f.style.display = "flex";
        f.style.pointerEvents = "auto";
      } else {
        f.style.display = "flex";
      }
    }
  });
}

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