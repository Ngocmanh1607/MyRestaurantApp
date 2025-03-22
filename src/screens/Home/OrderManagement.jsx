import React from 'react';
import NewOrders from './NewOrders';
import InProgressOrders from './InProgressOrders';
import CompletedOrders from './CompletedOrders';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function OrderManagement() {
    return (
        <Tab.Navigator initialRouteName="Menu"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#f00',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
                tabBarIndicatorStyle: {
                    backgroundColor: '#f00',
                    height: 1,
                    width: '20%',
                    alignSelf: 'center',
                    left: '7%',
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                    elevation: 3,
                }
            })}>
            <Tab.Screen name="Đơn Mới" component={NewOrders} />
            <Tab.Screen name="Đang Làm" component={InProgressOrders} />
            <Tab.Screen name="Đã Xong" component={CompletedOrders} />
        </Tab.Navigator>
    );
}