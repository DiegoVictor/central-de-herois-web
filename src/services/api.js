import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const setAuthHeader = (value) => {
  api.defaults.headers.common.Authorization = value;
};

export default api;
