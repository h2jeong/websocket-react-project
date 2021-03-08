/* chat */
// import axios from 'axios';

const GET_CHATS = 'get_chats';
const AFTER_POST_MESSAGE = 'after_post_message';

const initialState = {
  chats: []
};
export function getChats() {
  // const request = axios.get(`${BaseUrl.messages}`).then((res) => res.data);
  return { type: GET_CHATS };
}

export function afterPostMessage(data) {
  return { type: AFTER_POST_MESSAGE, payload: data };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHATS:
      return { ...state, chats: action.payload };
    case AFTER_POST_MESSAGE:
      console.log('chats:', action.payload);
      return { ...state, chats: state.chats.concat(action.payload) };
    default:
      return state;
  }
}
