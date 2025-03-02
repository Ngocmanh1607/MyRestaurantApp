import { Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {findDriver } from '../../api/restaurantApi';
import styles from '../access/css/CardOrderStyle';
import formatTime from '../utils/formatTime';

const CardOrder = ({ item }) => {
    const navigation = useNavigation();
    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const reasonsList = [
        "Khách hàng không phản hồi",
        "Hết hàng",
        "Sai thông tin đơn hàng",
        "Khách hàng từ chối nhận hàng",
        "Khác"
    ];
    const handleCancelOrder = (id) => {
        setSelectedOrderId(id);
        setIsReasonModalVisible(true);
    };

    const handleAcceptOrder = (id) => {
        const updateOrderStatus = async () => {
            try {
                await findDriver(id);
                // const acceptedOrder = ordersNew.find(order => order.id === id);
                // if (acceptedOrder) {
                //     acceptedOrder.order_status = 'PREPARING_ORDER';
                //     setOrdersNew(ordersNew.filter(order => order.id !== id));
                //     setOrderInProgress([...ordersInProgress, acceptedOrder]);
                // }
            } catch (error) {
                Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng!");
            } finally {
                // setIsLoading(false);
            }
        };
        updateOrderStatus();
    };
    return (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('Chi tiết đơn hàng', { item })}
        >
            <View style={styles.orderInfo}>
                <View style={styles.orderInfoContainer}>
                    <Text style={styles.orderId}>Đơn hàng số {item.id}-{formatTime(item.createdAt)}</Text>
                    {item.order_status === "PREPARING_ORDER" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={styles.textOrderPro}>Đang chuẩn bị</Text>
                        </View>
                    )}

                    {item.order_status === "ORDER_CANCELED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textOrderPro, { color: '#FF0000' }]}>Đơn bị hủy</Text>
                        </View>
                    )}

                    {item.order_status === "DELIVERING" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={styles.textOrderPro}>Shipper đang lấy đơn</Text>
                        </View>
                    )}
                    {item.order_status === "ORDER_RECEIVED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textOrderPro]}>Đã giao cho shipper</Text>
                        </View>
                    )}
                    {item.order_status === "ORDER_CONFIRMED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textOrderPro, { color: "#28a745" }]}>Đã giao xong</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.orderName}>{item.receiver_name}</Text>
                <Text style={styles.orderItems}>{item.listCartItem.length} món</Text>
                <Text style={styles.orderAddress}>{item.address_receiver}</Text>
            </View>
            {item.order_status === "PAID" && (
                <View style={styles.orderBtnContainer}>
                    <TouchableOpacity
                        style={styles.confirmOrder}
                        onPress={() => handleAcceptOrder(item.id)}
                    >
                        <Text style={styles.textOrderPro}>Nhận đơn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelOrder}
                        onPress={() => handleCancelOrder(item.id)}
                    >
                        <Text style={styles.textOrderPro} >Huỷ đơn</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    )
}

export default CardOrder;