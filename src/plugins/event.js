/**
 * @summary - Event map module
 * @module
 */

import { transform } from 'ol/proj';
import { ref } from './meta';
import { ZOOM_DURATION, START_ZOOM } from './const';

function eventBind(map) {
  /**
   * @summary - OL Event Bind
   */
  map.naver.element = document.getElementById('naver');
  map.on('pointermove', () => changeMapLoc(map));
  map.on('moveend', () => ({
    loc: changeMapLoc(map),
    zoom: ChangeMapRatio(map)
  }));
  return { loc: changeMapLoc(map), zoom: ChangeMapRatio(map) };
}

function changeMapLoc(map) {
  const lnglat = transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
  map.naver.setCenter({ x: lnglat[0], y: lnglat[1] });
}

function getSnapShot(callback) {
  const interactions = ref.map.interactions.getArray();
  const view = ref.map.getView();
  const center = view.getCenter();
  const zoom = view.getZoom();

  for (let i = 0; i < interactions.length; i += 1)
    interactions[i].setActive(false);
  try {
    view.fit(ref.extent, ref.map.getSize());
  } catch (err) {
    console.log('fit fail', err);
  }
  ref.extent = undefined;
  ref.map.once('rendercomplete', () => {
    const mapCanvas = document.createElement('canvas');
    const size = ref.map.getSize();
    const [width, height] = size;
    mapCanvas.width = width;
    mapCanvas.height = height;
    const mapContext = mapCanvas.getContext('2d');
    Array.prototype.forEach.call(
      document.querySelectorAll('.ol-layer canvas'),
      (canvas) => {
        if (canvas.width > 0) {
          const { opacity } = canvas.parentNode.style;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const { transform } = canvas.style;
          const matrix = transform
            .match(/^matrix\(([^|(]*)\)$/)[1]
            .split(',')
            .map(Number);
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          view.setCenter(center);
          view.setZoom(zoom);
          for (let i = 0; i < interactions.length; i += 1)
            interactions[i].setActive(true);

          mapContext.drawImage(canvas, 0, 0);
        }
      }
    );
    const data = mapCanvas.toDataURL();
    callback(data);
  });
  ref.map.renderSync();
}

function setFocus(lat, lng) {
  const coor = transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
  ref.map.getView().animate({ center: coor, duration: 0 });
}

function setZoom(follow) {
  if (follow) return;
  const view = ref.map.getView();
  const zoom = view.getZoom();
  view.animate(
    { zoom: zoom - 1, duration: ZOOM_DURATION },
    {
      zoom: START_ZOOM,
      duration: ZOOM_DURATION * Math.ceil(Math.abs(START_ZOOM - (zoom - 1)) / 3)
    }
  );
}

function ChangeMapRatio(map) {
  const zoom = Math.round(map.getView().getZoom());
  map.naver.setZoom(zoom);
  const olExtent = map.getView().calculateExtent();
  const olStartExt = transform(
    [olExtent[0], olExtent[1]],
    'EPSG:3857',
    'EPSG:4326'
  );
  const olEndExt = transform(
    [olExtent[2], olExtent[3]],
    'EPSG:3857',
    'EPSG:4326'
  );
  const olSideX = olEndExt[0] - olStartExt[0];
  const olSideY = olEndExt[1] - olStartExt[1];
  const naverStartX = map.naver.getBounds().minX();
  const naverEndX = map.naver.getBounds().maxX();
  const naverStartY = map.naver.getBounds().minY();
  const naverEndY = map.naver.getBounds().maxY();
  const naverSideX = naverEndX - naverStartX;
  const naverSideY = naverEndY - naverStartY;
  const naverRatioX = naverSideX / olSideX;
  const naverRatioY = naverSideY / olSideY;

  for (let i = 0; i < map.naver.element.children.length; i += 1)
    map.naver.element.children[i].style.transform = `scale(${
      (naverRatioX, naverRatioY)
    })`;
}

export { eventBind, setFocus, setZoom, getSnapShot };
