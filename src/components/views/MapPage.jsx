import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, Layout } from 'antd';
import GeoMap from './sections/GeoMap';
import FloatingState from '../floatingState';
import OverlayBtn from '../floatingBtn';
import Chat from '../chat/ChatPage';
import { initializeSocket } from '../../../store/socket';
import { selectProject } from '../../../store/user';

const { Content } = Layout;

const MapPage = ({ history }) => {
  const user = useSelector(
    ({ user }) => ({
      id: user.user?.id,
      project: user.project,
      token: user.accessToken,
      projects: user.projects
    }),
    shallowEqual
  );
  const sensor = useSelector((state) => state.sensor, shallowEqual);
  const phase = useSelector(
    ({ phase }) => ({
      ready: phase.ready,
      status: phase.status,
      recording: phase.recording
    }),
    shallowEqual
  );
  const unit = useSelector(
    ({ unit }) => ({
      mark: unit.mark,
      serial_number: unit.serial_number,
      recent_project: unit.recent_project
    }),
    shallowEqual
  );
  const socket = useSelector(
    ({ socket }) => ({ connected: socket.connected }),
    shallowEqual
  );

  const [clientSize, setClientSize] = useState({
    width: 1536,
    height: 754
  });
  const [selected, setSelected] = useState(user.project);

  const dispatch = useDispatch();

  const sensors = sensor.reduce((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  }, {});

  useEffect(() => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;

    setClientSize({ width: clientWidth, height: clientHeight });
  }, [window]);

  useEffect(() => {
    if (!user.token) history.push('/login');

    dispatch(initializeSocket(user.id));
  }, [user.token]);

  useEffect(() => {
    if (selected) return;
    let id = null;
    /* init recent project - Server development required */
    if (user.projects) {
      id = user.projects[0].id;
    }
    // if (unit.recent_project) {
    //   id = unit.recent_project;
    // }
    const config = { headers: { Authorization: user.token } };

    dispatch(selectProject(id, config)).then((res) => {
      setSelected(res.payload[0]);
    });
  }, []);
  // }, [unit.recent_project]);

  return (
    <Layout>
      <Content>
        <FloatingState
          sensors={sensors}
          sn={unit.serial_number}
          phase={phase}
        />
        <OverlayBtn sensors={sensors} />
        <Chat />
        <GeoMap
          width={clientSize.width}
          height={clientSize.height}
          project={selected}
          mark={unit.mark}
        />
        {socket.connected ? null : (
          <Button
            type="primary"
            danger
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: 'calc(50vw - 7rem)',
              width: '14rem',
              background: '#ff4d4f'
            }}
            onClick={() => window.location.replace('/')}>
            Socket disconnected. Plz, Click!
          </Button>
        )}
      </Content>
    </Layout>
  );
};

export default withRouter(MapPage);
