
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

const fetchFoodFromApi = async () => {
    const response = await apiClient.get('/foods');
    return response.data;
};
// API call để tạo mới một món ăn
const createFoodInApi = async (newFood) => {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
        throw new Error("User not logged in");
    }
    const productData = {
        name: newFood.name,
        image: newFood.image,
        descriptions: newFood.descriptions, price: newFood.price
    }
    const toppingData = newFood.options.map(option => ({
        topping_name: option.topping_name,
        price: option.price,
    }));
    const response = await apiClient.post('/products',
        {
            categoriData: newFood.categories,
            toppingData: toppingData,
            productData: productData
        },
        {
            headers: {
                "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
                "authorization": accessToken,
                'x-client-id': userId,
            }
        });
    return response.data;
};
const getToppingFood = async
const updateFoodInApi = async (id, updatedFood) => {
    const response = await apiClient.put(`/foods/${id}`, updatedFood);
    return response.data;
};
export { fetchFoodFromApi, createFoodInApi, updateFoodInApi }
