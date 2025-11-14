// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);  // Light gray background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;  // For better color accuracy
document.body.appendChild(renderer.domElement);

// Add lights (reduced intensities)
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);  // Reduced from 1.0
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);  // Reduced from 1.5
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 0.6);  // Reduced from 1.2
pointLight.position.set(0, 0, 2);
scene.add(pointLight);
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.3);  // Reduced from 0.6
scene.add(hemisphereLight);

// Environment map for reflections
let envTexture;
try {
    envTexture = new THREE.CubeTextureLoader().load([
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
        'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
    ]);
    scene.environment = envTexture;
} catch (e) {
    console.log('Env map failed to load, using null');
    scene.environment = null;
}

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load the GLB model (but don't add to scene yet)
const loader = new THREE.GLTFLoader();
let gltfScene;  // Store the loaded scene
let modelLoaded = false;  // Flag to check if model is loaded
let uploadedTextureL = null;  // Store the uploaded texture for L
let uploadedTextureD = null;  // Store the uploaded texture for D
loader.load(
    '/models/parking5.glb',  // File name as specified
    function (gltf) {
        gltfScene = gltf.scene;
        gltfScene.position.set(-1, -2, 3.5);
        gltfScene.scale.set(1, 1, 1);
        console.log('Model loaded successfully (not added to scene yet).');
        modelLoaded = true;
         // Compute bounding box
        boundingBox = new THREE.Box3().setFromObject(gltfScene);
        console.log('Bounding box:', boundingBox);
        // Prepare materials (but don't add to scene)
        gltfScene.traverse((child) => {
            if (child.isMesh) {
                console.log('Found mesh:', child.name);
                const meshNames = ['D001', 'D002', 'D003', 'D004', 'D005', 'D006', 'D007', 'D008',
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
                                   'L001', 'L002', 'L003', 'L004', 'L005', 'L006', 'L007', 'L008',
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
                                   'L089', 'L090', 'L091', 'L092', 'L093', 'L094', 'L095', 'L096'];  // Removed HL and F meshes from meshNames
                if (meshNames.includes(child.name)) {
                    console.log('Preparing mesh for texturing:', child.name);
                    child.material = child.material.clone();
                    child.material.isCloned = true;
                    if (child.material.type !== 'MeshStandardMaterial') {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    }
                    // Glass-like reflections for tiles (including flooring)
                    child.material.envMap = envTexture || null;
                    child.material.roughness = 0.1;  // Low roughness for high reflectivity (glass-like)
                    child.material.metalness = 0.0;  // Non-metallic for glass
                    child.material.emissive.set(0x000000);  // No emissive for realistic glass
                    console.log('Updated material for glass-like reflections on:', child.name);
                } else {
                    // Glass-like reflections for walls too
                    child.material = child.material.clone();
                    if (child.material.type === 'MeshStandardMaterial') {
                        child.material.envMap = envTexture || null;
                        child.material.roughness = 0.1;  // Glass-like for walls
                        child.material.metalness = 0.0;
                        child.material.emissive.set(0x000000);
                        child.material.color.set(0xffffff);  // White for glass feel
                    } else {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xffffff, envMap: envTexture || null, roughness: 0.1, metalness: 0.0 });
                    }
                    console.log('Updated wall material for glass-like reflections on:', child.name);
                }
                child.material.needsUpdate = true;
                                // Special case: Change color of "Room" wall to black
                if (child.name === "Room") {
                    child.material.color.set(0x808080);
                }
            }
        });
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLB:', error);
    }
);

// Store uploaded image sources (for previews)
let uploadedImages = {};

// Enhanced upload handler (previews show in containers with drag/drop)
function handleFileUpload(input, preview, error, clearBtn, container, dragText) {
    input.addEventListener('change', (e) => {
        processFile(e.target.files[0], preview, error, clearBtn, container, dragText);
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.style.borderColor = '#8a2be2';
    });
    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!container.classList.contains('has-image')) container.style.borderColor = '#ddd';
    });
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            processFile(file, preview, error, clearBtn, container, dragText);
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        preview.src = '';
        preview.style.display = 'none';
        dragText.style.display = 'block';
        error.style.display = 'none';
        container.classList.remove('has-image');
        clearBtn.style.display = 'none';
        // Remove from uploadedImages
        const category = container.dataset.category;
        delete uploadedImages[category];
        // Also clear the texture variable
        if (category === 'L') uploadedTextureL = null;
        else if (category === 'D') uploadedTextureD = null;
    });
}

