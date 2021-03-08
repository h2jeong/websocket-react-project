/**
 * @summary - Map draw module
 * @module
 */

import { fromLonLat } from 'ol/proj';
import { Fill, Circle, Style } from 'ol/style';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { extend as ex } from 'ol/extent';
// import { ImageStatic } from 'ol/source';
import { setFocus } from './event';
import { RED, BLUE, DFT_RADIUS } from './const';
import { ref } from './meta';

function makeStyle() {
  /**
   * @summary - Make Diverse Style
   * @function
   */
  let styles = {};

  styles.prop = {
    fRed: new Fill({ color: RED }),
    fBlue: new Fill({ color: BLUE })
  };

  const circleDft = { radius: DFT_RADIUS };
  const ciRedI = new Circle({ ...circleDft, fill: styles.prop.fRed });
  const ciBlueI = new Circle({
    radius: DFT_RADIUS * 2,
    fill: styles.prop.fBlue
  });

  styles = {
    ...styles,
    circleRed: new Style({ image: ciRedI }),
    circleBlue: new Style({ image: ciBlueI })
  };

  return styles;
}

function drawXY(latlng, focus, id, extend) {
  /**
   * @summary - When Click Map
   */
  if (!latlng) return;

  const convertNum = latlng.map((el) => el * 1);
  // console.log('drawXY:', latlng, focus, id, extend, convertNum);
  const feature = updateMarker(...convertNum, id);

  if (focus) setFocus(...convertNum);

  if (extend)
    if (ref.extent) ex(ref.extent, feature.getGeometry().getExtent());
    else ref.extent = feature.getGeometry().getExtent();

  return ref.extent;
}

function drawXYs(latlngArray, id) {
  /**
   * @summary - When Click Map
   */
  if (!latlngArray.length) return;

  for (let i = 0; i < latlngArray.length; i += 1) {
    const convertNum = latlngArray[i].map((el) => el * 1);
    addCircle(...convertNum, id);
  }

  const recordingSource = ref.recordingLayer.getSource();
  const recordingArray = recordingSource.getFeatures();
  console.log(id, 'added', recordingArray.length);
}

function subtractVhcl(id) {
  // remove current
  console.log(id, 'subtractVhcl');
  const { currentLayer, recordingLayer } = ref;
  if (!currentLayer) return;

  const legacy = currentLayer.getSource().getFeatureById(id);
  if (legacy) currentLayer.getSource().removeFeature(legacy);

  // remove recording
  const recordingSource = recordingLayer.getSource();
  const recordingArray = recordingSource.getFeatures();

  for (let i = 0; i < recordingArray.length; i += 1) {
    console.log(
      recordingArray[i].get('vhcl') === id,
      recordingArray[i].get('vhcl')
    );
    if (recordingArray[i].get('vhcl') === id)
      recordingSource.removeFeature(recordingArray[i]);
  }
}

function addCircle(lat, lng, id) {
  /**
   * @summary - draw circle
   */
  const loc = fromLonLat([lng, lat]);
  const coor = new Point(loc);
  const { recordingLayer } = ref;
  const feature = new Feature({ geometry: coor });

  feature.set('vhcl', id);
  recordingLayer.getSource().addFeatures([feature]);
}

function updateMarker(lat, lng, id) {
  /**
   * @summary - update lyaer
   */
  const loc = fromLonLat([lng, lat]);
  const coor = new Point(loc);
  // console.log('updateMarker:', latlng, id, loc, coor);
  const feature = new Feature({ geometry: coor });
  const { currentLayer } = ref;
  if (!currentLayer) return;

  const legacy = currentLayer.getSource().getFeatureById(id);
  if (legacy) currentLayer.getSource().removeFeature(legacy);

  feature.setId(id);
  currentLayer.getSource().addFeatures([feature]);

  return feature;
}

export { makeStyle, drawXY, drawXYs, subtractVhcl };
