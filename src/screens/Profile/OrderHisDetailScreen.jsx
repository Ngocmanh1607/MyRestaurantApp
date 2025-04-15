import { Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import styles from '../../assets/css/OrderDetailStyle';
import formatPrice from '../../utils/formatPrice';
import formatTime from '../../utils/formatTime';
const OrderHisDetailScreen = ({ route }) => {
  const { item, shipper } = route.params;
  const items = item.listCartItem;
  return (
    <ScrollView style={styles.container}>
      {/* Order ID */}
      <View style={styles.orderIdContainer}>
        <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
        <Text style={styles.orderTime}>{formatTime(item.order_date)}</Text>
      </View>
      {/* Driver Information */}
      {shipper && (
        <View style={styles.driverInfoContainer}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.car_name}>
              {shipper.car_name} - {shipper.license_plate}
            </Text>
          </View>
          <View style={styles.driverDetails}>
            {shipper.image ? (
              <Image
                source={{ uri: shipper.image }}
                style={styles.driverImage}
              />
            ) : (
              <Image
                source={require('../../assets/Images/Shipper.webp')}
                style={styles.driverImage}
              />
            )}
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{shipper.name}</Text>
              <Text style={styles.driverName}>{shipper.phone_number}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Ordered Items */}
      {items.map((item, index) => (
        <View key={index} style={styles.orderItemContainer}>
          <View style={styles.orderItemDetails}>
            <Image source={{ uri: item.image }} style={styles.orderItemImage} />
            <View style={styles.orderItemText}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              {item.toppings &&
                item.toppings.length > 0 &&
                item.toppings.map((topping, toppingIndex) => (
                  <Text key={toppingIndex} style={styles.orderItemOption}>
                    {topping.topping_name}
                  </Text>
                ))}
              <Text style={styles.orderItemQuantity}>
                Số lượng: {item.quantity}
              </Text>
              <Text style={styles.orderInfPayText}>
                {formatPrice(item.quantity * item.price)}
              </Text>
            </View>
          </View>
        </View>
      ))}
      {/* Note */}
      {item.note && (
        <View style={styles.noteContainer}>
          <Text>Ghi chú: {item.note}</Text>
        </View>
      )}
      {/* Payment Information */}
      <View style={styles.paymentInfoContainer}>
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethod}>
            Trả qua: {formatPrice(item.order_pay)}
          </Text>
          <Text style={styles.orderTotal}>{formatPrice(item.price)}</Text>
        </View>

        {/* <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>Chi tiết thanh toán</Text> */}
        {/* Tạm tính */}
        {/* <View style={[styles.paymentContainer, { marginTop: 10 }]}>
                    <Text style={styles.paymentText}>Tạm tính</Text>
                    <Text style={styles.paymentText}></Text>
                </View> */}
        {/* Giảm giá */}
        {/* <View style={styles.paymentContainer}>
                    <Text style={styles.paymentText}>Giảm giá</Text>
                    <Text style={styles.paymentText}>21000 đ</Text>
                </View> */}
        {/* Tổng thu */}
        <View style={styles.paymentSumContainer}>
          <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>
            Tổng tính
          </Text>
          <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>
            {formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderHisDetailScreen;
