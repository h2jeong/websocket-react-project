import * as THREE from 'three';
import {
  AXIT_SIZE,
  CENTER,
  CLOUD_ID,
  POINT_SIZE,
  TRANSLATION1,
  TRANSLATION2,
  X_AXIS_1,
  X_AXIS_2,
  Y_AXIS_1,
  Y_AXIS_2,
  Z_AXIS
} from './const';

function updatePoints(frames) {
  // console.log('frames:', frames);
  if (!frames) return;
  const el = document.getElementById(CLOUD_ID);
  if (!el) return;
  const cloud = el.cloud;

  for (const points of cloud.points) cloud.scene.remove(points);
  cloud.points = [];

  for (const frame of frames) {
    const vertices = [];
    vertices.push(...frame);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    let material;
    // console.log('updatePoints:', frame, frames.indexOf(frame));
    if (frames.indexOf(frame) === 0)
      material = new THREE.PointsMaterial({
        size: POINT_SIZE,
        color: 0x646486
      });
    if (frames.indexOf(frame) === 1)
      material = new THREE.PointsMaterial({
        size: POINT_SIZE,
        color: 0x648664
      });
    const points = new THREE.Points(geometry, material);
    points.rotateY(-Math.PI / 4);
    if (frames.indexOf(frame) == 0) {
      points.rotateOnAxis(
        new THREE.Vector3(...Z_AXIS).normalize(),
        Math.PI / 4
      );
      points.translateOnAxis(
        new THREE.Vector3(...X_AXIS_1).normalize(),
        TRANSLATION1[0]
      );
      points.translateOnAxis(
        new THREE.Vector3(...Y_AXIS_1).normalize(),
        TRANSLATION1[1]
      );
      points.translateOnAxis(
        new THREE.Vector3(...Z_AXIS).normalize(),
        TRANSLATION1[2]
      );
    } else {
      points.rotateOnAxis(
        new THREE.Vector3(...Z_AXIS).normalize(),
        (3 * Math.PI) / 4
      );
      points.translateOnAxis(
        new THREE.Vector3(...X_AXIS_2).normalize(),
        TRANSLATION2[0]
      );
      points.translateOnAxis(
        new THREE.Vector3(...Y_AXIS_2).normalize(),
        TRANSLATION2[1]
      );
      points.translateOnAxis(
        new THREE.Vector3(...Z_AXIS).normalize(),
        TRANSLATION2[2]
      );
    }

    if (!cloud.centered) {
      cloud.centered = true;
      cloud.controls.target.set(...CENTER);
    }
    cloud.points.push(points);
    cloud.scene.add(points);
  }
  if (cloud.axis) {
    const axesHelper = new THREE.AxesHelper(AXIT_SIZE);
    cloud.scene.add(axesHelper);
  }
  cloud.controls.update();
}

export { updatePoints };
