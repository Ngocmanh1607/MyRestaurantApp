import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
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

  const orders = useSelector(state => state.orders.data);
  const dispatch = useDispatch();
  const newOrders = orders.filter(order => order.order_status === 'ORDER_UNPAID' || order.order_status === 'PAID');
  useEffect(() => {
    const fetchInfRes = async () => {
      await getInformationRes(navigation);
    };
    fetchInfRes();
    let socket;
    const initializeSocket = async () => {
      const restaurant_id = await AsyncStorage.getItem('restaurantId');
      setRestaurantId(restaurant_id);
      if (!restaurantId) {
        return;
      }
      console.log("Restaurant ID:", restaurantId);
      // socket = io('https://1b10dbz1-3000.asse.devtunnels.ms');
      socket = io('http://localhost:3000');

      socket.on('connect', () => {
        console.log("Socket connected:", socket.id);
        socket.emit('joinRestaurant', restaurantId);
      });

      socket.on('ordersListOfRestaurant', (orders) => {
        dispatch(setOrders(orders));
      });

      socket.on('orderReceivedByRestaurant', (data) => {
        dispatch(addOrder(data.orders));
      });

      socket.on('error', (error) => {
        console.error("Error from server:", error.message);
        // setErrorMessage(error.message);
      });

      socket.on('disconnect', () => {
        console.log("Socket disconnected:", socket.id);
      });
    };

    initializeSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [restaurantId]);
  return (
    <View>
      <FlatList
        style={styles.flatList}
        data={newOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardOrder item={item} />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  flatList: {
    marginHorizontal: 10,

  },
});
export default NewOrders;