import axios from 'axios';

const LOGIN_USER = 'login_user';
const SELECT_PROJECT = 'select_project';
const LOGOUT_USER = 'logout_user';

const tower = process.env.REACT_APP_STRYX_TWR
  ? process.env.REACT_APP_STRYX_TWR
  : 'http://app.stryx.co.kr:34567';

export function loginUser(loginData) {
  const request = axios
    .post(`${tower}/api/authentication`, loginData, { crossDomain: true })
    .then((res) => res.data);

  return { type: LOGIN_USER, payload: request };
}

export function selectProject(id) {
  const token = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).token
    : null;
  const config = { headers: { Authorization: token } };
  const request = axios
    .get(`${tower}/api/projects?id=${id}`, config)
    .then((res) => res.data);

  return { type: SELECT_PROJECT, payload: request };
}

export function logoutUser() {
  return { type: LOGOUT_USER };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER: {
      if (!action.payload.user) return state;

      const { user, accessToken } = action.payload;

      return { ...state, user, accessToken, projects: user.projects };
    }
    case SELECT_PROJECT: {
      const project = action.payload[0];
      return { ...state, project };
    }
    case LOGOUT_USER:
      return {};
    default:
      return state;
  }
}
