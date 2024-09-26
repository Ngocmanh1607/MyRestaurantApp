import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OrderManagementScreen from '../screens/OrderManagementScreen';
import TabBarNavigation from './TabBarNavigation';
import EditFoodScreen from '../screens/EditFoodScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';

const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabBarNavigation} />
            <Stack.Screen name="Đơn Hàng" component={OrderManagementScreen} />
            <Stack.Screen name="Chỉnh sửa món ăn" component={EditFoodScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Chi tiết đơn hàng" component={OrderDetailScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
    )
}

export default StackNavigator