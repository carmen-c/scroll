import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), 
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// make my shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);



// 0x indicates hex value
const ambientLight = new THREE.AmbientLight(0xFFFFFF)

const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(20,5,5)

// shows position of point light
const lightHelper = new THREE.PointLightHelper(pointLight)

// draws 2d grid
const gridHelper = new THREE.GridHelper(200, 50);

//update camera position depending on dom events
const controls = new OrbitControls(camera, renderer.domElement);

// add to scene
scene.add(torus)
scene.add(pointLight)
scene.add(ambientLight)
scene.add(lightHelper, gridHelper)

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xFFFFFF});
  const star = new THREE.Mesh(geometry, material);
  
  // randFloatSpread generates random # between -100 to 100
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

// background by adding a texture
const spaceTexture = new THREE.TextureLoader().load('images/andy-holmes-unsplash.jpg');
scene.background = spaceTexture;

//moon
const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('images/normal.jpg');

const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({map: moonTexture, normalMap: normalTexture})
);

// this both does the same thing, just pref on how u want to write it.
moon.position.z = 30;
moon.position.setX(-10);

scene.add(moon)

//scroll
function moveCamera() {
  // how far you are scrolled to from the top
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;
  
  // top value will always be negative
  camera.position.x = t * 0.02; //+ move left, - move right
  camera.position.y = t * 0.02; //+ move down, - move up
  camera.position.z = t * -0.002;
}

document.body.onscroll = moveCamera;
moveCamera();

// heartbeat of scene
function animate() {
  requestAnimationFrame(animate);
  
  torus.rotation.x +=0.01;
  torus.rotation.y +=0.005;
  torus.rotation.z +=0.01;
  
  
  renderer.render(scene, camera);
}

animate()