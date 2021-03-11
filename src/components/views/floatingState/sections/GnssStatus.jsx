import React, { useState, useEffect } from 'react';
import { Input, Row, Col, message } from 'antd';
import FloatLabel from '../../common/FloatLabel';
import { drawXY, drawXYs } from '../../../../plugins/map/draw';
import useAudio from '../../../../utils/useAudio';

const GnssStatus = ({ statusData, phaseStatus, sn, cameraCount }) => {
  // console.log('gnss:', statusData);
  const { status, connected, data } = statusData;
  const [show, setShow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [playing, toggle] = useAudio();

  useEffect(() => {
    if (!connected || !status) return;

    setShow(connected.includes('1'));
  }, [connected]);

  useEffect(() => {
    if (!status) return;

    drawXY(status.current_pos, show, sn ? sn : 'local', phaseStatus === 'snap');
    if (show && data?.latlngs) {
      drawXYs(data.latlngs, sn);
    }
  }, [data, show]);

  const gnssStatusTypes = [
    'trigger_count',
    'storage',
    'time_stat',
    'sol_type',
    'log_file_name', // 'File Status',
    'pos_type',
    'accuracy',
    'multiSvs'
  ];

  const renderGnssInfos = () => {
    const gnssInfos = [];

    for (let i = 0; i < gnssStatusTypes.length; i += 1) {
      const type = gnssStatusTypes[i];
      let value = status[type] || '';

      if (type === 'trigger_count') {
        const { strobe_count, shoot_count } = cameraCount;
        /** message for count mismatch */
        if (strobe_count[0] * 1 + shoot_count[0] * 1 - value * 2 !== 0) {
          message
            .error({
              content: `[GNSS] - The trigger_count do not match. `,
              duration: 5,
              onClose: toggle
            })
            .then(() => toggle());
        }
      }

      let className = i % 2 ? 'radiusBottomRightStyle' : 'radiusTopLeftStyle';

      if (type === 'accuracy' || type === 'multiSvs') {
        className = 'underbarStyle';

        /** message for accuracy larger then 1 */
        if (type === 'accuracy' && value * 1 > 1)
          message
            .info({
              content: `[GNSS] - The value of accuracy exceeded 1. `,
              duration: 2,
              onClose: toggle
            })
            .then(() => toggle());
      }

      gnssInfos.push(
        <Col span={12} key={i}>
          <FloatLabel label={type} name={type} value={value}>
            <Input value={value} className={className} />
          </FloatLabel>
        </Col>
      );
    }

    return gnssInfos;
  };

  return <Row gutter={[8, 4]}>{show && status && renderGnssInfos()}</Row>;
};

export default GnssStatus;
