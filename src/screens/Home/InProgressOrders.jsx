import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../store/orderSlice';
import CardOrder from '../../components/CardOrder';

const InProgressOrders = () => {
  const orders = useSelector((state) => state.orders.data);
  const inProgressOrders = orders.filter(
    (order) =>
      order.order_status === 'PREPARING_ORDER' ||
      order.order_status === 'DELIVERING' ||
      order.order_status === 'GIVED ORDER' ||
      order.order_status === 'ORDER_RECEIVED'
  );

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      {inProgressOrders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>
            Chưa có đơn hàng đang xử lý
          </Text>
        </View>
      ) : (
        <FlatList
          data={inProgressOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardOrder item={item} />}
        />
      )}
    </View>
  );
};

export default InProgressOrders;
