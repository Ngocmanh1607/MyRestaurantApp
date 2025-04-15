import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import formatTime from '../utils/formatTime';
import { getInfoDriver } from '../api/driverApi';
import { styles } from '../assets/css/CardOrderHisStyle';
const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PAID':
        return {
          icon: 'bell-ring',
          color: '#FF0000',
          bgColor: '#FFEBEE',
          text: 'Đơn hàng mới',
        };
      case 'PREPARING_ORDER':
        return {
          icon: 'food-variant',
          color: '#FF9800',
          bgColor: '#FFF3E0',
          text: 'Đang chuẩn bị',
        };
      case 'ORDER_CANCELED':
        return {
          icon: 'close-circle',
          color: '#FF0000',
          bgColor: '#FFEBEE',
          text: 'Đơn bị hủy',
        };
      case 'DELIVERING':
        return {
          icon: 'motorbike',
          color: '#2196F3',
          bgColor: '#E3F2FD',
          text: 'Shipper đang lấy đơn',
        };
      case 'GIVED_ORDER':
      case 'GIVED ORDER':
        return {
          icon: 'package-variant',
          color: '#9C27B0',
          bgColor: '#F3E5F5',
          text: 'Đã giao cho shipper',
        };
      case 'ORDER_CONFIRMED':
        return {
          icon: 'check-circle',
          color: '#28a745',
          bgColor: '#E8F5E9',
          text: 'Đã giao xong',
        };
      default:
        return {
          icon: 'information',
          color: '#607D8B',
          bgColor: '#ECEFF1',
          text: status,
        };
    }
  };

  const { icon, color, bgColor, text } = getStatusConfig();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bgColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
      }}>
      <Icon name={icon} size={16} color={color} style={{ marginRight: 6 }} />
      <Text style={{ color, fontWeight: '600', fontSize: 13 }}>{text}</Text>
    </View>
  );
};

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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f44336" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </View>
    </Modal>
  ) : (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handlePress()}
      activeOpacity={0.7}>
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
        <StatusBadge status={item.order_status} />
      </View>

      <View style={styles.orderInfoRow}>
        <Icon
          name="clock-outline"
          size={18}
          color="#6c757d"
          style={styles.infoIcon}
        />
        <Text style={styles.orderTime}>{formatTime(item.createdAt)}</Text>
      </View>

      <View style={styles.orderInfoRow}>
        <Icon
          name="account"
          size={18}
          color="#6c757d"
          style={styles.infoIcon}
        />
        <Text style={styles.orderName}>{item.receiver_name}</Text>
      </View>

      <View style={styles.orderInfoRow}>
        <Icon name="food" size={18} color="#6c757d" style={styles.infoIcon} />
        <Text style={styles.orderItems}>{item.listCartItem.length} món</Text>
      </View>

      <View style={styles.orderInfoRow}>
        <Icon
          name="map-marker"
          size={18}
          color="#6c757d"
          style={styles.infoIcon}
        />
        <Text
          style={styles.orderAddress}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item.address_receiver}
        </Text>
      </View>

      <View style={styles.viewDetailContainer}>
        <Text style={styles.viewDetailText}>Xem chi tiết</Text>
        <Icon name="chevron-right" size={20} color="#2196F3" />
      </View>
    </TouchableOpacity>
  );
};
export default CardOrderInHistory;
