import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../store/orderSlice';

const NewOrders = () => {
  const orders = useSelector(state => state.orders.data);
  const dispatch = useDispatch();

  const newOrders = orders.filter(order => order.status === "new");

  return (
    <View>
      <FlatList
        data={newOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Chuyển sang Đang Làm" onPress={() => dispatch(updateOrderStatus({ id: item.id, newStatus: "inProgress" }))} />
          </View>
        )}
      />
    </View>
  );
};

export default NewOrders;