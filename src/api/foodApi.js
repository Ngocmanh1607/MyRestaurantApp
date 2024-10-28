
import apiClient from './apiClient';

const fetchFoodFromApi = async () => {
    const response = await apiClient.get('/foods');
    return response.data;
};
// API call để tạo mới một món ăn
const createFoodInApi = async (newFood) => {
    const response = await apiClient.post('/foods', newFood);
    return response.data;
};

// API call để cập nhật một món ăn theo ID
const updateFoodInApi = async (id, updatedFood) => {
    const response = await apiClient.put(`/foods/${id}`, updatedFood);
    return response.data;
};
export { fetchFoodFromApi, createFoodInApi, updateFoodInApi }
