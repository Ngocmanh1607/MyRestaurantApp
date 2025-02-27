import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const CompletedOrders = () => {
  const orders = useSelector(state => state.orders.data); 
  const completedOrders = orders.filter(order => order.status === "completed");

  return (
    <View>
      <FlatList
        data={completedOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CompletedOrders;