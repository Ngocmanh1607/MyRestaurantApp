import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getInformationRes } from '../../api/restaurantApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { setOrders, addOrder } from '../../store/orderSlice';
import CardOrder from '../../components/CardOrder';
const NewOrders = () => {
  const navigation = useNavigation();
  const [restaurantId, setRestaurantId] = useState();
  const orders = useSelector((state) => state.orders.data);
  const dispatch = useDispatch();
  const newOrders = orders.filter(
    (order) => order.order_status === 'UNPAID' || order.order_status === 'PAID'
  );
  useEffect(() => {
    const fetchInfRes = async () => {
      const response = await getInformationRes(navigation);
      if (!response.success) {
        if (
          response.message === 'jwt expired' ||
          response.message === 'invalid signature'
        ) {
          Alert.alert('Lỗi', 'Hết phiên làm việc. Vui lòng đăng nhập lại', [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                });
              },
            },
          ]);
          return;
        }
      }
    };
    fetchInfRes();

    // const socket = io('http://localhost:3000');
    const socket = io('https://sbr09801-3000.asse.devtunnels.ms');

    const initializeSocket = async () => {
      try {
        const restaurant_id = await AsyncStorage.getItem('restaurantId');
        setRestaurantId(restaurant_id);

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          socket.emit('joinRestaurant', restaurant_id);
        });

        socket.on('ordersListOfRestaurant', (orders) => {
          dispatch(setOrders(orders));
        });

        socket.on('orderReceivedByRestaurant', (data) => {
          console.log('New order received:', data.orders);
          dispatch(addOrder(data.orders));
        });

        socket.on('error', (error) => {
          console.error('Error from server:', error.message);
        });
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    // Cleanup function
    return () => {
      socket.off('connect');
      socket.off('ordersListOfRestaurant');
      socket.off('orderReceivedByRestaurant');
      socket.off('error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [restaurantId]);
  return (
    <View style={styles.container}>
      {newOrders.length === 0 ? (
        <View style={styles.containerEmpty}>
          <Text style={styles.emptyText}>Chưa có đơn hàng mới</Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={newOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardOrder item={item} />}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});
export default NewOrders;
