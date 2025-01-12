import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { changeOrderStatus, findDriver, getInformationRes} from '../../api/restaurantApi';
import { formatTime } from '../../utils/utilsRestaurant';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const reasonsList = [
        "Khách hàng không phản hồi",
        "Hết hàng",
        "Sai thông tin đơn hàng",
        "Khách hàng từ chối nhận hàng",
        "Khác"
    ];
    const [restaurantId, setRestaurantId] = useState();
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
        const fetchResId = async () => {
            await getInformationRes();
        }
        fetchResId();
    }, [])
    const fetchOrders = (orders) => {
        const newOrders = orders.filter(order => order.order_status === 'ORDER_UNPAID' || order.order_status === 'PAID');
        const inProgressOrders = orders.filter(order => order.order_status === 'PREPARING_ORDER' || order.order_status === 'ORDER_RECEIVED' || order.order_status === 'DELIVERING');
        const completedOrders = orders.filter(order => order.order_status === 'ORDER_CONFIRMED' || order.order_status === 'ORDER_CANCELED');

        setOrdersNew(newOrders);
        setOrderInProgress(inProgressOrders);
        setOrderCompleted(completedOrders);
    };
    useEffect(() => {
        const fetchInfRes = async () => {
            await getInformationRes();
        };

        fetchInfRes();

        let socket;
        const initializeSocket = async () => {
            const restaurant_id = await AsyncStorage.getItem('restaurantId');
            setRestaurantId(restaurant_id);
            if (!restaurantId) {
                return;
            }
            console.log("Restaurant ID:", restaurantId);

            socket = io('https://lh30mlhb-3000.asse.devtunnels.ms');

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
                fetchOrders(data.orders);
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
    }, [restaurantId, ordersNew]);

    const handleAcceptOrder = (id) => {
        setIsLoading(true);
        const updateOrderStatus = async () => {
            try {
                await findDriver(id);
                const acceptedOrder = ordersNew.find(order => order.id === id);
                if (acceptedOrder) {
                    acceptedOrder.order_status = 'PREPARING_ORDER';
                    setOrdersNew(ordersNew.filter(order => order.id !== id));
                    setOrderInProgress([...ordersInProgress, acceptedOrder]);
                }
            } catch (error) {
                Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng!");
            } finally {
                setIsLoading(false);
            }
        };
        updateOrderStatus();
    };

    const handleCancelOrder = (id) => {
        setSelectedOrderId(id);
        setIsReasonModalVisible(true);
    };
    const submitCancelOrder = async () => {
        setIsLoading(true);
        try {
            await changeOrderStatus(selectedOrderId, 'ORDER_CANCELED');
            // Tìm đơn hàng bị hủy
            const canceledOrder =
                ordersNew.find(order => order.id === selectedOrderId) ||
                ordersInProgress.find(order => order.id === selectedOrderId);
            if (canceledOrder) {
                // Cập nhật trạng thái đơn hàng
                canceledOrder.order_status = 'ORDER_CANCELED';
                // Xóa đơn hàng khỏi danh sách hiện tại
                setOrdersNew(ordersNew.filter(order => order.id !== selectedOrderId));
                setOrderInProgress(ordersInProgress.filter(order => order.id !== selectedOrderId));
                // Thêm đơn hàng vào danh sách đã xong
                setOrderCompleted([...ordersCompleted, canceledOrder]);
            }
            Alert.alert('Thành công', 'Đơn hàng đã bị hủy!');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể hủy đơn hàng!');
        } finally {
            setIsLoading(false);
            setIsReasonModalVisible(false);
        }
    };
    console.log(ordersNew)
    return (
        <View style={styles.container}>
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
                        <Text style={styles.modalTitle}>Chọn lý do từ chối</Text>
                        <FlatList
                            data={reasonsList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={styles.reasonOption}
                                    onPress={() => {
                                        submitCancelOrder(index);
                                        console.log(index);
                                        setIsReasonModalVisible(false);
                                        setIsLoading(false);
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
        </View>
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
        backgroundColor: '#28a745',
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
    reasonOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    reasonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default OrderManagementScreen;