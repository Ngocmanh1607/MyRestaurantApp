import {  Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import styles from '../../access/css/OrderDetailStyle';
import formatPrice from '../../utils/formatPrice';
const OrderDetailScreen = ({ route }) => {
    const { item } = route.params;
    const items = item.listCartItem
    console.log('item', item)
    // Mock data for the order details
    const orderDetails = {
        driver: {
            name: 'Pham Trung Kien',
            rating: 5.0,
            vehicle: 'Yamaha | Nozza',
            licensePlate: '68T1-572.84',
            driverImage: 'https://link-to-driver-image.com/driver.jpg', // Replace with a real image
        },
        items: [
            {
                name: 'Mì Soyum bò Mỹ',
                price: 70000,
                quantity: 1,
                options: [
                    'Chọn cách chế biến I: Nấu Chín (Phí hộp đựng muỗng đũa)',
                    'Chọn cấp độ cay: Cấp 2',
                    'nhiều nước chấm muối ớt xanh'
                ],
                image: 'https://link-to-item-image.com/item1.jpg', // Replace with a real image
            },
            {
                name: 'Mì Kim chi bò Mỹ',
                price: 70000,
                quantity: 2,
                options: [
                    'Chọn cách chế biến I: Nấu Chín (Phí hộp đựng muỗng đũa)',
                    'Chọn cấp độ cay: Cấp 2'
                ],
                image: 'https://link-to-item-image.com/item2.jpg', // Replace with a real image
            },
        ],
        total: '93.000₫',
        paymentMethod: 'MoMo',
        orderId: '29270933',
        orderTime: '28/08/2024 | 19:20',
    };

    return (
        <ScrollView style={styles.container}>
            {/* Order ID */}
            <View style={styles.orderIdContainer}>
                <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
                <Text style={styles.orderTime}>{item.order_date}</Text>
            </View>
            {/* Driver Information */}
            {
                item.driver_id &&
                <View style={styles.driverInfoContainer}>
                    <Text style={styles.licensePlate}>{orderDetails.driver.licensePlate}</Text>
                    <Text>{orderDetails.driver.vehicle}</Text>
                    <View style={styles.driverDetails}>
                        <Image source={require('../../access/Images/Shipper.webp')} style={styles.driverImage} />
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>{orderDetails.driver.name}</Text>
                            <Text style={styles.driverRating}>⭐ {orderDetails.driver.rating}</Text>
                        </View>
                    </View>
                </View>
            }

            {/* Ordered Items */}
            {items.map((item, index) => (
                <View key={index} style={styles.orderItemContainer}>
                    <View style={styles.orderItemDetails}>
                        <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                        <View style={styles.orderItemText}>
                            <Text style={styles.orderItemName}>{item.name}</Text>
                            {
                                item.toppings && item.toppings.length > 0 &&
                                item.toppings.map((topping, toppingIndex) => (
                                    <Text key={toppingIndex} style={styles.orderItemOption}>
                                        {topping.topping_name}
                                    </Text>
                                ))
                            }
                        </View>
                    </View>
                    <View style={styles.orderInfPay}>
                        <Text style={styles.orderInfPayText}>Số lượng: {item.quantity}</Text>
                        <Text style={styles.orderInfPayText}>{formatPrice(item.quantity * item.price)}</Text>
                    </View>
                </View>
            ))}
            {/* Note */}
            {
                item.note && (
                    <View style={styles.noteContainer}>
                        <Text>Ghi chú: {item.note}</Text>
                    </View>)
            }
            {/* Payment Information */}
            <View style={styles.paymentInfoContainer}>
                <Text style={styles.paymentMethod}>Trả qua {item.order_pay}</Text>
                <Text style={styles.orderTotal}>{formatPrice(item.price)}</Text>
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
                    <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>Tổng tính</Text>
                    <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>{formatPrice(item.price)}</Text>
                </View>
            </View>

            {/* Complete Button */}
            {/* <TouchableOpacity style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Hoàn thành</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

export default OrderDetailScreen;