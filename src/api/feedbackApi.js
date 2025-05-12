import AsyncStorage from '@react-native-async-storage/async-storage';
import handleApiError from './handleApiError';
import apiClient from './apiClient';
const apiKey = '123';
export const feedbackApi = {
  async getFeedbacks(restaurantId) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/feedback/${restaurantId}`, {
        headers: {
          'x-api-key': apiKey,
          'x-client-id': userId,
          authorization: accessToken,
        },
      });

      return { success: true, data: response.data.metadata };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async createFeedback(feedback) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.post(
        `/feedback`,
        {
          restaurant_id: feedback.restaurant_id,
          customer_id: feedback.customer_id,
          order_id: feedback.order_id,
          driver_id: feedback.driver_id,
          content: feedback.content,
          restaurant_res: true,
        },
        {
          headers: {
            'x-api-key': apiKey,
            'x-client-id': userId,
            authorization: accessToken,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
