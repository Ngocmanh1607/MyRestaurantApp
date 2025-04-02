import axios from 'axios';
const apiClient = axios.create({
  // https://26af-103-130-211-146.ngrok-free.app
  baseURL: 'http://localhost:8080/v1/api/',
  // baseURL: 'http://192.168.55.45:8080/v1/api/',
  // baseURL: 'https://26af-103-130-211-146.ngrok-free.app/v1/api/',
  // baseURL: 'https://8aec-113-22-34-1.ngrok-free.app/v1/api/',
  // baseURL: 'https://lh30mlhb-8080.asse.devtunnels.ms//v1/api/',
});

export default apiClient;
