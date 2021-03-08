import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Collapse, Row, Col } from 'antd';
import SensorSwitch from '../common/SensorSwitch';
import LidarStatus from './sections/LidarStatus';
import GnssStatus from './sections/GnssStatus';
import CamStatus from './sections/CamStatus';
import ActionStatus from './sections/ActionStatus';

const { Panel } = Collapse;

/** sensors status - connected, recorded */
const FloatingState = ({ sensors, phase, sn }) => {
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const [show, setShow] = useState([]);
  const [actives, setActives] = useState([]);
  const [showRecord, setShowRecord] = useState(false);

  const draggleRef = useRef(null);

  useEffect(() => {
    const active = Object.values(sensors).reduce((acc, curr) => {
      if (curr.connected?.includes('1')) acc.push(curr.name);
      return acc;
    }, []);

    if (active.length === 0) onChangeRecord([]);
    if (active.length > 0) onChangeRecord(['RECORD']);

    onChange(active);
  }, [sensors]);

  useEffect(() => {
    let isShow = ['round', 'snap'].includes(phase.status) || phase.recording;

    setShowRecord(isShow);
  }, [phase]);

  const onChangeRecord = (key) => {
    setShow(key);
  };

  const onChange = (key) => {
    setActives(key);
  };

  /* moving modal */
  const onStart = (e, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();

    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y)
    });
  };

  return (
    <Draggable
      bounds={bounds}
      position={null}
      grid={[25, 25]}
      scale={1}
      onStart={(e, uiData) => onStart(e, uiData)}>
      <div ref={draggleRef}>
        <div style={{ margin: '0.3rem 0' }}>
          <SensorSwitch value="connected" />
        </div>
        <Collapse
          expandIconPosition="right"
          activeKey={[...show]}
          onChange={onChangeRecord}>
          <Panel header="RECORD" key="RECORD">
            <ActionStatus phase={phase} sensors={sensors} />
            {showRecord && (
              <SensorSwitch value="recorded" className="btnRecord" />
            )}
            <Collapse activeKey={[...actives]} onChange={onChange}>
              <Panel header="GNSS" key="gnss">
                <GnssStatus
                  statusData={sensors.gnss}
                  cameraCount={sensors.camera.status}
                  phaseStatus={phase.status}
                  sn={sn}
                />
              </Panel>
              <Panel header="CAMERA" key="camera">
                <CamStatus statusData={sensors.camera} />
              </Panel>
              <Panel
                header={
                  <Row>
                    <Col span={12}>LIDAR STATUS</Col>
                    <Col span={12}>POINT COUNT</Col>
                  </Row>
                }
                key="lidar">
                <LidarStatus statusData={sensors.lidar} />
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
      </div>
    </Draggable>
  );
};

export default FloatingState;
