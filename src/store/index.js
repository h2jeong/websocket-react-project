import { combineReducers } from 'redux';
import user from './user';
import socket from './socket';
import sensor from './sensor';
import chat from './chat';
import unit from './unit';
import phase from './phase';

const rootReducer = combineReducers({
  user,
  socket,
  sensor,
  chat,
  unit,
  phase
});

export default rootReducer;
