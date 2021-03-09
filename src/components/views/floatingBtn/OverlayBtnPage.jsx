import React, { useEffect, useState } from 'react';
import { Avatar, Button, Tooltip } from 'antd';
import {
  StockOutlined,
  SettingOutlined,
  CloudOutlined,
  CameraOutlined,
  RightOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ModalPanel from '../common/ModalPanel';
import Cloud from './sections/Cloud';
import Report from './sections/Report';
import OptionConfig from './sections/OptionConfig';
import { logoutUser } from '../../../store/user';
import { wsClosed } from '../../../store/socket';
import Webcam from './sections/Webcam';

/* floating overlay buttons - layout */
const OverlayBtn = ({ sensors }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  /* setting config options - Server development required */
  const [configs, setConfigs] = useState({
    triggerDistance: '',
    autoControl: 'off'
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (sensors.gnss.status) {
      setConfigs({
        ...configs,
        triggerDistance: sensors.gnss.status.trigger_distance
      });
    }
  }, [sensors]);

  /** touch event */
  useEffect(() => {
    const handleStart = (e) => {
      e.preventDefault();

      let toggle = false;
      const target = e.changedTouches[0].target;
      const text = target.innerText;
      const dataIcon = target.getAttribute('data-icon');

      switch (target.parentElement.id || text || dataIcon) {
        case 'OPEN':
          toggle = !toggle ? true : false;
          onHandleBtns(toggle);
          break;
        case 'WEBCAM':
          showModal('WEBCAM');
          break;
        case 'CLOUD':
          showModal('CLOUD');
          break;
        case 'REPORT':
          showModal('REPORT');
          break;
        case 'OPTION':
          showModal('OPTION');
          break;
        case 'CLOSE':
        case 'CANCEL':
        case 'close':
          handleCancel();
          onHandleBtns(false);
          break;
        case 'APPLY':
          handleApply();
          break;
        case 'LOGOUT':
          handleLogout();
          break;
        default:
          break; //Everything else
      }
    };

    window.addEventListener('touchstart', handleStart, {
      capture: false,
      passive: false
    });

    return () => {
      window.removeEventListener('touchstart', handleStart);
    };
  }, []);

  const onHandleBtns = (isShow) => {
    setShowButtons(isShow);
  };

  const showModal = (name) => {
    setVisible(true);
    setSelected(name);
  };

  const handleLogout = () => {
    setVisible(false);
    dispatch(logoutUser());
    dispatch(wsClosed());
    localStorage.removeItem('persist:root');
    window.location.replace('/login');
  };

  /* websocket command : setting config options - Server development required */
  const handleApply = () => {
    console.log('handleApply', configs);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onChangeConfigs = (e) => {
    const { name, value } = e;
    setConfigs({ ...configs, [name]: value });
  };

  /** selected floating modal */
  const selectComponent = () => {
    switch (selected) {
      case 'WEBCAM':
        return <Webcam />;
      case 'CLOUD':
        return <Cloud lidarData={sensors.lidar.data} />;
      case 'REPORT':
        return <Report />;
      case 'OPTION':
        return (
          <OptionConfig
            configs={configs}
            changeConfigs={(e) => onChangeConfigs(e)}
          />
        );
      default:
        return false;
    }
  };

  /* modal footer buttons */
  const defaultFooter = [
    <Button ghost key="2" onClick={handleApply} className="btnInDark">
      <span>APPLY</span>
    </Button>,
    <Button ghost key="3" onClick={handleCancel} className="btnInDark">
      <span>CANCEL</span>
    </Button>,
    <Button ghost key="1" onClick={handleLogout} className="btnInDark">
      <span>LOGOUT</span>
    </Button>
  ];

  return (
    <>
      <div className="ant-btn overlayBtn">
        {showButtons ? (
          <>
            <Tooltip title="CLOSE" placement="right">
              <Avatar
                style={{ backgroundColor: 'silver', color: '#656565' }}
                icon={<DownOutlined id="CLOSE" />}
                size="large"
                onClick={() => onHandleBtns(false)}
              />
            </Tooltip>
            <Tooltip title="WEBCAM" placement="right">
              <Avatar
                style={{ backgroundColor: '#339933' }}
                icon={<CameraOutlined id="WEBCAM" />}
                onClick={() => showModal('WEBCAM')}
              />
            </Tooltip>
            <Tooltip title="CLOUD" placement="right">
              <Avatar
                style={{ backgroundColor: '#444444' }}
                icon={<CloudOutlined id="CLOUD" />}
                onClick={() => showModal('CLOUD')}
                name="cloud"
              />
            </Tooltip>
            <Tooltip title="REPORT" placement="right">
              <Avatar
                style={{ backgroundColor: '#0099CC' }}
                icon={<StockOutlined id="REPORT" />}
                onClick={() => showModal('REPORT')}
                name="report"
              />
            </Tooltip>
            <Tooltip title="OPTION" placement="right">
              <Avatar
                style={{ backgroundColor: '#CC3366' }}
                icon={<SettingOutlined id="OPTION" />}
                onClick={() => showModal('OPTION')}
                name="optionConfig"
              />
            </Tooltip>
          </>
        ) : (
          <Tooltip title="OPEN" placement="right">
            <Avatar
              style={{ backgroundColor: '#ddd', color: '#555' }}
              icon={<RightOutlined id="OPEN" />}
              size="large"
              onClick={() => onHandleBtns(true)}
            />
          </Tooltip>
        )}
      </div>
      <ModalPanel
        title={selected}
        visible={visible}
        handleOk={handleLogout}
        handleCancel={handleCancel}
        handleApply={handleApply}
        footer={selected === 'OPTION' ? defaultFooter : null}
        width={selected === 'CLOUD' ? '83%' : '21rem'}
        wrapClassName="darkMode">
        {selectComponent()}
      </ModalPanel>
    </>
  );
};

export default OverlayBtn;
