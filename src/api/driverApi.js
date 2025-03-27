
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import handleApiError from './handleApiError';
const apiKey = '123';
const getInfoDriver = async (driver_id) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(`/driver/${driver_id}/detail`,
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );
        return {
            success: true,
            data: response.data.metadata,
        }
    } catch (error) {
        return handleApiError(error);
    }
}
export { getInfoDriver };