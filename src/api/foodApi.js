
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

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
            categoriId: newFood.categories,
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
const getToppingFood = async (foodId) => {
    const response = await apiClient.get(`/topping/getall/${foodId}`,
        {
            headers: {
                "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
            }
        });
    return response.data.metadata;
}
const getCategoryFood = async (foodId) => {
    try {
        const response = await apiClient.get(`/categories/${foodId}`,
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
                }
            });
        return response.data.metadata;
    } catch (error) {

    }
}
const updateFoodInApi = async (foodData) => {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
        throw new Error("User not logged in");
    }
    const productData = {
        name: foodData.name,
        image: foodData.image,
        descriptions: foodData.descriptions,
        price: foodData.price
    }
    const toppingData = foodData.toppings.map(option => ({
        topping_name: option.topping_name,
        price: option.price,
    }));
    const response = await apiClient.put(`/products/${foodData.id}`,
        {
            categoriId: foodData.categories,
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
const publicProductApi = async (foodId) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.post(`/products/public/${foodId}`,
            {},
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        )
        if (response.status === 200) {
            return true
        }
        else return false
    } catch (error) {
        console.log(error)
        return false
    }
}
const unPublicProductApi = async (foodId) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.post(`/products/unpublic/${foodId}`,
            {},
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        )
        if (response.status === 200) {
            return true
        }
        else return false
    } catch (error) {
        console.log(error)
        return false
    }
}
export { createFoodInApi, updateFoodInApi, getToppingFood, getCategoryFood, publicProductApi, unPublicProductApi }
