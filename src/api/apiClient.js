
import axios from 'axios'

const apiClient = axios.create({
    // https://26af-103-130-211-146.ngrok-free.app
    baseURL: 'http://localhost:8080/v1/api/',
    // baseURL: 'https://26af-103-130-211-146.ngrok-free.app/v1/api/',
    // baseURL: 'http://192.168.14.60:8080/v1/api/',
    // baseURL: 'http://192.168.55.147:8080/v1/api/',
})
// Xử lý lỗi toàn cục (optional)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default apiClient;