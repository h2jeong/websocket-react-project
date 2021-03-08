import React from 'react';
import { Form, Tooltip } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import SwitchPanel from './SwitchPanel';

/* sensor switches - power, connected, recorded */
const SensorSwitch = ({ value, className }) => {
  const sensors = useSelector((state) => state.sensor, shallowEqual);
  const allStatus = { power: [], connected: [], ready: [], recorded: [] };

  sensors.reduce((acc, curr) => {
    const names = Object.keys(curr);

    for (let i = 0; i < names.length; i += 1) {
      const name = names[i];
      if (Array.isArray(curr[name])) {
        acc[name].push(...curr[name]);
      }
    }
    return acc;
  }, allStatus);

  return (
    <Tooltip title={value} placement="left">
      <Form layout="inline" className={className}>
        <SwitchPanel
          sensor={{ name: 'all', ...allStatus }}
          value={value}
          size="small"
        />
        {sensors &&
          sensors.map((sensor) => (
            <SwitchPanel
              key={sensor.name}
              sensor={sensor}
              value={value}
              size="small"
            />
          ))}
      </Form>
    </Tooltip>
  );
};
export default SensorSwitch;
