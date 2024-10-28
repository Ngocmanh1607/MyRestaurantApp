import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import TabBarNavigation from './TabBarNavigation';
import EditFoodScreen from '../screens/EditFoodScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import AuthScreen from '../screens/AuthScreen';
import RegisterInf from '../screens/RegisterInf';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const StackNavigator = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    //Lấy access token từ asyncStorage
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                setAccessToken(token);
                console.log(accessToken)
            } catch (error) {
                console.error("Failed to retrieve access token:", error);
            } finally {
                setLoading(false); // Set loading to false after attempting to fetch the token
            }
        };

        fetchToken();
    }, [accessToken]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            setTimeout(async () => {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    console.log("accessToken removed successfully");
                    setAccessToken(null);
                } else {
                    console.warn("accessToken still exists in storage:", token);
                }
            }, 500); // Check again after a short delay
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!accessToken ? (
                <>
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
                </>
            ) : (
                <>
                    <Stack.Screen name="Trang chủ">{() => <TabBarNavigation handleLogout={handleLogout} />}</Stack.Screen>
                    <Stack.Screen name="Đơn Hàng" component={OrderManagementScreen} />
                    <Stack.Screen
                        name="Chỉnh sửa món ăn"
                        component={EditFoodScreen}
                        options={{ headerShown: true }}
                    />
                    <Stack.Screen
                        name="Chi tiết đơn hàng"
                        component={OrderDetailScreen}
                        options={{ headerShown: true }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default StackNavigator;