import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changeOrderStatus, findDriver, getInformationRes, getOrderRes, rejectOrder } from '../api/restaurantApi';
import { formatTime } from '../utils/utilsRestaurant';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

const OrderManagementScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [ordersNew, setOrdersNew] = useState([]);
    const [ordersInProgress, setOrderInProgress] = useState([]);
    const [ordersCompleted, setOrderCompleted] = useState([]);
    const navigation = useNavigation();
    const [accept, setAccept] = useState();
    const [selectedTab, setSelectedTab] = useState('new');
    const [errorMessage, setErrorMessage] = useState(null);

    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reason, setReason] = useState('');

    let restaurantId;
    const getOrderData = () => {
        switch (selectedTab) {
            case 'new':
                return ordersNew;
            case 'inProgress':
                return ordersInProgress;
            case 'completed':
                return ordersCompleted;
            default:
                return ordersNew;
        }
    };
    const selectTab = (tab) => {
        setSelectedTab(tab);
    }
    useEffect(() => {
        const fetchOrders = (orders) => {
            const newOrders = orders.filter(order => order.order_status === 'ORDER_UNPAID' || order.order_status === 'PAID');
            const inProgressOrders = orders.filter(order => order.order_status === 'PREPARING_ORDER' || order.order_status === 'ORDER_RECEIVED' || order.order_status === 'DELIVERING');
            const completedOrders = orders.filter(order => order.order_status === 'ORDER_CONFIRMED' || order.order_status === 'ORDER_CANCELED');

            setOrdersNew(newOrders);
            setOrderInProgress(inProgressOrders);
            setOrderCompleted(completedOrders);
        };
        const fetchInfRes = async () => {
            await getInformationRes();
        };

        fetchInfRes();

        let socket;
        const initializeSocket = async () => {
            const storedRestaurantId = await AsyncStorage.getItem('restaurantId');
            if (!storedRestaurantId) {
                console.error("Không tìm thấy restaurantId trong AsyncStorage");
                return;
            }
            restaurantId = storedRestaurantId;
            console.log("Restaurant ID:", restaurantId);

            socket = io('http://localhost:3000');

            socket.on('connect', () => {
                console.log("Socket connected:", socket.id);
                socket.emit('joinRestaurant', restaurantId);
            });

            socket.on('ordersListOfRestaurant', (orders) => {
                console.log("Orders List Received:", orders);
                fetchOrders(orders);
            });

            socket.on('orderReceivedByRestaurant', (data) => {
                console.log("New Order Received:", data);
                fetchOrders(data);
            });

            socket.on('error', (error) => {
                console.error("Error from server:", error.message);
                setErrorMessage(error.message);
            });

            socket.on('disconnect', () => {
                console.log("Socket disconnected:", socket.id);
            });
        };

        initializeSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const handleAcceptOrder = (id) => {
        setIsLoading(true);
        const updateOrderStatus = async () => {
            await findDriver(id);
            setIsLoading(false);
        };

        updateOrderStatus();
    };
    const handleCancelOrder = (id) => {
        setSelectedOrderId(id);
        setIsReasonModalVisible(true);
    };

    const submitCancelOrder = async () => {
        if (reason.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối!');
            return;
        }
        setIsReasonModalVisible(false);
        setReason('');
        setIsLoading(true);
        try {
            await changeOrderStatus(selectedOrderId, 'ORDER_CANCELED', reason); // Gửi trạng thái hủy với lý do
            Alert.alert('Thành công', 'Đơn hàng đã bị hủy!');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể hủy đơn hàng!');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Đơn hàng</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>Nhận đơn</Text>
                    <Switch value={accept} onValueChange={setAccept} />
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => selectTab('new')}>
                    <Text style={selectedTab === 'new' ? styles.activeTab : styles.inactiveTab}>ĐƠN MỚI</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectTab('inProgress')}>
                    <Text style={selectedTab === 'inProgress' ? styles.activeTab : styles.inactiveTab}>ĐANG LÀM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectTab('completed')}>
                    <Text style={selectedTab === 'completed' ? styles.activeTab : styles.inactiveTab}>ĐÃ XONG</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isReasonModalVisible}
                animationType="slide"
                onRequestClose={() => setIsReasonModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lý do..."
                            value={reason}
                            onChangeText={setReason}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => setIsReasonModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonSubmit}
                                onPress={submitCancelOrder}
                            >
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={getOrderData()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
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
                                        <Text style={styles.textOrderPro}>Đơn bị hủy</Text>
                                    </View>
                                )}

                                {item.order_status === "DELIVERING" && (
                                    <View style={styles.orderBtnContainer}>
                                        <Text style={styles.textOrderPro}>Đang giao hàng</Text>
                                    </View>
                                )}

                                {item.order_status === "ORDER_CONFIRMED" && (
                                    <View style={styles.orderBtnContainer}>
                                        <Text style={[styles.textOrderPro, { color: "#33FF33" }]}>Đã giao xong</Text>
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
                                    <Text>Huỷ đơn</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />

            {isLoading && (
                <Modal transparent={true} animationType="fade" visible={isLoading}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF0000" />
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        height: 55
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: '#333',
        marginStart: 2
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    switchText: { marginRight: 8, color: '#333' },
    tabContainer: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10 },
    activeTab: { fontWeight: 'bold', color: '#FF0000', borderBottomWidth: 2, borderBottomColor: '#FF0000' },
    inactiveTab: { color: '#A0A0A0' },
    orderItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, marginVertical: 5, borderColor: '#ddd', borderWidth: 1 },
    orderInfo: { flex: 1 },
    orderInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    orderName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    orderItems: { color: '#333' },
    orderAddress: {
        fontSize: 14,
        color: '#A0A0A0'
    },
    orderBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#33CC00',
        padding: 8,
        borderRadius: 10,
        marginBottom: 10
    },
    cancelOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        backgroundColor: '#FF3333',
        padding: 8,
        borderRadius: 10,
        marginBottom: 5
    },
    textOrderPro: {
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonCancel: {
        flex: 1,
        backgroundColor: '#FF3333',
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 5,
        alignItems: 'center',
    },
    modalButtonSubmit: {
        flex: 1,
        backgroundColor: '#00CC66',
        paddingVertical: 10,
        borderRadius: 5,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },

});

export default OrderManagementScreen;
