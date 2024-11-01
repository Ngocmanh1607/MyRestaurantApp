import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";

const signupApi = async (email, password) => {
    const response = await apiClient.post(
        "/user/signup",
        {
            email: email,
            password: password
        },
        {
            headers: {
                "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de"
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
};

const loginApi = async (email, password) => {
    try {
        const response = await apiClient.post(
            "/user/login",
            {
                email: email,
                password: password
            },
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
                }
            }
        );

        const { message, metadata } = response.data;
        if (!message) {
            console.error('Error message:', message);
            return; // Or throw an error
        }

        const { accessToken, refreshToken } = metadata.tokens;
        const { email: userEmail, id: userId } = metadata.user;

        await AsyncStorage.multiSet([
            ['accessToken', accessToken],
            ['refreshToken', refreshToken],
            ['userEmail', userEmail],
            ['userId', userId.toString()]
        ]);

        console.log('User logged in successfully:', {
            accessToken,
            refreshToken,
            userEmail,
            userId
        });

        return metadata;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
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
                restaurant
            },
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
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
        //console.log(restaurant)
        const response = await apiClient.get(
            '/restaurant/detail',
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
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
        console.error("Get infomation restaurant failed:", error);
        throw error;
    }
}
const getCategories = async () => {
    try {
        const response = await apiClient.get('/categories',
            {
                headers: {
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
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
                    "x-api-key": "d3e004aa8a4f5f2f2f0df447c397ba8024c27407563ca7809e50520f01f670b7206d42b17b6b01afc124a0f3d1d93fc9e033df72f67aba2f89da961104cb06de",
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
export { signupApi, loginApi, updateRestaurantApi, getInformationRes, getCategories, getFoodRes };
