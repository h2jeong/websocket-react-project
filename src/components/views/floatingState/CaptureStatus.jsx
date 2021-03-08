import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Form, Switch, message } from 'antd';
import { AppstoreAddOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { mutatePhase } from '../../../../store/phase';
import useLongPress from '../../../../utils/useLongPress';

/* snap switch */
const CaptureStatus = ({ phase, sensors }) => {
  const [snap, setSnap] = useState(false);
  const socket = useSelector((state) => state.socket, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    setSnap(phase.status === 'snap' && phase.recording);
  }, [phase]);

  const onLongPress = () => {
    onChangeSnap();
  };

  const onClick = () => {
    onChangeSnap();
  };

  const onChangeSnap = () => {
    // console.log('snap:', snap);
    let msg = '';

    if (!snap) {
      msg = '#recorded,on,all';
      dispatch(mutatePhase('snap'));
    } else {
      const { connected, recorded } = sensors.camera;
      console.log('camera on:', connected, recorded);
      if (connected.includes('1') && recorded.includes('1')) {
        msg = '#recorded,off,camera,0';
        socket.socket?.send(JSON.stringify(msg));
      }
      msg = '#change_dr,snap';
      dispatch(mutatePhase('round'));
      message.info('Capture directory change.');
    }
    socket.socket?.send(JSON.stringify(msg));
    setSnap(!snap);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500
  };

  const snapLongPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Form.Item label="CAPTURE">
      <Switch
        checked={snap}
        checkedChildren={<VideoCameraAddOutlined id="CAPTURE" />}
        unCheckedChildren={<AppstoreAddOutlined id="CAPTURE" />}
        className="btnSnap large"
        disabled={!phase.status}
        id="CAPTURE"
        {...snapLongPressEvent}
      />
    </Form.Item>
  );
};

export default CaptureStatus;
