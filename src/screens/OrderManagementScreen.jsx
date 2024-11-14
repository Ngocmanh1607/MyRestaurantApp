import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Modal, ActivityIndicator } from 'react-native';
import { FlatList, Switch } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changeOrderStatus, findDriver, getOrderRes } from '../api/restaurantApi';
import { formatTime } from '../utils/utilsRestaurant';
import { useDispatch } from 'react-redux';

const OrderManagementScreen = () => {
    const [isloading, setIsLoading] = useState(false);
    const [ordersNew, setOrdersNew] = useState([]);
    const [ordersInProgress, setOrderInProgress] = useState([]);
    const [ordersCompleted, setOrderCompleted] = useState([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [accept, setAccept] = useState();
    const [selectedTab, setSelectedTab] = useState('new');

    //hàm chọn tab
    const selectTab = (tab) => {
        setSelectedTab(tab);
    }
    //Lựu chọn ds đơn hàng theo tab chọn
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
    }
    useEffect(() => {
        const fetchOrder = async () => {
            const response = await getOrderRes();
            // / Phân loại các đơn hàng dựa trên trạng thái
            const newOrders = response.filter(order => order.order_status === null);
            const inProgressOrders = response.filter(order => order.order_status === "ORDER_RECEIVED");
            const completedOrders = response.filter(order => order.order_status === "ORDER_COMPLETED");

            // Cập nhật state với danh sách đơn hàng tương ứng
            setOrdersNew(newOrders);
            setOrderInProgress(inProgressOrders);
            setOrderCompleted(completedOrders);
            // dispatch(setOrdersNew(response));
        }
        fetchOrder();
    }, [])
    const handleAcceptOrder = (id, status) => {
        setIsLoading(true)
        const fetchChangeStatus = async () => {
            try {
                await changeOrderStatus(id, status);
                const response = await findDriver(id);
                console.log(response)
                setOrdersNew((prevOrders) => prevOrders.filter((order) => order.id !== id));
                setOrderInProgress((prevOrders) =>
                    status === 'ORDER_RECEIVED'
                        ? [...prevOrders, { ...prevOrders.find(order => order.id === id), order_status: status }]
                        : prevOrders
                );
                setOrderCompleted((prevOrders) =>
                    status === 'ORDER_COMPLETED'
                        ? [...prevOrders, { ...prevOrders.find(order => order.id === id), order_status: status }]
                        : prevOrders
                );

            } catch (error) {
                console.error("Failed to update order status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChangeStatus();
        setIsLoading(false);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Đơn hàng</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>Nhận đơn</Text>
                    <Switch value={accept} onValueChange={setAccept} />
                </View>
            </View>
            {/* Tab Điều Hướng */}
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
            {/* Số đơn hàng */}
            {selectedTab === 'new' && (
                <View style={styles.orderCountContainer}>
                    <Text style={styles.orderCountText}>{ordersNew.length} đơn hàng mới!</Text>
                </View>
            )}
            <FlatList data={getOrderData()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate('Chi tiết đơn hàng', { item: item })}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderId}>Đơn hàng số {item.id}-{formatTime(item.createdAt)}</Text>
                            <Text style={styles.orderName}>{item.receiver_name}</Text>
                            <Text style={styles.orderItems}>{item.listCartItem.length} món</Text>
                            <Text style={styles.orderAddress}>{item.address_receiver}</Text>
                        </View>

                        {item.order_status == null && (
                            <View style={styles.orderBtnContainer}>
                                <TouchableOpacity style={styles.confirmOrder} onPress={() => handleAcceptOrder(item.id, 'ORDER_RECEIVED')}>
                                    <Text style={styles.textOrderPro}>Nhận đơn</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelOrder} onPress={() => handleAcceptOrder(item.id, 'ORDER_CANCELED')}>
                                    <Text>Huỷ đơn</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {
                            item.order_status == "ORDER_RECEIVED" && (
                                <TouchableOpacity>
                                    <Text style={styles.textComplete}>Hoàn thành</Text>
                                </TouchableOpacity>
                            )
                        }
                    </TouchableOpacity>
                )} />
            {/* Hiển thị loading overlay */}
            {isloading && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isloading}
                    onRequestClose={() => { }}
                >
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00ff00" />
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        height: 55,
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
    switchText: {
        marginRight: 8,
        color: '#333'
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10
    },
    activeTab: {
        fontWeight: 'bold',
        color: '#FF0000',
        borderBottomWidth: 2,
        borderBottomColor: '#FF0000'
    },
    inactiveTab: {
        color: '#A0A0A0',
    },
    orderCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    orderCountText: {
        color: '#333',
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        borderColor: '#ddd',
        borderWidth: 1
    },
    orderInfo: {
        flex: 1
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderItems: {
        color: '#333',
    },
    orderAddress: {
        fontSize: 14,
        color: '#A0A0A0',
    },
    orderBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00FF33',
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
    textComplete: {
        fontWeight: '500',
        color: '#00FF00'
    }
});

export default OrderManagementScreen;