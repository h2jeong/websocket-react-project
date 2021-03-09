/* phase */
const CHECK_PHASE = 'check_phase';
const MUTATE_PHASE = 'mutate_phase';
const CHECK_RECORDING = 'check_recording';
const CLEAR_PHASE = 'clear_phase';

const initialState = {
  ready: false,
  recording: false,
  status: undefined
};

export function checkPhase(ready) {
  return { type: CHECK_PHASE, payload: ready };
}

export function mutatePhase(dataToSubmit) {
  return { type: MUTATE_PHASE, payload: dataToSubmit };
}

export function checkRecording(dataToSubmit) {
  return { type: CHECK_RECORDING, payload: dataToSubmit };
}

export function clearPhase() {
  return { type: CLEAR_PHASE };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_PHASE:
      return { ...state, ready: action.payload };
    case MUTATE_PHASE:
      return { ...state, status: action.payload };
    case CHECK_RECORDING: {
      return { ...state, recording: action.payload };
    }
    case CLEAR_PHASE:
      return { ...initialState };
    default:
      return state;
  }
}
