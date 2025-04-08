import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { findDriver } from '../api/restaurantApi';
import styles from '../assets/css/CardOrderStyle';
import formatTime from '../utils/formatTime';
import { useDispatch } from 'react-redux';
import { updateStatus } from '../store/orderSlice';
import { io } from 'socket.io-client';

const CardOrder = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
  const [shipper, setShipper] = useState(null);
  const reasonsList = [
    'Khách hàng không phản hồi',
    'Hết hàng',
    'Sai thông tin đơn hàng',
    'Khách hàng từ chối nhận hàng',
    'Khác',
  ];
  const handleCancelOrder = () => {
    setIsReasonModalVisible(true);
  };
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.emit('joinOrder', item.id);
    socket.on('orderStatusUpdate', ({ orderId, status, detailDriver }) => {
      console.log(status);
      dispatch(updateStatus({ id: item.id, status: status }));
      setShipper(detailDriver);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleAcceptOrder = (id) => {
    const updateOrderStatus = async () => {
      try {
        setIsLoading(true);
        await findDriver(id);
        dispatch(updateStatus({ id, status: 'PREPARING_ORDER' }));
      } catch (error) {
        console.log(error.message);
        Alert.alert('Lỗi', 'Không thể chấp nhận đơn hàng!');
      } finally {
        setIsLoading(false);
      }
    };
    updateOrderStatus();
  };
  const submitCancelOrder = async () => {
    try {
      setIsLoading(true);
      // await changeOrderStatus(item.id, 'ORDER_CANCELED');
      item.order_status = 'ORDER_CANCELED';
      dispatch(updateStatus({ id: item.id, status: 'ORDER_CANCELED' }));
      Alert.alert('Thành công', 'Đơn hàng đã bị hủy!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng!');
    } finally {
      setIsReasonModalVisible(false);
      setIsLoading(false);
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ORDER_CANCELED':
        return { color: '#FF0000' };
      case 'ORDER_CONFIRMED':
        return { color: '#28a745' };
      default:
        return { color: '#FF6347' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PREPARING_ORDER':
        return 'Đang chuẩn bị';
      case 'ORDER_CANCELED':
        return 'Đơn bị hủy';
      case 'DELIVERING':
        return 'Shipper đang lấy đơn';
      case 'GIVED ORDER':
      case 'ORDER_RECEIVED':
        return 'Đã giao cho shipper';
      case 'ORDER_CONFIRMED':
        return 'Đã giao xong';
      default:
        return '';
    }
  };
  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() =>
            navigation.navigate('Chi tiết đơn hàng', { item, shipper })
          }>
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Đơn hàng số {item.id}</Text>
            {item.order_status && (
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.statusText,
                    getStatusStyle(item.order_status),
                  ]}>
                  {getStatusText(item.order_status)}
                </Text>
              </View>
            )}
          </View>

          {/* Order Details */}
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thời gian:</Text>
              <Text style={styles.infoValue}>{formatTime(item.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Người đặt:</Text>
              <Text style={styles.infoValue}>{item.receiver_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số món:</Text>
              <Text style={styles.infoValue}>
                {item.listCartItem.length} món
              </Text>
            </View>

            <View style={styles.addressRow}>
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text
                style={styles.addressValue}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.address_receiver}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {item.order_status === 'PAID' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptOrder(item.id)}>
                <Text style={styles.buttonText}>Nhận đơn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item.id)}>
                <Text style={styles.buttonText}>Huỷ đơn</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Reason Modal */}
      <Modal
        transparent={true}
        visible={isReasonModalVisible}
        animationType="slide"
        onRequestClose={() => setIsReasonModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn lý do từ chối</Text>
            <FlatList
              data={reasonsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.reasonOption}
                  onPress={() => {
                    submitCancelOrder(item.id);
                    setIsReasonModalVisible(false);
                  }}>
                  <Text style={styles.reasonText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsReasonModalVisible(false)}>
              <Text style={styles.closeButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CardOrder;
