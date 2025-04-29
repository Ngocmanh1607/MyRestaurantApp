import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getOrders } from '../../api/restaurantApi';
import { FlatList } from 'react-native-gesture-handler';
import CardOrderInHistory from '../../components/CardOrderInHistory';
const OrdersHistoryScreen = () => {
  const [orders, setOrders] = useState();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await getOrders();
        if (response.success) {
          setOrders(response.data);
          console.log('OrdersHistoryScreen', response.data);
        } else {
          if (res.message === 'jwt expired') {
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
          Alert.alert('Lỗi', res.message);
        }
      } catch (error) {}
    };
    getOrder();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={({ item }) => <CardOrderInHistory item={item} />}
      />
    </View>
  );
};

export default OrdersHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    marginHorizontal: 10,
  },
});
