import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../store/orderSlice';

const InProgressOrders = () => {
  const orders = useSelector(state => state.orders.data); 
  const dispatch = useDispatch();

  const inProgressOrders = orders.filter(order => order.status === "inProgress");

  return (
    <View>
      <FlatList
        data={inProgressOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Hoàn thành" onPress={() => dispatch(updateOrderStatus({ id: item.id, newStatus: "completed" }))} />
          </View>
        )}
      />
    </View>
  );
};

export default InProgressOrders;