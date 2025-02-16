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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='small' color={'#FF0000'} />
            </View>
        );
    }
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            setAccessToken(null);
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

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
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="Địa chỉ"
                component={MapScreen}
                options={{ headerShown: true }}
            />
            <Stack.Screen
                name="Chi tiết đơn hàng"
                component={OrderDetailScreen}
                options={{ headerShown: true }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;