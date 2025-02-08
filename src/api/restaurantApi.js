import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";
import fetchFcmToken from "../utils/fcmToken";
const apiKey = '123';
const signupApi = async (email, password) => {
    try {
        const fcmToken = await fetchFcmToken();
        const response = await apiClient.post(
            "/user/signup",
            { email, password, fcmToken, role: "seller" },
            {
                headers: { "x-api-key": apiKey, },
            });
        const { message, metadata } = response.data;
        if (!message) {
            throw new Error("Phản hồi không hợp lệ: thiếu trường message.");
        }
        const { accessToken, refreshToken } = metadata.tokens;
        const { email: userEmail, id: userId } = metadata.user;
        await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userEmail", userEmail],
            ["userId", userId.toString()],
        ]);
        return response.data.metadata;
    } catch (error) {
        if (error.response) {
            console.log(error.response);
            console.error("Lỗi từ server:", error.response.data);
            const serverError = error.response.data?.message || "Có lỗi xảy ra từ phía server.";
            throw new Error(serverError);
        } else if (error.request) {
            throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.");
        } else {
            console.error("Lỗi không xác định:", error.message);
            throw new Error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        }
    }
};

const loginApi = async (email, password) => {
    try {
        const response = await apiClient.post(
            "/user/login",
            { email, password },
            { headers: { "x-api-key": apiKey } });
        const { message, metadata } = response.data;
        const { accessToken, refreshToken } = metadata.tokens;
        const { email: userEmail, id: userId } = metadata.user;

        await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userEmail", userEmail],
            ["userId", userId.toString()],
        ]);
        return metadata;
    } catch (error) {
        if (error.response) {
            console.error("Lỗi từ server: ", error.response.data);
            const serverError = error.response.data?.message || "Có lỗi xảy ra từ phía server";
            throw new Error(serverError);
        } else if (error.request) {
            throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.");
        } else {
            throw new Error("Đã xảy ra lỗi không xác định . Vui lòng thử lại.");
        }
    }
};

const updateRestaurantApi = async (restaurant) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(restaurant)
        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.put(
            '/restaurant',
            {
                restaurant,
            },
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );

        const { message, metadata } = response.data;
        if (!message) {
            console.error('Error message:', message);
            return; // Or throw an error
        }

        return metadata;
    } catch (error) {
        console.error("Update restaurant failed:", error);
        throw error;
    }
};
const getInformationRes = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(
            '/restaurant/detail',
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );
        const { message, metadata } = response.data;
        await AsyncStorage.setItem('restaurantId', metadata.id.toString());
        console.log(metadata.id)
        if (!message) {
            console.error('Error message:', message);
            return;
        }
        return metadata;
    } catch (error) {
        console.error("Get infomation restaurant failed:", error);
        throw error;
    }
}
const getCategories = async () => {
    try {
        const response = await apiClient.get('/categories',
            {
                headers: {
                    "x-api-key": apiKey,
                }
            })
        console.log(response.data.metadata)
        return response.data.metadata;
    } catch (error) {
        console.log(error)
    }
}
const getFoodRes = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(
            '/products/restaurantId',
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );

        const { message, metadata } = response.data;
        if (!message) {
            console.error('Error message:', message);
            return;
        }

        return metadata;
    } catch (error) {
        console.error("Get food restaurant failed:", error);
        throw error;
    }
}
const getOrderRes = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(
            '/restaurant/order',
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );

        const { metadata } = response.data;
        console.log(metadata)
        return metadata;
    } catch (error) {
        console.error("Get order restaurant failed:", error);
        throw error;
    }
}
const changeOrderStatus = async (orderId, status) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.post(
            '/restaurant/order/status',
            {
                orderId: orderId,
                status: status,
            },
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );

        const { metadata } = response.data;
        console.log(metadata)
        return metadata;
    } catch (error) {
        console.error("Get order restaurant failed:", error);
        throw error;
    }
}
const findDriver = async (orderId) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(
            `restaurant/${orderId}/driver`,
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );
        const { metadata } = response.data;
        return metadata;
    } catch (error) {
        console.error("Get order restaurant failed:", error);
        throw error;
    }
}
const rejectOrder = async (orderId, reason) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!userId || !accessToken) {
            throw new Error("User not logged in");
        }
        const response = await apiClient.get(
            `/restaurant/reject/${orderId}/${reason}`,
            {
                headers: {
                    "x-api-key": apiKey,
                    "authorization": accessToken,
                    'x-client-id': userId,
                }
            }
        );

        const { metadata } = response.data;
        console.log(metadata)
        return metadata;
    } catch (error) {
        console.error("Get order restaurant failed:", error);
        throw error;
    }
}

export { signupApi, loginApi, updateRestaurantApi, getInformationRes, getCategories, getFoodRes, getOrderRes, changeOrderStatus, findDriver, rejectOrder };
