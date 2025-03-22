import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import CardOrder from '../../components/CardOrder';

const CompletedOrders = () => {
  const orders = useSelector(state => state.orders.data);
  const completedOrders = orders.filter(order => order.order_status === 'ORDER_CONFIRMED' || order.order_status === 'ORDER_CANCELED');

  return (
    <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
      {
        completedOrders.length === 0 ? (
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>Chưa có đơn hàng hoàn tất</Text>
        ) : (
          <FlatList
            data={completedOrders}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <CardOrder item={item} />
            )}
          />
        )
      }
    </View>
  );
};

export default CompletedOrders;