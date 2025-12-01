import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  auth: {
    username: 'user',
    password: '1234'
  }
});

export default api;
