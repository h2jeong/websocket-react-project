import React from 'react';
import { Input, Typography } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import SelectProject from './SelectProject';
import FloatLabel from '../../common/FloatLabel';
import SensorSwitch from '../../common/SensorSwitch';

const { Title } = Typography;

/* Option Config - Server development required */
const OptionConfig = ({ configs, changeConfigs }) => {
  // config - trigger_distance, auto on/off, ...
  const unit = useSelector(
    ({ unit }) => ({
      unit_name: unit.unit_name,
      serial_number: unit.serial_number,
      info: unit.info
    }),
    shallowEqual
  );

  const onHandleChange = (e) => {
    changeConfigs(e.target);
  };

  const renderArgosInfo = () => {
    const infos = Object.keys(unit.info);
    let items = [];
    for (let i = 0; i < infos.length; i += 1) {
      let title = infos[i][0].toUpperCase() + infos[i].slice(1);
      items.push(
        <p key={title}>
          {title} : {unit.info[infos[i]]}
        </p>
      );
    }
    return items;
  };

  return (
    <div>
      <div className="divSpace">
        <Title level={5}>Power</Title>
        <SensorSwitch value="power" className="btnPower" />
      </div>
      <div className="divSpace">
        <Title level={5}>Project</Title>
        <SelectProject />
      </div>
      {/* temporary ui - Separating components required */}
      <div className="divSpace">
        <p className="titleSmall">Config</p>
        <FloatLabel
          label="Trigger Distance"
          name="triggerDistance"
          value={configs.triggerDistance}>
          <Input
            className="underbarStyle"
            name="triggerDistance"
            value={configs.triggerDistance}
            onChange={onHandleChange}
          />
        </FloatLabel>
        <FloatLabel
          label="Auto Control"
          name="autoControl"
          value={configs.autoControl}>
          <Input
            className="underbarStyle"
            name="autoControl"
            value={configs.autoControl}
            onChange={onHandleChange}
          />
        </FloatLabel>
        <FloatLabel label="Argument 3" name="aaa" value={configs.aaa}>
          <Input
            className="underbarStyle"
            name="aaa"
            value={configs.aaa}
            onChange={onHandleChange}
          />
        </FloatLabel>
        <FloatLabel label="Argument 4" name="bbb" value={configs.bbb}>
          <Input
            className="underbarStyle"
            name="bbb"
            value={configs.bbb}
            onChange={onHandleChange}
          />
        </FloatLabel>
      </div>
      <div className="divSpace">
        <p className="titleSmall">{unit.unit_name}</p>
        <p>Free Space: {Math.round(0 / 1024 ** 3)}GB</p>
        <p> S/N: {unit.serial_number} </p>
        {unit.info && renderArgosInfo()}
      </div>
    </div>
  );
};

export default OptionConfig;
