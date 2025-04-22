import axios from 'axios';
const apiClient = axios.create({
  // baseURL: 'http://localhost:8080/v1/api/',
  // baseURL: 'http://192.168.55.45:8080/v1/api/',
  baseURL: 'https://sbr09801-8080.asse.devtunnels.ms/v1/api/',
});

export default apiClient;
