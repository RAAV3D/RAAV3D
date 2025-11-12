const modelPaths = [
  "bathroom(18x12)1.glb", // Design 1
  "bathroom(18x12)2.glb", // Design 2
  "bathroom(18x12)3.glb", // Design 3
  "bathroom(18x12)4.glb", // Design 4
  "bathroom(18x12)5.glb", // Design 5
  "bathroom(18x12)6.glb", // Design 6
  "bathroom(18x12)7.glb", // Design 7
  "bathroom(18x12)8.glb", // Design 8
  "bathroom(18x12)9.glb", // Design 9
  "", // Design 10
  "", // Design 11
  "", // Design 12
  "", // Design 13
  "", // Design 14
  ""  // Design 15
];
/* =================================================================== */

/* Mesh name groups (keep/extend as needed) */
const lMeshes = ['L001','L002','L003','L004','L005','L006','L007','L008','L009','L010','L011','L012','L013','L014','L015','L016','L017','L018','L019','L020','L021','L022','L023','L024','L025','L026','L027','L028','L029','L030','L031','L032','L033','L034','L035','L036','L037','L038','L039','L040','L041','L042','L043','L044','L045','L046','L047','L048'];
const dMeshes = ['D001','D002','D003','D004','D005','D006','D007','D008','D009','D010','D011','D012','D013','D014','D015','D016','D017','D018','D019','D020','D021','D022','D023','D024','D025','D026','D027','D028','D029','D030','D031','D032','D033','D034','D035','D036','D037','D038','D039','D040','D041','D042','D043','D044','D045','D046','D047','D048','D049','D050','D051','D052','D053'];
const hlMeshes = ['HL001','HL002','HL003','HL004','HL005','HL006','HL007','HL008','HL009','HL010','HL011','HL012']; // extend as needed

let scene, camera, renderer, controls;
let gltfScene = null;
let autoRotate = true;
let rotationSpeed = 0.3;
let currentDesignIndex = -1;
const clock = new THREE.Clock();

let uploadedTextureL = null;
let uploadedTextureD = null;
let uploadedTextureHL = null;

// ===== Initialize Three.js =====
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const container = document.getElementById("viewerContainer");
  const canvas = document.getElementById("three-canvas");

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(3, 2, 5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 5, 2);
  scene.add(dir);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 8;

  animate();
}

// ===== Animation Loop =====
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (autoRotate && gltfScene) gltfScene.rotation.y += rotationSpeed * delta;
  controls.update();
  renderer.render(scene, camera);
}

// ===== Load Model =====
function loadGLBByIndex(index) {
  if (index < 0 || index >= modelPaths.length || !modelPaths[index]) {
    alert("No GLB model defined for this design slot.");
    return;
  }

  if (gltfScene) {
    scene.remove(gltfScene);
    gltfScene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
  }

  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPaths[index],
    (gltf) => {
      gltfScene = gltf.scene;
      gltfScene.position.set(3, -1, 4.5);
      gltfScene.scale.set(1, 1, 1);
      scene.add(gltfScene);
      applyTextures();
      document.getElementById("viewerContainer").style.display = "block";
      document.getElementById("designFooter").style.display = "flex";
      currentDesignIndex = index;
    },
    undefined,
    (err) => console.error("GLB load error:", err)
  );
}

// ===== Apply Uploaded Textures =====
function applyTextures() {
  if (!gltfScene) return;
  gltfScene.traverse((child) => {
    if (!child.isMesh) return;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.0 });
    if (child.name.startsWith("L") && uploadedTextureL) mat.map = uploadedTextureL;
    if (child.name.startsWith("D") && uploadedTextureD) mat.map = uploadedTextureD;
    if (child.name.startsWith("HL") && uploadedTextureHL) mat.map = uploadedTextureHL;
    mat.needsUpdate = true;
    child.material = mat;
  });
}

// ===== Handle Image Uploads =====
function handleFileUpload(inputId, key) {
  const input = document.getElementById(inputId);
  const texLoader = new THREE.TextureLoader();

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    texLoader.load(url, (tex) => {
      tex.flipY = false;
      tex.rotation = Math.PI / 2;
      tex.center.set(0.5, 0.5);
      if (key === "L") uploadedTextureL = tex;
      if (key === "D") uploadedTextureD = tex;
      if (key === "HL") uploadedTextureHL = tex;
      applyTextures();
    });
    document.getElementById("preview" + key).src = url;
    document.getElementById("preview" + key).style.display = "block";
    document.getElementById("section" + key).classList.add("has-image");
  });
}

// ===== Footer Buttons (D1–D15) =====
function createFooterButtons() {
  const footer = document.getElementById("designFooter");
  footer.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    const b = document.createElement("button");
    b.textContent = "D" + (i + 1);
    if (!modelPaths[i]) b.disabled = true;
    b.addEventListener("click", () => loadGLBByIndex(i));
    footer.appendChild(b);
  }
}

// ===== Main UI Buttons =====
function wireUI() {
  // Generate Model
  document.getElementById("generateBtn").addEventListener("click", () => {
    document.getElementById("viewerContainer").style.display = "block";
    const first = modelPaths.findIndex((m) => m);
    if (first >= 0) loadGLBByIndex(first);
  });

  // ✅ Fullscreen logic (keeps footer visible)
  document.getElementById("fullscreenBtn").addEventListener("click", async () => {
    const container = document.getElementById("viewerContainer");
    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
      } catch (e) {
        console.warn("Fullscreen failed:", e);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (e) {
        console.warn("Exit fullscreen failed:", e);
      }
    }
  });

  // ✅ Keep footer visible during fullscreen
  document.addEventListener("fullscreenchange", () => {
    const footer = document.getElementById("designFooter");
    if (document.fullscreenElement) {
      footer.style.display = "flex";
      footer.style.position = "absolute";
      footer.style.bottom = "10px";
      footer.style.left = "0";
      footer.style.right = "0";
      footer.style.zIndex = "99999";
    } else {
      footer.style.display = "flex";
    }
  });

  // ✅ “Download” button (records 10s video)
  document.getElementById("downloadBtn").addEventListener("click", async () => {
    try {
      const stream = renderer.domElement.captureStream(30); // 30fps
      const chunks = [];
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
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
      await new Promise((res) => setTimeout(res, 10000));
      recorder.stop();
    } catch (e) {
      console.error("Recording failed:", e);
      alert("Recording failed: " + e.message);
    }
  });

  // Auto-rotate and speed controls
  document.getElementById("autoRotateToggle").addEventListener("change", (e) => {
    autoRotate = e.target.checked;
  });
  document.getElementById("rotationSpeed").addEventListener("input", (e) => {
    rotationSpeed = parseFloat(e.target.value) || 0;
  });
}

// ===== Initialize Everything =====
function init() {
  initThree();
  handleFileUpload("fileInputL", "L");
  handleFileUpload("fileInputD", "D");
  handleFileUpload("fileInputHL", "HL");
  createFooterButtons();
  wireUI();
}

window.onload = init;