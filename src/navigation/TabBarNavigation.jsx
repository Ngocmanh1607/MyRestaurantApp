import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoodManagementScreen from '../screens/Menu/FoodManagementScreen';
import StatisticScreen from '../screens/Statistic/StatisticScreen';
import OrderManagement from '../screens/Home/OrderManagement';
import AccountScreen from '../screens/Profile/AccountScreen';

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
    } else if (route.name === 'Tài khoản') {
      iconName = 'person';
    }
    return <Ionicons name={iconName} size={24} color={color} />;
  };
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => renderIcon(route, color),
        tabBarActiveTintColor: '#f00',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Đơn Hàng" component={OrderManagement} />
      <Tab.Screen name="Quản lý món ăn" component={FoodManagementScreen} />
      <Tab.Screen name="Thống kê" component={StatisticScreen} />
      <Tab.Screen name="Tài khoản" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default TabBarNavigation;
