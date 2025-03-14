import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import CardOrder from '../../components/CardOrder';
import styles from '../../access/css/OrderManagementStyle';

const CompletedOrders = () => {
  const orders = useSelector(state => state.orders.data); 
  const completedOrders = orders.filter(order => order.order_status === 'ORDER_CONFIRMED' || order.order_status === 'ORDER_CANCELED');

  return (
    <View style={{flex:1,marginHorizontal:10}}>
      <FlatList
        data={completedOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardOrder item={item}/>
        )}
      />
    </View>
  );
};

export default CompletedOrders;