import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import fetchFcmToken from '../utils/fcmToken';
import { Alert } from 'react-native';
import handleApiError from './handleApiError';
const apiKey = '123';
const signupApi = async (email, password) => {
  try {
    const fcmToken = await fetchFcmToken();
    await apiClient.post(
      '/user/signup',
      { email, password, fcmToken: fcmToken, role: 'seller' },
      {
        headers: { 'x-api-key': apiKey },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const loginApi = async (email, password) => {
  try {
    const response = await apiClient.post(
      '/user/login',
      { email, password, role: 'seller' },
      { headers: { 'x-api-key': apiKey } }
    );
    const { message, metadata } = response.data;
    const { accessToken, refreshToken } = metadata.tokens;
    const { email: userEmail, id: userId } = metadata.user;
    console.log(accessToken, refreshToken, userId);
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['userId', userId.toString()],
    ]);
    return { success: true, metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const resetPasswordApi = async (email, password) => {
  const fcmToken = await fetchFcmToken();
  try {
    const response = await apiClient.put(
      '/user/forgot-password',
      { email, password, role: 'seller', fcmToken: fcmToken },
      { headers: { 'x-api-key': apiKey } }
    );

    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
const updateRestaurantApi = async (restaurant, navigation) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      Alert.alert(
        'Thông báo',
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      );
      navigation.navigate('Đăng kí thông tin');
      return { success: false, message: 'Phiên đăng nhập đã hết hạn' };
    }
    const response = await apiClient.put(
      '/restaurant',
      {
        restaurant,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );

    const { message, metadata } = response.data;
    if (!message) {
      console.error('Error message:', message);
      return { success: false, message: 'Không có phản hồi từ server' };
    }

    return { success: true, metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const getInformationRes = async (navigation) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      Alert.alert(
        'Thông báo',
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      );
      navigation.navigate('Đăng kí thông tin');
      return { success: false, message: 'Phiên đăng nhập đã hết hạn' };
    }
    const response = await apiClient.get('/restaurant/detail', {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    const { message, metadata } = response.data;
    if (!metadata) {
      return { success: false, message: 'Không có dữ liệu nhà hàng' };
    }
    await AsyncStorage.setItem('restaurantId', metadata.id.toString());
    console.log(metadata.id);
    if (!message) {
      console.error('Error message:', message);
      return { success: false, message: 'Không có phản hồi từ server' };
    }
    return { success: true, metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories', {
      headers: {
        'x-api-key': apiKey,
      },
    });
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const getFoodRes = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Phiên đăng nhập đã hết hạn' };
    }
    const response = await apiClient.get(
      `/products/${restaurantId}/restaurantId`,
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );

    const { message, metadata } = response.data;
    if (!message) {
      console.error('Error message:', message);
      return { success: false, message: 'Không có phản hồi từ server' };
    }
    return { success: true, data: metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const changeOrderStatus = async (orderId, status) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.post(
      '/restaurant/order/status',
      {
        orderId: orderId,
        status: status,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );

    const { metadata } = response.data;
    console.log(metadata);
    return { success: true, data: metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const findDriver = async (orderId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(`restaurant/${orderId}/driver`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    const { metadata } = response.data;
    return { success: true, data: metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const rejectOrder = async (orderId, reason) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(
      `/restaurant/reject/${orderId}/${reason}`,
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );

    const { metadata } = response.data;
    console.log(metadata);
    return { success: true, data: metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const getReview = async (restaurantId) => {
  if (!restaurantId) {
    return { success: false, message: 'Không có ID nhà hàng', data: [] };
  }
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(`/review/${restaurantId}/restaurant`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const getOrders = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(`/restaurant/order`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });

    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const editListProduct = async (restaurantId, listProduct) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.post(
      `/restaurant/price`,
      {
        restaurant_id: restaurantId,
        products: listProduct,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const addCoupon = async (restaurantId, formData) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.post(
      `/coupon`,
      {
        restaurant_id: restaurantId,
        ...formData,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const editCoupon = async (restaurantId, formData) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.put(
      `/coupon/${restaurantId}/restautant`,
      {
        body: {
          ...formData,
        },
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const getCoupon = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(`/coupon/${restaurantId}/restaurant`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const addDiscountForListFood = async (restaurantId, formData, products) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const listProductId = products.map((item) => ({
      product_id: item.product_id,
    }));
    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.post(
      `/coupon/list/flashsale`,
      {
        couponDetails: {
          restaurant_id: restaurantId,
          ...formData,
          coupon_type: 'ONE_TIME',
        },
        products: listProductId,
        discount_type: formData.discount_type,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const addDiscountForFood = async (restaurantId, formData, product_id) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.post(
      `/coupon/flashsale`,
      {
        product_id: product_id,
        body: {
          restaurant_id: restaurantId,
          coupon_type: 'ONE_TIME',
          ...formData,
        },
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

const getDiscount = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.get(`/coupon/${restaurantId}/flashsale`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};

const editDiscounts = async (
  restaurantId,
  formData,
  addProduct,
  removeProduct
) => {
  console.log(formData);

  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }
    const response = await apiClient.put(
      `/coupon/${restaurantId}/flashsale`,
      {
        restaurant_id: restaurantId,
        body: {
          ...formData,
          coupon_type: 'ONE_TIME',
          add_products: addProduct,
          remove_products: removeProduct,
        },
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
const getMoney = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const response = await apiClient.get(`/restaurant/money/${restaurantId}`, {
      headers: {
        'x-api-key': apiKey,
        authorization: accessToken,
        'x-client-id': userId,
      },
    });
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};
const getListMoney = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const response = await apiClient.get(
      `/restaurant/list/money/${restaurantId}`,
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};
const getrequestWithdrawMoney = async (restaurantId) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const response = await apiClient.get(
      `/restaurant/list/transaction/${restaurantId}`,
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true, data: response.data.metadata };
  } catch (error) {
    return handleApiError(error);
  }
};
const requestWithdrawMoney = async (
  restaurantId,
  amount,
  account_id,
  bank_name
) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const response = await apiClient.post(
      `/restaurant/list/transaction/${restaurantId}`,
      {
        amount: amount,
        account_id: account_id,
        bank_name: bank_name,
      },
      {
        headers: {
          'x-api-key': apiKey,
          authorization: accessToken,
          'x-client-id': userId,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export {
  signupApi,
  loginApi,
  updateRestaurantApi,
  getInformationRes,
  getCategories,
  getFoodRes,
  changeOrderStatus,
  findDriver,
  rejectOrder,
  getReview,
  getOrders,
  editListProduct,
  addCoupon,
  editCoupon,
  getCoupon,
  addDiscountForListFood,
  addDiscountForFood,
  getDiscount,
  editDiscounts,
  getMoney,
  getListMoney,
  getrequestWithdrawMoney,
  requestWithdrawMoney,
  resetPasswordApi,
};
