import { ActivityIndicator, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarNavigation from './TabBarNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AuthScreen from '../screens/Authentication/AuthScreen';
import RegisterInf from '../screens/Authentication/RegisterInf';
import OrderDetailScreen from '../screens/Home/OrderDetailScreen';
import EditFoodScreen from '../screens/Menu/EditFoodScreen';
import MapScreen from '../screens/Profile/MapScreen';
import AddFoodScreen from '../screens/Menu/AddFoodScreen';
import ReviewScreen from '../screens/Profile/ReviewScreen';
import RestaurantProfileScreen from '../screens/Profile/RestaurantScreen';
import WalletScreen from '../screens/Profile/WalletScreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
    const navigation = useNavigation()
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchToken = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            setAccessToken(token);
        } catch (error) {
            console.error("Failed to retrieve access token:", error);
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        fetchToken();
    }, []);
    return (
        <Stack.Navigator initialRouteName={accessToken ? "Trang chủ" : "Auth"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen
                name="Đăng kí thông tin"
                component={RegisterInf}
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    headerLeft: null,
                }}
            />

            <Stack.Screen name="Trang chủ">{() => <TabBarNavigation />}</Stack.Screen>
            <Stack.Screen
                name="Chỉnh sửa món ăn"
                component={EditFoodScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen
                name="Thêm món ăn"
                component={AddFoodScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen
                name="Địa chỉ"
                component={MapScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen
                name="Chi tiết đơn hàng"
                component={OrderDetailScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen
                name="Review"
                component={ReviewScreen}
                options={{ headerShown: true, headerTitle: 'Đánh giá', headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen name='Profile' component={RestaurantProfileScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
            />
            <Stack.Screen
                name="Wallet"
                component={WalletScreen}
                options={{ headerShown: true, headerBackTitle: 'Quay lại', title: 'Ví' }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;