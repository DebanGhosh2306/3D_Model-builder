import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';

const promptInput = document.querySelector('#prompt');
const generateBtn = document.querySelector('#generate');
const resetCameraBtn = document.querySelector('#reset-camera');
const snapshotBtn = document.querySelector('#snapshot');
const toggleSpinBtn = document.querySelector('#toggle-spin');
const toggleWireframeBtn = document.querySelector('#toggle-wireframe');
const statusNode = document.querySelector('#status');
const promptChips = [...document.querySelectorAll('.prompt-chip')];
const mount = document.querySelector('#canvas-wrap');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1120');

const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
camera.position.set(2.8, 2.1, 3.3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(mount.clientWidth, mount.clientHeight);
mount.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 1.1;
controls.maxDistance = 10;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
keyLight.position.set(3, 5, 2);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x67e8f9, 0.6, 30);
fillLight.position.set(-2.2, -1, -2);
scene.add(fillLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6, 64),
  new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 1, metalness: 0 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.35;
scene.add(floor);

let model;
let spinSpeed = 0.005;
let spinEnabled = true;
let wireframeEnabled = false;

const colorMap = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  orange: '#f97316',
  yellow: '#eab308',
  white: '#f8fafc',
  black: '#0f172a',
  gold: '#fbbf24',
  silver: '#d1d5db',
  cyan: '#22d3ee'
};

const shapes = [
  { key: 'sphere', label: 'Sphere', build: () => new THREE.SphereGeometry(0.95, 96, 64) },
  { key: 'cube', label: 'Cube', build: () => new THREE.BoxGeometry(1.7, 1.7, 1.7, 4, 4, 4) },
  { key: 'torus', label: 'Torus', build: () => new THREE.TorusKnotGeometry(0.7, 0.25, 160, 26) },
  { key: 'cone', label: 'Cone', build: () => new THREE.ConeGeometry(0.9, 1.8, 64) },
  { key: 'cylinder', label: 'Cylinder', build: () => new THREE.CylinderGeometry(0.8, 0.8, 1.8, 64) },
  { key: 'pyramid', label: 'Pyramid', build: () => new THREE.ConeGeometry(1, 1.8, 4) },
  { key: 'crystal', label: 'Crystal', build: () => new THREE.OctahedronGeometry(1.1, 1) },
  { key: 'capsule', label: 'Capsule', build: () => new THREE.CapsuleGeometry(0.6, 0.9, 8, 24) }
];

function parsePrompt(raw) {
  const prompt = raw.toLowerCase().trim();

  const pickedColor = Object.entries(colorMap).find(([name]) => prompt.includes(name));
  const color = pickedColor ? pickedColor[1] : '#60a5fa';

  const shape = shapes.find((candidate) => prompt.includes(candidate.key)) || shapes[0];

  const size = /tiny|small/.test(prompt)
    ? 0.65
    : /large|big|giant|huge/.test(prompt)
      ? 1.45
      : 1;

  const isGlass = /glass|transparent|crystal/.test(prompt);
  const isMetal = /metal|metallic|chrome|steel|iron|gold|silver/.test(prompt);
  const isGlow = /glow|neon|glowing/.test(prompt);
  const isRough = /rough|matte/.test(prompt);

  const materialOptions = {
    metalness: isMetal ? 0.95 : 0.2,
    roughness: isRough ? 0.75 : isGlass ? 0.08 : 0.35,
    transmission: isGlass ? 0.75 : 0,
    clearcoat: isGlass ? 0.9 : 0.25,
    emissiveIntensity: isGlow ? 0.42 : 0,
  };

  const rotation = /static|still|stop/.test(prompt) ? 0 : /fast/.test(prompt) ? 0.016 : 0.005;

  return { shape, color, size, materialOptions, rotation };
}

function setStatus({ shape, color, size, prompt }) {
  const sizeWord = size < 1 ? 'Small' : size > 1 ? 'Large' : 'Normal';
  statusNode.textContent = `Built ${sizeWord} ${shape.label} • color ${color} • prompt: "${prompt || 'default'}"`;
}

function refreshControlLabels() {
  toggleSpinBtn.textContent = spinEnabled ? 'Pause spin' : 'Resume spin';
  toggleWireframeBtn.textContent = wireframeEnabled ? 'Wireframe on' : 'Wireframe off';
}

function buildModel(rawPrompt) {
  if (model) {
    scene.remove(model);
    model.geometry.dispose();
    model.material.dispose();
  }

  const parsed = parsePrompt(rawPrompt);
  const { shape, color, size, materialOptions, rotation } = parsed;

  const material = new THREE.MeshPhysicalMaterial({
    color,
    emissive: new THREE.Color(color).multiplyScalar(0.16),
    ...materialOptions,
    ior: 1.35,
    thickness: 0.7,
  });

  model = new THREE.Mesh(shape.build(), material);
  model.castShadow = true;
  model.receiveShadow = true;
  model.scale.setScalar(size);
  scene.add(model);
  model.material.wireframe = wireframeEnabled;

  spinSpeed = rotation;
  setStatus({ shape, color, size, prompt: rawPrompt.trim() });
}

function resetCamera() {
  camera.position.set(2.8, 2.1, 3.3);
  controls.target.set(0, 0, 0);
  controls.update();
}

buildModel(promptInput.value);

generateBtn.addEventListener('click', () => buildModel(promptInput.value));
resetCameraBtn.addEventListener('click', resetCamera);

toggleSpinBtn.addEventListener('click', () => {
  spinEnabled = !spinEnabled;
  refreshControlLabels();
});

toggleWireframeBtn.addEventListener('click', () => {
  wireframeEnabled = !wireframeEnabled;
  if (model) {
    model.material.wireframe = wireframeEnabled;
    model.material.needsUpdate = true;
  }
  refreshControlLabels();
});

snapshotBtn.addEventListener('click', () => {
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = `model-${Date.now()}.png`;
  anchor.click();
});

promptChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.textContent.trim();
    buildModel(promptInput.value);
  });
});

promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    buildModel(promptInput.value);
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (model && spinEnabled && spinSpeed > 0) {
    model.rotation.y += spinSpeed;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();
refreshControlLabels();

window.addEventListener('resize', () => {
  camera.aspect = mount.clientWidth / mount.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(mount.clientWidth, mount.clientHeight);
});