function processFile(file, preview, error, clearBtn, container, dragText) {
    if (file) {
        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                dragText.style.display = 'none';
                error.style.display = 'none';
                container.classList.add('has-image');
                clearBtn.style.display = 'inline-block';
                // Store image source
                const category = container.dataset.category;
                uploadedImages[category] = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            error.textContent = 'Invalid image (must be JPG/PNG, <=5MB).';
            error.style.display = 'block';
            preview.style.display = 'none';
            dragText.style.display = 'block';
            container.classList.remove('has-image');
            clearBtn.style.display = 'none';
        }
    }
}

// Attach handlers
const sections = [
    { input: document.getElementById('fileInputL'), preview: document.getElementById('previewL'), error: document.getElementById('errorL'), clear: document.getElementById('clearL'), container: document.querySelector('[data-category="L"]'), dragText: document.querySelector('[data-category="L"] .drag-text') },
    { input: document.getElementById('fileInputD'), preview: document.getElementById('previewD'), error: document.getElementById('errorD'), clear: document.getElementById('clearD'), container: document.querySelector('[data-category="D"]'), dragText: document.querySelector('[data-category="D"] .drag-text') }
];

sections.forEach(({ input, preview, error, clear, container, dragText }) => {
    handleFileUpload(input, preview, error, clear, container, dragText);
});

// Handle file inputs (for texture loading)
const fileInputL = document.getElementById('fileInputL');
fileInputL.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected for L:', file.name);
        textureLoader.load(
            URL.createObjectURL(file),
            function(texture) {
                uploadedTextureL = texture;
                uploadedTextureL.rotation = Math.PI / 2;
                uploadedTextureL.flipY = false;
                uploadedTextureL.center.set(0.5, 0.5);
                uploadedTextureL.wrapS = THREE.RepeatWrapping;
                uploadedTextureL.wrapT = THREE.RepeatWrapping;
                uploadedTextureL.repeat.set(1, 1);
                console.log('Texture loaded for L, orientation corrected, and set to repeat');
            },
            undefined,
            function(error) {
                console.error('Error loading texture for L:', error);
            }
        );
    }
});

const fileInputD = document.getElementById('fileInputD');
fileInputD.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected for D:', file.name);
        textureLoader.load(
            URL.createObjectURL(file),
            function(texture) {
                uploadedTextureD = texture;
                uploadedTextureD.rotation = Math.PI / 2;
                uploadedTextureD.flipY = false;
                uploadedTextureD.center.set(0.5, 0.5);
                uploadedTextureD.wrapS = THREE.RepeatWrapping;
                uploadedTextureD.wrapT = THREE.RepeatWrapping;
                uploadedTextureD.repeat.set(1, 1);
                console.log('Texture loaded for D, orientation corrected, and set to repeat');
            },
            undefined,
            function(error) {
                console.error('Error loading texture for D:', error);
            }
        );
    }
});

const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', function() {
    if (modelLoaded) {
        // Add model to scene only now
        scene.add(gltfScene);
        console.log('Model added to scene.');
                // Set controls target to the center of the bounding box
        if (boundingBox) {
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            controls.target.copy(center);
            // Set min and max distance based on box size
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            controls.minDistance = 0.01;
            controls.maxDistance = maxDim * 0.38;  // Allow zooming out to twice the max dimension
        }
        // Apply textures to hardcoded meshes
        console.log('Applying textures to meshes...');
        let appliedCount = 0;
        gltfScene.traverse((child) => {
            if (child.isMesh) {
                // Hardcoded assignments (edit these lists as needed)
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
                                'L089', 'L090', 'L091', 'L092', 'L093', 'L094', 'L095', 'L096',];
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
                                   'D089', 'D090', 'D091', 'D092', 'D093', 'D094', 'D095', 'D096',];
                
                if (lMeshes.includes(child.name) && uploadedTextureL) {
                    child.material.map = uploadedTextureL;
                    child.material.needsUpdate = true;
                    appliedCount++;
                    console.log('L texture applied to:', child.name);
                } else if (dMeshes.includes(child.name) && uploadedTextureD) {
                    child.material.map = uploadedTextureD;
                    child.material.needsUpdate = true;
                    appliedCount++;
                    console.log('D texture applied to:', child.name);
                }
            }
        });
        console.log('Textures applied to', appliedCount, 'meshes');
        if (appliedCount === 0) {
            alert('No matching meshes found or no textures uploaded. Check mesh names in console.');
        } else {
            // Show the 3D canvas
            const canvas = document.querySelector('canvas');
            canvas.style.display = 'block';
        }
    } else {
        alert('Please ensure the model is loaded.');
    }
});

