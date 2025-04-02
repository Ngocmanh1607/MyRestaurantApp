import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { Alert } from 'react-native';
import handleApiError from './handleApiError';
const apiKey = '123';
const createFoodInApi = async (newFood) => {
  const userId = await AsyncStorage.getItem('userId');
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (!userId || !accessToken) {
    throw new Error('User not logged in');
  }
  const productData = {
    name: newFood.name,
    image: newFood.image,
    descriptions: newFood.descriptions,
    price: newFood.price,
  };
  const toppingData = newFood.options.map((option) => ({
    topping_name: option.topping_name,
    price: option.price,
  }));
  try {
    const response = await apiClient.post(
      '/products',
      {
        categoriId: newFood.categories,
        toppingData: toppingData,
        productData: productData,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
const getToppingFood = async (foodId) => {
  try {
    const response = await apiClient.get(`/topping/getall/${foodId}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    return response.data.metadata;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server: ', error.response.data);
      const serverError = error.response.data?.message || 'Có lỗi xảy ra từ phía server';
      throw new Error(serverError);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error('Đã xảy ra lỗi không xác định . Vui lòng thử lại.');
    }
  }
};
const getCategoryFood = async (foodId) => {
  try {
    const response = await apiClient.get(`/categories/${foodId}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    return response.data.metadata;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server: ', error.response.data);
      const serverError = error.response.data?.message || 'Có lỗi xảy ra từ phía server';
      throw new Error(serverError);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error('Đã xảy ra lỗi không xác định . Vui lòng thử lại.');
    }
  }
};
const updateFoodInApi = async (foodData) => {
  const userId = await AsyncStorage.getItem('userId');
  const accessToken = await AsyncStorage.getItem('accessToken');

  if (!userId || !accessToken) {
    throw new Error('User not logged in');
  }
  const productData = {
    name: foodData.name,
    image: foodData.image,
    descriptions: foodData.descriptions,
    price: foodData.price,
  };
  const toppingData = foodData.toppings.map((option) => ({
    topping_name: option.topping_name,
    price: option.price,
  }));
  try {
    const response = await apiClient.put(
      `/products/${foodData.id}`,
      {
        categoriId: foodData.categories,
        toppingData: toppingData,
        productData: productData,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server: ', error.response.data);
      const serverError = error.response.data?.message || 'Có lỗi xảy ra từ phía server';
      throw new Error(serverError);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error('Đã xảy ra lỗi không xác định . Vui lòng thử lại.');
    }
  }
};
const publicProductApi = async (foodId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      throw new Error('User not logged in');
    }
    const response = await apiClient.put(
      `/products/show/${foodId}`,
      {},
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    if (response.status === 200) {
      return true;
    } else return false;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server: ', error.response.data);
      const serverError = error.response.data?.message || 'Có lỗi xảy ra từ phía server';
      throw new Error(serverError);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error('Đã xảy ra lỗi không xác định . Vui lòng thử lại.');
    }
  }
};
const unPublicProductApi = async (foodId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      throw new Error('User not logged in');
    }
    const response = await apiClient.put(
      `/products/show/${foodId}`,
      {},
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    if (response.status === 200) {
      return true;
    } else return false;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server: ', error.response.data);
      const serverError = error.response.data?.message || 'Có lỗi xảy ra từ phía server';
      throw new Error(serverError);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error('Đã xảy ra lỗi không xác định . Vui lòng thử lại.');
    }
  }
};
export {
  createFoodInApi,
  updateFoodInApi,
  getToppingFood,
  getCategoryFood,
  publicProductApi,
  unPublicProductApi,
};
