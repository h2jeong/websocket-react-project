import React, { useEffect, useState } from 'react';
import { initCloud, purgeCloud } from '../../../../plugins/cloud/meta';
import { updatePoints } from '../../../../plugins/cloud/socket';

/* lidar pointCloud data - Server development required */
const Cloud = ({ lidarData }) => {
  // TODO: cloud dom 연결하기 canvas (4/5) 비율 확인하기 onWindowResize
  const [cloud, setCloud] = useState(null);
  // console.log('cloud id:', cloud, lidarData);
  useEffect(() => {
    const temp = initCloud();

    setCloud(temp);

    return () => {
      if (cloud) purgeCloud(cloud);

      setCloud(null);
    };
  }, []);

  useEffect(() => {
    if (!lidarData) return;

    updatePoints(lidarData.pointCloud?.point);
  }, [lidarData]);

  return <div id="cloud" />;
};

export default Cloud;
