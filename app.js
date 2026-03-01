import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js';

const promptInput = document.querySelector('#prompt');
const generateBtn = document.querySelector('#generate');
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
controls.dampingFactor = 0.05;
controls.minDistance = 1.2;
controls.maxDistance = 8;

scene.add(new THREE.AmbientLight(0xffffff, 0.65));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
keyLight.position.set(3, 5, 2);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x67e8f9, 0.55, 30);
fillLight.position.set(-2.2, -1, -2);
scene.add(fillLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 1, metalness: 0 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.35;
scene.add(floor);

let model;

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
  { key: 'sphere', build: () => new THREE.SphereGeometry(0.95, 96, 64) },
  { key: 'cube', build: () => new THREE.BoxGeometry(1.7, 1.7, 1.7, 4, 4, 4) },
  { key: 'torus', build: () => new THREE.TorusKnotGeometry(0.7, 0.25, 160, 26) },
  { key: 'cone', build: () => new THREE.ConeGeometry(0.9, 1.8, 64) },
  { key: 'cylinder', build: () => new THREE.CylinderGeometry(0.8, 0.8, 1.8, 64) },
  { key: 'pyramid', build: () => new THREE.ConeGeometry(1, 1.8, 4) },
  { key: 'crystal', build: () => new THREE.OctahedronGeometry(1.1, 1) },
  { key: 'capsule', build: () => new THREE.CapsuleGeometry(0.6, 0.9, 8, 24) }
];

function parsePrompt(raw) {
  const prompt = raw.toLowerCase();

  const pickedColor = Object.entries(colorMap).find(([name]) => prompt.includes(name));
  const color = pickedColor ? pickedColor[1] : '#60a5fa';

  const shape = shapes.find((candidate) => prompt.includes(candidate.key)) || shapes[0];

  const materialOptions = {
    metalness: /metal|chrome|steel|iron|gold|silver/.test(prompt) ? 0.95 : 0.2,
    roughness: /smooth|polished|glass|crystal/.test(prompt) ? 0.1 : 0.45,
    transmission: /glass|transparent|crystal/.test(prompt) ? 0.65 : 0,
    clearcoat: /glossy|glass|crystal|polished/.test(prompt) ? 0.85 : 0.2,
    emissiveIntensity: /glow|neon|glowing/.test(prompt) ? 0.35 : 0,
  };

  return { shape, color, materialOptions };
}

function buildModel(rawPrompt) {
  if (model) {
    scene.remove(model);
    model.geometry.dispose();
    model.material.dispose();
  }

  const { shape, color, materialOptions } = parsePrompt(rawPrompt);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    emissive: new THREE.Color(color).multiplyScalar(0.15),
    ...materialOptions,
    ior: 1.35,
    thickness: 0.7,
  });

  model = new THREE.Mesh(shape.build(), material);
  model.castShadow = true;
  model.receiveShadow = true;
  scene.add(model);
}

buildModel(promptInput.value);

generateBtn.addEventListener('click', () => buildModel(promptInput.value));
promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    buildModel(promptInput.value);
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.005;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = mount.clientWidth / mount.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(mount.clientWidth, mount.clientHeight);
});
