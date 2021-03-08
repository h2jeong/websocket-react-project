import React from 'react';
import { Form, Row, Col } from 'antd';
import RoundStatus from './RoundStatus';
import CaptureStatus from './CaptureStatus';

/* round, snap switch layout */
const ActionStatus = ({ phase, sensors }) => {
  return (
    <Row>
      <Col span={24}>
        <Form layout="inline" style={{ justifyContent: 'space-around' }}>
          <RoundStatus phase={phase} sensors={sensors} />
          <CaptureStatus phase={phase} sensors={sensors} />
        </Form>
      </Col>
    </Row>
  );
};

export default ActionStatus;
