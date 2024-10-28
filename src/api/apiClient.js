
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/v1/api/',
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