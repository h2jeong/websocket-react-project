const SET_UNIT = 'set_unit';
const UPDATE_INFO = 'update_info';
const CLEAR_UNIT = 'clear_unit';

const initialState = {
  // unit_name: '',
  // serial_number: '',
  // recent_project: '',
  // lidar: {},
  // camera: {},
  // gnss: {},
  // webcam: {},
  // mark: [],
  // info: {
  //   moving_distance: 0,
  //   recording_distance: 0,
  //   storage: 0,
  //   user_count: 0,
  //   working_time: ''
  // }
};

export function setUnit(dataToSubmit) {
  return { type: SET_UNIT, payload: dataToSubmit };
}

export function updateInfo(dataToSubmit) {
  return { type: UPDATE_INFO, payload: dataToSubmit };
}

export function clearUnit() {
  return { type: CLEAR_UNIT };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_UNIT:
      return { ...action.payload };
    case UPDATE_INFO:
      return { ...state, info: { ...action.payload } };
    case CLEAR_UNIT:
      return initialState;
    default:
      return state;
  }
}
