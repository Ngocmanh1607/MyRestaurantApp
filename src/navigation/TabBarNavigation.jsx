import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderManagementScreen from '../screens/Home/OrderManagementScreen';
import FoodManagementScreen from '../screens/Menu/FoodManagementScreen';
import RestaurantProfileScreen from '../screens/Profile/RestaurantScreen';
import StatisticScreen from '../screens/Statistic/StatisticScreen';
import Test from '../screens/Home/test';

const Tab = createBottomTabNavigator();

function TabBarNavigation() {
    const renderIcon = (route, color) => {
        let iconName;
        if (route.name === 'Quản lý món ăn') {
            iconName = 'fast-food';
        } else if (route.name === 'Đơn Hàng') {
            iconName = 'receipt';
        } else if (route.name === 'Thống kê') {
            iconName = 'bar-chart-outline';
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
                tabBarActiveTintColor: '#f00',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            {/* <Tab.Screen name="Đơn Hàng" component={OrderManagementScreen} /> */}
            <Tab.Screen name="Đơn Hàng" component={Test} />
            <Tab.Screen name="Quản lý món ăn" component={FoodManagementScreen} />
            <Tab.Screen name="Thống kê" component={StatisticScreen} />
            <Tab.Screen name="Hồ Sơ" component={RestaurantProfileScreen}/>
        </Tab.Navigator>
    );
}

export default TabBarNavigation;