import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from '../../assets/css/OrderHisDetailStyle';
import formatPrice from '../../utils/formatPrice';
import formatTime from '../../utils/formatTime';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const OrderHisDetailScreen = ({ route }) => {
  const { item } = route.params;
  const items = item.listCartItem || [];

  // Calculate total discount from all coupons
  const calculateTotalDiscount = () => {
    if (!item.coupons || item.coupons.length === 0) return 0;

    let totalDiscount = 0;
    let subtotal = parseFloat(item.price) - parseFloat(item.delivery_fee);

    item.coupons.forEach((coupon) => {
      if (!coupon.coupon_name) return;

      if (coupon.discount_type === 'PERCENTAGE') {
        const discountAmount = (subtotal * coupon.discount_value) / 100;
        totalDiscount += discountAmount;
      } else if (coupon.discount_type === 'FIXED_AMOUNT') {
        totalDiscount += parseFloat(coupon.discount_value);
      }
    });

    return totalDiscount;
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
        return 'Đơn hàng mới';
      case 'UNPAID':
        return 'Đơn hàng mới';
      case 'PREPARING_ORDER':
        return 'Đang chuẩn bị';
      case 'ORDER_CANCELED':
        return 'Đơn bị hủy';
      case 'ORDER_RECEIVED':
        return 'Đã giao cho shipper';
      case 'DELIVERING':
        return 'Shipper đang lấy đơn';
      case 'ORDER_CONFIRMED':
        return 'Đã giao xong';
      case 'UNPAID':
        return 'Chưa thanh toán';
      default:
        return 'Không xác định';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Order Status and ID */}
      <View style={styles.orderIdContainer}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderId}>Mã đơn: #{item.order_id}</Text>
          <Text style={styles.orderTime}>
            {formatTime(item.order_created_at)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.order_status) },
          ]}>
          <Text style={styles.statusText}>
            {getStatusText(item.order_status)}
          </Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.customerInfoContainer}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="user-alt" size={16} color="#333" />
          <Text style={styles.sectionHeaderText}>Thông tin khách hàng</Text>
        </View>
        <View style={styles.customerDetails}>
          <Image
            source={{ uri: item.customer_image }}
            style={styles.customerImage}
            // defaultSource={require('../../assets/Images/default-avatar.png')}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.customerPhone}>{item.customer_phone}</Text>
          </View>
        </View>
      </View>
      {/* Delivery Address */}
      <View style={styles.addressContainer}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="location-on" size={16} color="#333" />
          <Text style={styles.sectionHeaderText}>Địa chỉ giao hàng</Text>
        </View>
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>{item.address_receiver}</Text>
        </View>
      </View>
      {item.driver_id && (
        <View style={styles.driverInfoContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="motorcycle" size={16} color="#333" />
            <Text style={styles.sectionHeaderText}>
              Thông tin người giao hàng
            </Text>
          </View>
          <View style={styles.driverDetails}>
            <Image
              source={
                item.driver_image
                  ? { uri: item.driver_image }
                  : require('../../assets/Images/Shipper.webp')
              }
              style={styles.driverImage}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {item.driver_name || 'Chưa phân công'}
              </Text>
              <Text style={styles.driverPhone}>
                {item.driver_phone || 'N/A'}
              </Text>
              {item.license_plate && (
                <View style={styles.vehicleInfo}>
                  <Text style={styles.licensePlate}>{item.license_plate}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Ordered Items */}
      <View style={styles.itemsContainer}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="restaurant" size={16} color="#333" />
          <Text style={styles.sectionHeaderText}>Các món đã đặt</Text>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.orderItemContainer}>
            <View style={styles.orderItemDetails}>
              <Image
                source={{ uri: item.image }}
                style={styles.orderItemImage}
                // defaultSource={require('../../assets/Images/food-placeholder.png')}
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
                  <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                  <Text style={styles.orderItemPrice}>
                    {formatPrice(item.price)}
                  </Text>
                </View>
                <Text style={styles.orderItemTotal}>
                  {formatPrice(item.quantity * item.price)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Note */}
      {item.note && item.note.trim() !== '' && (
        <View style={styles.noteContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="note" size={16} color="#333" />
            <Text style={styles.sectionHeaderText}>Ghi chú</Text>
          </View>
          <Text style={styles.noteText}>{item.note}</Text>
        </View>
      )}

      {/* Payment Information */}
      <View style={styles.paymentInfoContainer}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="payment" size={16} color="#333" />
          <Text style={styles.sectionHeaderText}>Chi tiết thanh toán</Text>
        </View>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Tạm tính món ăn</Text>
          <Text style={styles.paymentValue}>
            {formatPrice(
              parseFloat(item.price) -
                parseFloat(item.delivery_fee) +
                calculateTotalDiscount()
            )}
          </Text>
        </View>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Phí giao hàng</Text>
          <Text style={styles.paymentValue}>
            {formatPrice(item.delivery_fee)}
          </Text>
        </View>

        {/* Total discount summary if multiple coupons */}
        {item.coupons &&
          item.coupons.filter((c) => c.coupon_name).length > 1 && (
            <View style={[styles.paymentRow, styles.totalDiscountRow]}>
              <Text style={styles.paymentLabel}>Tổng giảm giá</Text>
              <Text
                style={[
                  styles.paymentValue,
                  { color: '#28a745', fontWeight: 'bold' },
                ]}>
                -{formatPrice(calculateTotalDiscount())}
              </Text>
            </View>
          )}

        {/* Show coupons if available */}
        {item.coupons &&
          item.coupons.length > 0 &&
          item.coupons.map(
            (coupon, index) =>
              coupon.coupon_name && (
                <View key={`coupon-${index}`} style={styles.paymentRow}>
                  <View style={styles.couponLabelContainer}>
                    <Text style={styles.paymentLabel}>
                      {coupon.coupon_name}
                    </Text>
                    <View style={styles.couponBadge}>
                      <Text style={styles.couponCode}>
                        {coupon.coupon_code}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.paymentValue, { color: '#28a745' }]}>
                    {coupon.discount_type === 'PERCENTAGE'
                      ? `-${coupon.discount_value}%`
                      : `-${formatPrice(coupon.discount_value || 0)}`}
                  </Text>
                </View>
              )
          )}

        <View style={styles.paymentSumContainer}>
          <Text style={styles.paymentTotalLabel}>Tổng cộng</Text>
          <Text style={styles.paymentTotalValue}>
            {formatPrice(item.price)}
          </Text>
        </View>

        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodLabel}>Phương thức thanh toán:</Text>
          <Text style={styles.paymentMethodValue}>
            {parseFloat(item.order_pay) > 0 ? 'Tiền mặt' : 'Thanh toán online'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderHisDetailScreen;
