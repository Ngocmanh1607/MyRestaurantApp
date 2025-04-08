import { Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/css/CardOrderStyle';
import formatTime from '../utils/formatTime';
import { getInfoDriver } from '../api/driverApi';
import { ActivityIndicator } from 'react-native-paper';
const CardOrderInHistory = ({ item }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const getInfo = async () => {
    setIsLoading(true);
    const response = await getInfoDriver(item.driver_id);
    setIsLoading(false);
    if (!response.success) {
      Alert.alert('Đã xảy ra lỗi', response.message);
    }
    return response.data;
  };

  const handlePress = async () => {
    const shipper = await getInfo();
    navigation.navigate('OrderHisDetail', { item, shipper });
  };
  return isLoading ? (
    <Modal transparent={true}>
      <View style={styles.modalBackground}>
        <ActivityIndicator size="small" color="#f00" />
      </View>
    </Modal>
  ) : (
    <TouchableOpacity style={styles.orderItem} onPress={() => handlePress()}>
      <View style={styles.orderInfo}>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderId}>Đơn hàng số {item.id}</Text>
          {item.order_status === 'PAID' && (
            <View style={styles.orderBtnContainer}>
              <Text style={[styles.textStatus, { color: '#FF0000' }]}>
                Đơn hàng mới
              </Text>
            </View>
          )}
          {item.order_status === 'PREPARING_ORDER' && (
            <View style={styles.orderBtnContainer}>
              <Text style={styles.textStatus}>Đang chuẩn bị</Text>
            </View>
          )}
          {item.order_status === 'PREPARING_ORDER' && (
            <View style={styles.orderBtnContainer}>
              <Text style={styles.textStatus}>Đang chuẩn bị</Text>
            </View>
          )}
          {item.order_status === 'ORDER_CANCELED' && (
            <View style={styles.orderBtnContainer}>
              <Text style={[styles.textStatus, { color: '#FF0000' }]}>
                Đơn bị hủy
              </Text>
            </View>
          )}
          {item.order_status === 'DELIVERING' && (
            <View style={styles.orderBtnContainer}>
              <Text style={styles.textStatus}>Shipper đang lấy đơn</Text>
            </View>
          )}
          {item.order_status === 'GIVED ORDER' && (
            <View style={styles.orderBtnContainer}>
              <Text style={[styles.textStatus]}>Đã giao cho shipper</Text>
            </View>
          )}
          {item.order_status === 'ORDER_CONFIRMED' && (
            <View style={styles.orderBtnContainer}>
              <Text style={[styles.textStatus, { color: '#28a745' }]}>
                Đã giao xong
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.orderTime}>{formatTime(item.createdAt)}</Text>
        <Text style={styles.orderName}>Người đặt: {item.receiver_name}</Text>
        <Text style={styles.orderItems}>{item.listCartItem.length} món</Text>
        <Text
          style={styles.orderAddress}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.address_receiver}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardOrderInHistory;
