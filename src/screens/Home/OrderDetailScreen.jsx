import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import styles from '../../assets/css/OrderDetailStyle';
import formatPrice from '../../utils/formatPrice';
import formatTime from '../../utils/formatTime';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OrderDetailScreen = ({ route, navigation }) => {
  const { item, shipper } = route.params;
  const items = item.listCartItem;

  const callDriver = () => {
    if (shipper && shipper.Profile.phone_number) {
      Linking.openURL(`tel:${shipper.Profile.phone_number}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return '#4CAF50'; // Green
      case 'UNPAID':
        return '#757575'; // Gray
      case 'PREPARING_ORDER':
        return '#FF9800'; // Orange
      case 'ORDER_CANCELED':
        return '#F44336'; // Red
      case 'ORDER_RECEIVED':
        return '#2196F3'; // Blue
      case 'DELIVERING':
        return '#03A9F4'; // Light Blue
      case 'ORDER_CONFIRMED':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'PREPARING_ORDER':
        return 'Đang chuẩn bị';
      case 'ORDER_CANCELED':
        return 'Đã hủy';
      case 'ORDER_RECEIVED':
        return 'Đã nhận đơn';
      case 'DELIVERING':
        return 'Đang giao hàng';
      case 'ORDER_CONFIRMED':
        return 'Đã xác nhận';
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Order Status */}
      <View
        style={[
          styles.statusContainer,
          { backgroundColor: getStatusColor(item.order_status) },
        ]}>
        <Text style={styles.statusText}>
          {getStatusText(item.order_status)}
        </Text>
      </View>

      {/* Order ID and Customer Info */}
      <View style={styles.orderInfo}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
          <Text style={styles.orderTime}>{formatTime(item.order_date)}</Text>
        </View>

        <View style={styles.orderUser}>
          <View style={styles.customerInfoContainer}>
            <MaterialIcons
              name="person"
              size={18}
              color="#555"
              style={styles.icon}
            />
            <Text style={styles.orderId}>
              Người nhận: {item.receiver_name || 'N/A'}
            </Text>
          </View>

          <TouchableOpacity
            // onPress={callCustomer}
            style={styles.phoneContainer}>
            <FontAwesome
              name="phone"
              size={18}
              color="#4CAF50"
              style={styles.icon}
            />
            <Text style={styles.orderTime}>{item.phone_number || 'N/A'}</Text>
          </TouchableOpacity>
        </View>

        {item.address_receiver && (
          <View style={styles.addressContainer}>
            <MaterialIcons
              name="location-on"
              size={18}
              color="#FF5722"
              style={styles.icon}
            />
            <Text style={styles.addressText}>{item.address_receiver}</Text>
          </View>
        )}
      </View>

      {/* Driver Information */}
      {shipper && (
        <View style={styles.driverInfoContainer}>
          <Text style={styles.sectionTitle}>Thông tin người giao hàng</Text>
          <View style={styles.vehicleInfo}>
            <MaterialIcons name="directions-car" size={18} color="#555" />
            <Text style={styles.car_name}>
              {shipper.car_name} - {shipper.license_plate}
            </Text>
          </View>
          <View style={styles.driverDetails}>
            <Image
              source={
                shipper.Profile.image
                  ? { uri: shipper.Profile.image }
                  : require('../../assets/Images/Shipper.webp')
              }
              style={styles.driverImage}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{shipper.Profile.name}</Text>
              <Text style={styles.driverPhone}>
                {shipper.Profile.phone_number}
              </Text>
              <TouchableOpacity style={styles.callButton} onPress={callDriver}>
                <FontAwesome name="phone" size={16} color="#fff" />
                <Text style={styles.callButtonText}>Gọi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Ordered Items Section */}
      <View style={styles.orderedItemsSection}>
        <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.orderItemContainer}>
            <View style={styles.orderItemDetails}>
              <Image
                source={{ uri: item.image }}
                style={styles.orderItemImage}
              />
              <View style={styles.orderItemText}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                {item.toppings &&
                  item.toppings.length > 0 &&
                  item.toppings.map((topping, toppingIndex) => (
                    <Text key={toppingIndex} style={styles.orderItemOption}>
                      + {topping.topping_name}
                    </Text>
                  ))}
                <View style={styles.quantityPriceRow}>
                  <Text style={styles.orderItemQuantity}>
                    SL: {item.quantity}
                  </Text>
                  <Text style={styles.orderInfPayText}>
                    {formatPrice(item.quantity * item.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Note */}
      {item.note && (
        <View style={styles.noteContainer}>
          <MaterialIcons name="note" size={18} color="#555" />
          <Text style={styles.noteText}>Ghi chú: {item.note}</Text>
        </View>
      )}

      {/* Payment Information */}
      <View style={styles.paymentInfoContainer}>
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>

        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentDetailLabel}>Phương thức thanh toán</Text>
          <Text style={styles.paymentDetailValue}>{item.order_pay}</Text>
        </View>

        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentDetailLabel}>Tạm tính</Text>
          <Text style={styles.paymentDetailValue}>
            {formatPrice(
              parseFloat(item.price) - parseFloat(item.delivery_fee)
            )}
          </Text>
        </View>

        <View style={styles.paymentDetailRow}>
          <Text style={styles.paymentDetailLabel}>Phí giao hàng</Text>
          <Text style={styles.paymentDetailValue}>
            {formatPrice(item.delivery_fee)}
          </Text>
        </View>

        <View style={styles.paymentSumContainer}>
          <Text style={styles.paymentTotalLabel}>Tổng cộng</Text>
          <Text style={styles.paymentTotalValue}>
            {formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderDetailScreen;
