/**
 * @summary - Map Default module
 * @module
 */

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as controls } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { defaults, DragPan, MouseWheelZoom, PinchZoom } from 'ol/interaction';

import { makeStyle } from './draw';
import {
  makeDraftLayer,
  makeRecordedLayer,
  makeMissionLayer,
  makeNaverMap,
  makeCurrentLayer,
  makeRecordingLayer
  // makeGoogleLayer
} from './layer';
import { DRAW_LAYER_ID, INIT_ZOOM, START_POINT, MAP_ID } from './const';
import { eventBind } from './event';

export const ref = {};

function olInit(geoserver, workspace, layers) {
  /**
   * @summary - Make OSM
   */
  const { draft, mission, recorded } = layers;
  const styles = makeStyle();
  const naver = makeNaverMap();
  const draftLayer = makeDraftLayer(geoserver, workspace, draft);
  const missionLayer = makeMissionLayer(geoserver, workspace, mission);
  const recordedLayer = makeRecordedLayer(geoserver, workspace, recorded);
  const recordingLayer = makeRecordingLayer(styles);
  const currentLayer = makeCurrentLayer(styles);
  const openlayers = [
    recordingLayer,
    currentLayer,
    draftLayer,
    recordedLayer,
    missionLayer
  ];
  const map = makeOlMap(openlayers);
  map.styles = styles;
  map.naver = naver;
  ref.map = map;
  ref.recordedLayer = recordedLayer;
  ref.draftLayer = draftLayer;
  ref.missionLayer = missionLayer;
  ref.recordingLayer = recordingLayer;
  ref.currentLayer = currentLayer;
  eventBind(map);
  // console.log('olInit:', ref);
  return map;
}

function makeOlMap(layers) {
  /**
   * @summary - Make OpenLayers Main Map
   */
  const center = fromLonLat(START_POINT);
  const view = {
    projection: 'EPSG:3857',
    center,
    zoom: INIT_ZOOM,
    enableRotation: false
  };
  const mapOpt = {
    target: MAP_ID,
    layers,
    interactions: defaults({
      dragPan: false
    }).extend([
      new DragPan({
        kinetic: false
      }),
      new MouseWheelZoom({ duration: 0 }),
      new PinchZoom({
        constrainResolution: true
      })
    ]),
    view: new View(view),
    controls: controls({
      zoom: true
    })
  };
  return new Map(mapOpt);
}

function getDrawLayer(map) {
  const layers = map.getLayers().getArray();
  for (let i = 0; i < layers.length; i += 1)
    if (layers[i].get('lid') === DRAW_LAYER_ID) return layers[i];
  return false;
}

export { olInit, getDrawLayer };
