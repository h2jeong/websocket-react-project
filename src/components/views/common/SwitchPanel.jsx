import React, { useEffect, useState } from 'react';
import { Switch, Form } from 'antd';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { mutatePhase } from '../../../store/phase';
import useLongPress from '../../../utils/useLongPress';

/* each sensor switch */
const SwitchPanel = ({ sensor, value, size }) => {
  // console.log('sensor', sensor, value);
  const [checkedValue, setCheckedValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const socket = useSelector((state) => state.socket, shallowEqual);
  const dispatch = useDispatch();

  const name = sensor.name.toLowerCase();

  useEffect(() => {
    const loadingValue = sensor[value]?.includes('2');
    const disabledValue = !sensor.connected?.includes('1');
    let isChecked = sensor[value]?.includes('1');

    if (value === 'recorded') {
      const recordedDisabled = disabledValue;

      setDisabled(recordedDisabled);
      if (recordedDisabled) isChecked = false;
    }
    setCheckedValue(isChecked);
    setLoading(loadingValue);
  }, [sensor]);

  const onLongPress = () => {
    onChange();
  };

  const onClick = () => {
    onChange();
  };

  const onChange = () => {
    const option = !checkedValue ? 'on' : 'off';
    let msg = `#${value},${option},${sensor.name},${0}`;

    socket.socket?.send(JSON.stringify(msg));
    setLoading(true);

    if (value === 'recorded' && sensor.name === 'all') {
      const phase = checkedValue ? 'round' : 'snap';

      dispatch(mutatePhase(phase));
    }
    setCheckedValue(!checkedValue);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500
  };

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <Form.Item label={name.toUpperCase()}>
      <Switch
        size={size}
        {...longPressEvent}
        checked={checkedValue}
        loading={loading}
        disabled={disabled}
        id={`${value}_${checkedValue}_${name}`}
      />
    </Form.Item>
  );
};

export default SwitchPanel;
