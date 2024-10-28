import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoodManagementScreen from '../screens/FoodManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import RestaurantProfileScreen from '../screens/RestaurantScreen';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function TabBarNavigation({ handleLogout }) {
    const renderHeader = () => {
        return (
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        )
    }
    const renderIcon = (route, color) => {
        let iconName;
        if (route.name === 'Quản lý món ăn') {
            iconName = 'fast-food';
        } else if (route.name === 'Đơn Hàng') {
            iconName = 'receipt';
        } else if (route.name === 'Thêm Món') {
            iconName = 'add-circle-outline';
        } else if (route.name === 'Hồ Sơ') {
            iconName = 'person';
        }
        return <Ionicons name={iconName} size={24} color={color} />;
    }
    return (
        <Tab.Navigator
            initialRouteName="Menu"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) =>
                    renderIcon(route, color)
                ,
                tabBarActiveTintColor: '#2e64e5',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Đơn Hàng" component={OrderManagementScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Quản lý món ăn" component={FoodManagementScreen} />
            <Tab.Screen name="Thêm Món" component={AddFoodScreen} />
            <Tab.Screen name="Hồ Sơ" component={RestaurantProfileScreen}
                options={() => ({
                    headerRight: () => (
                        renderHeader()
                    ),
                })}
            />
        </Tab.Navigator>
    );
}

export default TabBarNavigation;

const styles = StyleSheet.create({
    logoutButton: {
        marginRight: 15,
    },
    logoutText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '500',
    },
});