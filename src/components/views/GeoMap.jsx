import React, { useEffect } from 'react';
import { drawXYs } from '../../../../plugins/map/draw';
import { setZoom } from '../../../../plugins/map/event';
import { olInit } from '../../../../plugins/map/meta';

const GeoMap = ({ width, height, project, mark }) => {
  useEffect(() => {
    if (!project) return;

    const { geoserver, workspace, layers } = project;

    olInit(geoserver, workspace, layers);
    if (mark) drawXYs(mark, 'local');

    setZoom(false);
  }, [project]);

  return (
    <>
      <div id="ol" style={{ width, height }} />
      <div id="naver" style={{ width, height }} />
    </>
  );
};

export default GeoMap;
