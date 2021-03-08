import { message } from 'antd';
import { afterPostMessage } from './chat';
import { setUnit, updateInfo, clearUnit } from './unit';
import { clearSensor, setStatus, updateMonitor } from './sensor';
import { checkPhase, checkRecording } from './phase';
import { subtractVhcl } from '../plugins/map/draw';

/* webSocket */
const WS_INIT = 'ws_init';
const WS_CONNECTED = 'ws_connected';
const WS_CLOSED = 'ws_closed';
const WS_MESSAGE = 'ws_message';
const WS_ERROR = 'ws_error';

const SOCKET =
  process.env.REACT_APP_ENV === 'development'
    ? // ? 'ws://192.168.1.11:3003';
      'ws://127.0.0.1:3002'
    : 'ws://127.0.0.1:3003';
const initialState = { connected: false, readyState: null, socket: null };

function wsInit(socket) {
  console.log('WebSocket Init:', socket);
  return { type: WS_INIT, payload: socket };
}

function wsConnected() {
  message.info('WebSocket Connected.');
  return { type: WS_CONNECTED };
}

export function wsClosed() {
  message.info('WebSocket Closed.', 10);
  return { type: WS_CLOSED };
}

function wsMessage(data) {
  return { type: WS_MESSAGE, payload: data };
}

function wsError(e) {
  console.log('WebSocket Error:', e);
  return { type: WS_ERROR };
}

function decodingImage(base64Data) {
  const image = new Image();
  image.src = `data:image/jpg;base64,${base64Data}`;
  // image.src = base64Data
  return image;
}

function checkStatus(status) {
  return Object.values(status).reduce(
    (acc, curr) => curr.some((el) => !!(el * 1)) || acc,
    false
  );
}

let sn = null;

export function initializeSocket() {
  return (dispatch) => {
    const socket = new WebSocket(SOCKET);
    const userId = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).id
      : null;
    let reconnecting = false;

    if (!userId) return dispatch(wsClosed());

    dispatch(wsInit(socket));

    socket.onopen = () => {
      message.info(`WebSocket ready state - ${socket.readyState}`);
      socket.send(
        JSON.stringify({
          type: 'connect',
          userId: userId
        })
      );
      dispatch(wsConnected());
    };

    socket.onerror = (e) => {
      message.error(
        `WebSocket error observed: Error in connection establishment.`
      );
      dispatch(wsError(e));
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      dispatch(wsMessage(msg));

      switch (msg.msg_type) {
        case 'chat':
          dispatch(afterPostMessage(msg));
          break;
        case 'init_msg': {
          // console.log('init_msg', msg.msg_type, msg);
          dispatch(setUnit(msg));
          sn = msg?.serial_number;
          break;
        }
        case 'argos_status': {
          // console.log('argos_status', msg.msg_type, msg);
          const {
            connected,
            recorded,
            user_count,
            working_time,
            moving_distance,
            recording_distance,
            storage
            // power, connected, ready, recorded, user_count, working_time, moving_distance, recording_distance, storage
          } = msg;
          const info = {
            user_count,
            working_time,
            moving_distance,
            recording_distance,
            storage
          };

          dispatch(setStatus(msg));
          dispatch(checkPhase(checkStatus(connected)));
          dispatch(checkRecording(checkStatus(recorded)));
          dispatch(updateInfo(info));
          break;
        }
        case 'monitor': {
          const { lidar, gnss, camera, image, pcd, mark } = msg;
          // console.log('monitor: ', msg);
          const convertImages =
            image && image.length > 0 && image.map((img) => decodingImage(img));
          const dataToSubmit = {
            lidar: { status: lidar, data: { pointCloud: pcd ? pcd : null } },
            gnss: { status: gnss, data: { latlngs: mark ? mark : null } },
            camera: { status: camera, data: { images: convertImages } }
          };

          dispatch(updateMonitor(dataToSubmit));
          break;
        }
        default:
      }
    };

    socket.onclose = () => {
      message.info(`WebSocket state - ${socket.readyState}`);

      if (socket.socket) {
        if (reconnecting) return;
        reconnecting = true;
        setTimeout(() => {
          reconnecting = false;
          dispatch(wsClosed());
        }, 2000);
      }

      // INIT
      dispatch(wsClosed());
      sn && subtractVhcl(sn);
      dispatch(clearSensor());
      dispatch(clearUnit());
    };
  };
}

export default function reducer(state = { ...initialState }, action) {
  switch (action.type) {
    case WS_INIT:
      return { ...state, connected: true, socket: action.payload };
    case WS_CONNECTED:
      return { ...state, connected: true };
    case WS_CLOSED:
      return { ...state, connected: false, socket: null };
    case WS_MESSAGE:
      console.log('message:', action.payload);
      return { ...state, data: action.payload };
    case WS_ERROR:
      return { ...state, connected: false };
    default:
      return state;
  }
}
