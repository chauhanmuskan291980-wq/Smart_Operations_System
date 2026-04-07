import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Node.js server URL
});

export default api;