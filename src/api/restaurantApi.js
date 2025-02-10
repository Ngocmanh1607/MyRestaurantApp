import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";
import fetchFcmToken from "../utils/fcmToken";
import { Alert } from "react-native";
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

const updateRestaurantApi = async (restaurant, navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(restaurant)
        if (!userId || !accessToken) {
            Alert.alert("Thông báo", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            navigation.navigate("Đăng kí thông tin");
            return;
        }
        const response = await apiClient.put(
            '/restaurant', {
            restaurant,
        }, {
            headers: {
                "x-api-key": apiKey,
                "authorization": accessToken,
                'x-client-id': userId,
            },
        });

        const { message, metadata } = response.data;
        if (!message) {
            console.error('Error message:', message);
            return; // Or throw an error
        }

        return metadata;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('userId');
                Alert.alert("Phiên hết hạn", "Vui lòng đăng nhập lại.");
                navigation.navigate("Đăng kí thông tin");
                return;
            }
            const serverError = error.response.data?.message || "Có lỗi xảy ra từ phía server";
            throw new Error(serverError);
        } else if (error.request) {
            throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.");
        } else {
            throw new Error("Đã xảy ra lỗi không xác định . Vui lòng thử lại.");
        }
    }
};
const getInformationRes = async (navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            Alert.alert("Thông báo", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            navigation.navigate("Đăng kí thông tin");
            return;
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
        if (error.response) {
            if (error.response.status === 401) {
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('userId');
                Alert.alert("Phiên hết hạn", "Vui lòng đăng nhập lại.");
                navigation.navigate("Đăng kí thông tin");
                return;
            }
            const serverError = error.response.data?.message || "Có lỗi xảy ra từ phía server";
            throw new Error(serverError);
        } else if (error.request) {
            throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.");
        } else {
            throw new Error("Đã xảy ra lỗi không xác định . Vui lòng thử lại.");
        }
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
}
const getFoodRes = async (navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (!userId || !accessToken) {
            if (!userId || !accessToken) {
                Alert.alert("Thông báo", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                navigation.navigate("Đăng kí thông tin");
                return;
            }
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
        if (error.response) {
            if (error.response.status === 401) {
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('userId');
                Alert.alert("Phiên hết hạn", "Vui lòng đăng nhập lại.");
                navigation.navigate("Đăng kí thông tin");
                return;
            }
            const serverError = error.response.data?.message || "Có lỗi xảy ra từ phía server";
            throw new Error(serverError);
        } else if (error.request) {
            throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra lại kết nối mạng.");
        } else {
            throw new Error("Đã xảy ra lỗi không xác định . Vui lòng thử lại.");
        }
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
}

export { signupApi, loginApi, updateRestaurantApi, getInformationRes, getCategories, getFoodRes, changeOrderStatus, findDriver, rejectOrder };
