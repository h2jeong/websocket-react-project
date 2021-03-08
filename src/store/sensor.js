/* sensor */
const SET_LOADING = 'set_loading';
const SET_STATUS = 'set_status';
const UPDATE_MONITOR = 'update_monitor';
const CLEAR_SENSOR = 'clear_sensor';

const initialState = [
  {
    power: undefined,
    name: 'lidar',
    loading: false
  },
  {
    power: undefined,
    name: 'gnss',
    loading: false
  },
  {
    power: undefined,
    name: 'camera',
    loading: false
  }
  // {
  //   name: 'webcam',
  //   power: undefined,
  //   loading: false,
  //   data: {
  //     images: {
  //       deviceIndex: 0,
  //       dataIndex: 0,
  //       data: ['x.jpg', 'x.jpg'],
  //       row: 1024,
  //       col: 912
  //     }
  //   }
  // }
];

export function setStatus(dataToSubmit) {
  return { type: SET_STATUS, payload: dataToSubmit };
}

export function setLoading(dataToSubmit) {
  return { type: SET_LOADING, payload: dataToSubmit };
}

export function updateMonitor(dataToSubmit) {
  return { type: UPDATE_MONITOR, payload: dataToSubmit };
}

export function clearSensor() {
  return { type: CLEAR_SENSOR };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_STATUS: {
      // console.log('setStatus:', action.payload);
      const { power, connected, ready, recorded } = action.payload;
      const names = Object.keys(power);

      return state.map((sensor) =>
        names.indexOf(sensor.name) > -1
          ? {
              ...sensor,
              power: power[sensor.name],
              connected: connected[sensor.name],
              ready: ready[sensor.name],
              recorded: recorded[sensor.name]
            }
          : sensor
      );
    }
    case SET_LOADING: {
      const { name, value } = action.payload;

      if (name === 'all') {
        return state.map((sensor) => ({ ...sensor, loading: value }));
      }
      return state.map((sensor) =>
        sensor.name === name
          ? {
              ...sensor,
              loading: value
            }
          : sensor
      );
    }
    case UPDATE_MONITOR: {
      const monitor = action.payload;
      const names = Object.keys(monitor);
      // console.log('UPDATE_MONITOR:', monitor, names);

      return state.map((sensor) =>
        names.indexOf(sensor.name) > -1
          ? {
              ...sensor,
              status: { ...monitor[sensor.name].status },
              data: { ...monitor[sensor.name].data }
            }
          : sensor
      );
      // return state.map((sensor) =>
      //   names.indexOf(sensor.name) > -1
      //     ? {
      //         ...sensor,
      //         status: { ...monitor[sensor.name] }
      //       }
      //     : sensor
      // );
    }
    case CLEAR_SENSOR:
      return initialState;
    default:
      return state;
  }
}
