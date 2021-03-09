/**
 * @summary - Make Point Cloud
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CLOUD_ID, PSPTV_OPT, RATIO, SS_HEIGHT } from './const';

function initCloud() {
  /**
   * @summary - Make Point Cloud
   * @params {String} id - dom id for append
   * @params {Object} socket - socket io object to render real time
   */
  const cloud = {};
  cloud.points = [];
  const loader = new GLTFLoader();
  cloud.canvas = document.getElementById(CLOUD_ID);
  if (cloud.canvas && window) {
    // Make Space
    cloud.camera = makeCamera(PSPTV_OPT);
    cloud.scene = makeScene(cloud.camera);

    cloud.renderer = makeRenderer();
    cloud.canvas.appendChild(cloud.renderer.domElement);
    cloud.canvas.cloud = cloud;
    cloud.controls = makeControls(cloud.camera, cloud.renderer);
    cloud.axis = true;
    window.addEventListener('resize', onWindowResize, false);

    loader.load(
      '/car.glb',
      (gltf) => {
        cloud.scene.add(gltf.scene);
        gltf.scene.rotation.set(Math.PI / 2, Math.PI, 0);
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.set(0, 0, -SS_HEIGHT);
      },
      (xhr) => {
        if (xhr.lengthComputable)
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => console.log(error)
    );
    const pointLight = new THREE.PointLight(0x8888ff, 1, 2000);
    pointLight.position.set(10, 10, 30);
    cloud.scene.add(pointLight);

    // Add To Canvas
    cloud.id = animate();
    return cloud;
  } else throw new Error('No Window or No #cloud');
}

function purgeCloud(cloud) {
  /**
   * @summary - Purge cloud event, loop
   */
  window.removeEventListener('resize', onWindowResize, false);
  cancelAnimationFrame(cloud.id);
  return null;
}

function makeCamera(persOpt) {
  /**
   * @summary - Make Camera
   */
  const camera = new THREE.PerspectiveCamera(...persOpt);
  camera.position.z = 3;
  return camera;
}

function makeScene(cam) {
  /**
   * @summary - Make Scene
   */
  const scene = new THREE.Scene();
  scene.add(cam);
  return scene;
}

function makeRenderer() {
  /**
   * @summary - Make Renderer - window used
   */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth * RATIO, window.innerHeight * RATIO);
  return renderer;
}

function makeControls(camera, renderer) {
  /**
   * @summary - Make Controls
   */
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 0.3;
  controls.panSpeed = 0.2;
  controls.staticMoving = false;
  controls.minDistance = 0.3;
  controls.maxDistance = 0.3 * 100;
  return controls;
}

function animate() {
  /**
   * @summary - Animate function for Point Cloud
   */
  if (!document.getElementById(CLOUD_ID)) return;
  const cloud = document.getElementById(CLOUD_ID).cloud;
  const id = requestAnimationFrame(animate);
  cloud.controls.update();
  cloud.renderer.render(cloud.scene, cloud.camera);
  return id;
}

function onWindowResize() {
  /**
   * @summary - Animate function for Point Cloud
   */
  if (!document.getElementById(CLOUD_ID)) return;
  const cloud = document.getElementById(CLOUD_ID).cloud;
  // console.log('meta cloud:', cloud);
  cloud.camera.aspect = window.innerWidth / window.innerHeight;
  cloud.camera.updateProjectionMatrix();
  cloud.renderer.setSize(window.innerWidth * RATIO, window.innerHeight * RATIO);
}

export { initCloud, purgeCloud };
