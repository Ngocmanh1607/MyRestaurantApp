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
import { styles } from '../assets/css/CardOrderStyle';
import formatTime from '../utils/formatTime';
import { useDispatch } from 'react-redux';
import { updateStatus } from '../store/orderSlice';
import { io } from 'socket.io-client';
import { changeOrderStatus } from '../api/restaurantApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      await changeOrderStatus(item.id, 'ORDER_CANCELED');
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
  const getStatusInfo = (status) => {
    switch (status) {
      case 'PAID':
        return {
          color: '#FF6347',
          text: 'Đơn hàng mới',
          icon: 'bell-ring',
        };
      case 'PREPARING_ORDER':
        return {
          color: '#FF9800',
          text: 'Đang chuẩn bị',
          icon: 'food-variant',
        };
      case 'ORDER_CANCELED':
        return {
          color: '#FF0000',
          text: 'Đơn bị hủy',
          icon: 'close-circle',
        };
      case 'DELIVERING':
        return {
          color: '#2196F3',
          text: 'Shipper đang lấy đơn',
          icon: 'motorbike',
        };
      case 'GIVED ORDER':
      case 'ORDER_RECEIVED':
        return {
          color: '#9C27B0',
          text: 'Đã giao cho shipper',
          icon: 'package-variant',
        };
      case 'ORDER_CONFIRMED':
        return {
          color: '#28a745',
          text: 'Đã giao xong',
          icon: 'check-circle',
        };
      default:
        return {
          color: '#607D8B',
          text: 'Không xác định',
          icon: 'information',
        };
    }
  };

  const { color, text, icon } = getStatusInfo(item.order_status);

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() =>
            navigation.navigate('Chi tiết đơn hàng', { item, shipper })
          }
          activeOpacity={0.7}>
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderIdContainer}>
              <Icon
                name="receipt"
                size={20}
                color="#333"
                style={styles.headerIcon}
              />
              <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            </View>
            {item.order_status && (
              <View
                style={[
                  styles.statusContainer,
                  { backgroundColor: `${color}20` },
                ]}>
                <Icon
                  name={icon}
                  size={16}
                  color={color}
                  style={styles.statusIcon}
                />
                <Text style={[styles.statusText, { color: color }]}>
                  {text}
                </Text>
              </View>
            )}
          </View>

          {/* Order Details */}
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Icon
                name="clock-outline"
                size={18}
                color="#6c757d"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Thời gian:</Text>
              <Text style={styles.infoValue}>{formatTime(item.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon
                name="account"
                size={18}
                color="#6c757d"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Người đặt:</Text>
              <Text style={styles.infoValue}>{item.receiver_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon
                name="food"
                size={18}
                color="#6c757d"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Số món:</Text>
              <Text style={styles.infoValue}>
                {item.listCartItem.length} món
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon
                name="cash"
                size={18}
                color="#6c757d"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Tổng tiền:</Text>
              <Text style={styles.priceValue}>{formatPrice(item.price)} đ</Text>
            </View>

            <View style={styles.addressRow}>
              <Icon
                name="map-marker"
                size={18}
                color="#6c757d"
                style={[
                  styles.infoIcon,
                  { alignSelf: 'flex-start', marginTop: 3 },
                ]}
              />
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text
                style={styles.addressValue}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.address_receiver}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          {item.payment_method && (
            <View style={styles.paymentContainer}>
              <Icon
                name={item.payment_method === 'CASH' ? 'cash' : 'credit-card'}
                size={16}
                color="#555"
              />
              <Text style={styles.paymentText}>
                {item.payment_method === 'CASH'
                  ? 'Thanh toán tiền mặt'
                  : 'Thanh toán online'}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          {item.order_status === 'PAID' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptOrder(item.id)}>
                <Icon
                  name="check"
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Nhận đơn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item.id)}>
                <Icon
                  name="close"
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Huỷ đơn</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* View Details Hint */}
          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
            <Icon name="chevron-right" size={20} color="#2196F3" />
          </View>
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
            <View style={styles.modalHeader}>
              <Icon
                name="alert-circle"
                size={24}
                color="#FF6347"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.modalTitle}>Chọn lý do từ chối</Text>
            </View>

            <FlatList
              data={reasonsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.reasonOption}
                  onPress={() => {
                    submitCancelOrder();
                    setIsReasonModalVisible(false);
                  }}>
                  <Icon
                    name="checkbox-blank-circle-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.reasonText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsReasonModalVisible(false)}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  submitCancelOrder();
                  setIsReasonModalVisible(false);
                }}>
                <Text style={styles.modalConfirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Enhanced styles

export default CardOrder;
