import { ActivityIndicator, View, Modal } from 'react-native';
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
import OrdersHistoryScreen from '../screens/Profile/OrdersHistoryScreen';
import OrderHisDetailScreen from '../screens/Profile/OrderHisDetailScreen';
import EditPriceScreen from '../screens/Menu/EditPricesScreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Retrieved token:', token);
        if (token) {
          setAccessToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to retrieve access token:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);
  if (loading) {
    return (
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <ActivityIndicator size="large" color="#f00" />
        </View>
      </Modal>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Auth'}
      screenOptions={{ headerShown: false }}>
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

      <Stack.Screen name="Home">{() => <TabBarNavigation />}</Stack.Screen>
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
        options={{
          headerShown: true,
          headerTitle: 'Đánh giá',
          headerBackTitle: 'Quay lại',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={RestaurantProfileScreen}
        options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: true, headerBackTitle: 'Quay lại', title: 'Ví' }}
      />
      <Stack.Screen
        name="OrdersHistory"
        component={OrdersHistoryScreen}
        options={{ headerShown: true, headerBackTitle: 'Quay lại', title: 'Đơn hàng' }}
      />
      <Stack.Screen
        name="OrderHisDetail"
        component={OrderHisDetailScreen}
        options={{
          headerShown: true,
          headerBackTitle: 'Quay lại',
          title: 'Chi tiết đơn hàng',
        }}
      />
      <Stack.Screen
        name="EditPrices"
        component={EditPriceScreen}
        options={{ headerShown: true, headerBackTitle: 'Quay lại' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
