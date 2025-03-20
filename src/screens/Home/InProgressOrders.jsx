import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../store/orderSlice';
import CardOrder from '../../components/CardOrder';

const InProgressOrders = () => {
  const orders = useSelector(state => state.orders.data);
  const inProgressOrders = orders.filter(order => order.order_status === 'PREPARING_ORDER' || order.order_status === 'ORDER_RECEIVED' || order.order_status === 'DELIVERING');

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <FlatList
        data={inProgressOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardOrder item={item} />
        )}
      />
    </View>
  );
};

export default InProgressOrders;