import { Text, View, TouchableOpacity, Alert, Modal,FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {findDriver } from '../../api/restaurantApi';
import styles from '../access/css/CardOrderStyle';
import formatTime from '../utils/formatTime';
import { changeOrderStatus } from '../api/restaurantApi';
import { useDispatch } from 'react-redux';
import { updateStatus } from '../store/orderSlice';

const CardOrder = ({ item }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const reasonsList = [
        "Khách hàng không phản hồi",
        "Hết hàng",
        "Sai thông tin đơn hàng",
        "Khách hàng từ chối nhận hàng",
        "Khác"
    ];
    const handleCancelOrder = () => {
        setIsReasonModalVisible(true);
    };

    const handleAcceptOrder = (id) => {
        const updateOrderStatus = async () => {
            try {
                // await findDriver(id);
                dispatch(updateStatus({id,status: 'PREPARING_ORDER'}));
            } catch (error) {
                Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng!");
            } finally {
                // setIsLoading(false);
            }
        };
        updateOrderStatus();
    };
    const submitCancelOrder = async () => {
        try {
            // await changeOrderStatus(item.id, 'ORDER_CANCELED');
            // Tìm đơn hàng bị hủy
                item.order_status = 'ORDER_CANCELED';
                dispatch(updateStatus({id:item.id,status:'ORDER_CANCELED'}));
            Alert.alert('Thành công', 'Đơn hàng đã bị hủy!');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể hủy đơn hàng!');
        } finally {
            setIsReasonModalVisible(false);
        }
    };
    return (
        <>
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('Chi tiết đơn hàng', { item })}
        >
            <View style={styles.orderInfo}>
                <View style={styles.orderInfoContainer}>
                    <Text style={styles.orderId}>Đơn hàng số {item.id}-{formatTime(item.createdAt)}</Text>
                    {item.order_status === "PREPARING_ORDER" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={styles.textStatus}>Đang chuẩn bị</Text>
                        </View>
                    )}
                    {item.order_status === "ORDER_CANCELED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textStatus, { color: '#FF0000' }]}>Đơn bị hủy</Text>
                        </View>
                    )}
                    {item.order_status === "DELIVERING" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={styles.textStatus}>Shipper đang lấy đơn</Text>
                        </View>
                    )}
                    {item.order_status === "ORDER_RECEIVED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textStatus]}>Đã giao cho shipper</Text>
                        </View>
                    )}
                    {item.order_status === "ORDER_CONFIRMED" && (
                        <View style={styles.orderBtnContainer}>
                            <Text style={[styles.textStatus, { color: "#28a745" }]}>Đã giao xong</Text>
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
                                    }}
                                >
                                    <Text style={styles.reasonText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => setIsReasonModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={styles.modalButtonSubmit}
                                onPress={submitCancelOrder}
                            >
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
        
    )
}

export default CardOrder;