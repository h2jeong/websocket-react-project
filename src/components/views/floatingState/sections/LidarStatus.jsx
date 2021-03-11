import React, { useEffect, useState } from 'react';
import { Input, Row, Col, message } from 'antd';
import FloatLabel from '../../common/FloatLabel';
import useAudio from '../../../../utils/useAudio';

const LidarStatus = ({ statusData }) => {
  const { status, connected } = statusData;
  const [show, setShow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [playing, toggle] = useAudio();

  useEffect(() => {
    if (!connected) return;

    setShow(connected.includes('1'));
  }, [connected]);

  const renderLidarStatus = (arr) => {
    let i = -1;

    return arr.map((lidar) => {
      i += 1;

      /** message for count mismatch */
      if (lidar === 0)
        message
          .error({
            content: `[Lidar${i}] The point is not captured. `,
            duration: 5,
            onClose: toggle
          })
          .then(() => toggle());

      return (
        <Col key={`LiDAR ${i}`}>
          <FloatLabel label={`LiDAR ${i}`} name="status" value={lidar}>
            <Input className="underbarStyle" value={lidar} />
          </FloatLabel>
        </Col>
      );
    });
  };

  return (
    <Row gutter={[8, 4]}>
      <Col span={12}>
        <Row>{show && status?.info && renderLidarStatus(status.info)}</Row>
      </Col>
      <Col span={12}>
        <Row>
          {show && status?.point_count && renderLidarStatus(status.point_count)}
        </Row>
      </Col>
    </Row>
  );
};

export default LidarStatus;