// Handle download video button
const downloadBtn = document.getElementById('downloadBtn');
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

downloadBtn.addEventListener('click', async () => {
    if (!modelLoaded || !scene.children.includes(gltfScene)) {
        alert('Please generate the 3D model first.');
        return;
    }
    if (!window.MediaRecorder) {
        alert('Video recording is not supported in this browser.');
        return;
    }
    if (isRecording) {
        alert('Recording is already in progress.');
        return;
    }

    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Recording...';
    isRecording = true;
    recordedChunks = [];

    // Capture canvas stream
    const canvas = renderer.domElement;
    const stream = canvas.captureStream(30); // 30 FPS
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '3d_model_video.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download Video';
        isRecording = false;
        console.log('Video downloaded successfully.');
    };

    // Start recording and animate for 10 seconds
    mediaRecorder.start();
    let startTime = Date.now();
    const duration = 10000; // 10 seconds

    const recordLoop = () => {
        if (Date.now() - startTime < duration) {
            // Rotate the model slowly for dynamic video
            if (gltfScene) {
                gltfScene.rotation.y += 0.01; // Slow rotation
            }
            renderer.render(scene, camera);
            requestAnimationFrame(recordLoop);
        } else {
            mediaRecorder.stop();
        }
    };
    recordLoop();
});
// Handle full screen button
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
    if (!modelLoaded || !scene.children.includes(gltfScene)) {
        alert('Please generate the 3D model first.');
        return;
    }
    const canvas = renderer.domElement;
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { // Safari
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE11
        canvas.msRequestFullscreen();
    }
});
// Position camera
camera.position.z = 5;

// Orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // Auto-rotate the model if it's in the scene
    if (gltfScene && scene.children.includes(gltfScene)) {
        gltfScene.rotation.y += 0.005; // Slow auto-rotation (adjust speed as needed)
    }
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------
// ✅ QR SCANNER INTEGRATION
// -----------------------------
let html5QrCode = null;
let currentCategory = null;

const qrScannerContainer = document.getElementById("qrScannerContainer");
const qrScanner = document.getElementById("qrScanner");
const closeScannerBtn = document.getElementById("closeScannerBtn");

function startQRScanner(category) {
    currentCategory = category;
    qrScannerContainer.style.display = "block";
    html5QrCode = new Html5Qrcode("qrScanner");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code Scanned:", decodedText);
            if (decodedText.startsWith("http")) {
                applyScannedImage(decodedText, category);
                stopQRScanner();
            } else {
                alert("Invalid QR. It must contain an image URL.");
            }
        },
        (error) => {}
    ).catch((err) => console.error("QR start error:", err));
}

function stopQRScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            qrScannerContainer.style.display = "none";
        });
    }
}

closeScannerBtn.addEventListener("click", stopQRScanner);

function applyScannedImage(url, category) {
    const section = document.querySelector(`[data-category="${category}"]`);
    const preview = section.querySelector(".preview");
    const dragText = section.querySelector(".drag-text");
    const clearBtn = section.querySelector(".clear-btn");
    const error = section.querySelector(".error");

    preview.src = url;
    preview.style.display = "block";
    dragText.style.display = "none";
    section.classList.add("has-image");
    clearBtn.style.display = "inline-block";
    error.style.display = "none";
    uploadedImages[category] = url;

    textureLoader.load(url, (texture) => {
        texture.rotation = Math.PI / 2;
        texture.flipY = false;
        texture.center.set(0.5, 0.5);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        if (category === 'L') uploadedTextureL = texture;
        if (category === 'D') uploadedTextureD = texture;
        console.log(`✅ Texture from QR applied to ${category}`);
    }, undefined, (err) => {
        console.error('Error loading texture from QR URL:', err);
        alert('Failed to load texture from scanned QR URL.');
    });
}

document.querySelectorAll(".scan-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.scan;
        startQRScanner(category);
    });
});