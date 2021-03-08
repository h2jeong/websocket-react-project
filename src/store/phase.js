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

/*
state : {
    epic: {
        rounds: [
            "abc_20201212000000", "abc_202012123000000"
        ],
        "abc_20201212000000" : {
            snaps : ['snap_202012120001','snap_202012120002','snap_202012120003','snap_202012120004'],
            uuid: 'asdflkdj',
            date: '20201212000000',
            gnss: { date: '202012120000'},
            'snap_202012120004': {
                uuid: 'dfdfdfds',
                date: '20201212000000',
                latlngs : { start: 10, end: 10 }
            }
        },
        "abc_20201213000000" : {
            snaps : [],
            uuid: 'fsdflkdj',
            date: '20201213000000',
            gnss: { date: '202012130000'}
        },
        currentRound: "abc_20201212000000",
        currentSnap: 'snap_202012120004',
        lastSnap: 'snap_202012120004',

    },
    phase: 'round', // snap
    latlngs: [...]
}
*/
