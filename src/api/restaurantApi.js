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
                headers: {
                    "x-api-key": apiKey
                }
            }
        );

        const { message, metadata } = response.data;
        if (!message) {
            console.error('Error message:', message);
            return;
        }

        const { accessToken, refreshToken } = metadata.tokens;
        const { email: userEmail, id: userId } = metadata.user;

        console.log('Data stored successfully:', {
            accessToken,
            refreshToken,
            userEmail,
            userId
        });

        await AsyncStorage.multiSet([
            ['accessToken', accessToken],
            ['refreshToken', refreshToken],
            ['userEmail', userEmail],
            ['userId', userId.toString()]
        ]);

        return response.data.metadata;
    } catch (error) {

    }
};

const loginApi = async (email, password, setLoading) => {
    try {
        setLoading(true);
        const response = await apiClient.post(
            "/user/login",
            { email, password },
            { headers: { "x-api-key": apiKey } }
        );

        const { message, metadata } = response.data;
        const { accessToken, refreshToken } = metadata.tokens;
        const { email: userEmail, id: userId } = metadata.user;

        await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userEmail", userEmail],
            ["userId", userId.toString()],
        ]);

        console.log("Đăng nhập thành công:", {
            accessToken,
            refreshToken,
            userEmail,
            userId,
        });

        return metadata;
    } catch (error) {
        setLoading(false);
        if (error.response) {
            console.error("Lỗi từ máy chủ:", error.response.data);
            Toast.show({
                type: "error",
                text1: "Đăng nhập thất bại",
                text2: error.response.data.message || "Có lỗi xảy ra từ máy chủ.",
            });
        } else if (error.request) {
            console.error("Không nhận được phản hồi từ máy chủ:", error.request);
            Toast.show({
                type: "error",
                text1: "Lỗi mạng",
                text2: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
            });
        } else {
            console.error("Lỗi không mong muốn:", error.message);
            Toast.show({
                type: "error",
                text1: "Lỗi không xác định",
                text2: "Có lỗi xảy ra, vui lòng thử lại.",
            });
        }
    }
    finally {
        setLoading(false);
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
