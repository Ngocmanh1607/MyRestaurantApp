import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FlatList, Switch } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const ordersNew = [
    { id: '1', name: 'Tung Thien', items: 5, address: 'Viettel Complex Building, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP. HCM', time: '0:59' },
    { id: '2', name: 'Thu Hoang', items: 1, address: 'Viettel Complex Building, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP. HCM', time: '0:59' },
];

const ordersInProgress = [
    { id: '3', name: 'Khanh Dinh', items: 3, address: 'Viettel Complex Building, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP. HCM', time: '0:45' },
];

const ordersCompleted = [
    { id: '4', name: 'Lam Anh', items: 3, address: 'Viettel Complex Building, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP. HCM', time: '0:00' },
];

const OrderManagementScreen = () => {
    const navigation = useNavigation()
    const [accept, setAccept] = useState()
    const [selectedTab, setSelectedTab] = useState('new'); // Tab đang được chọn

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
                    <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate('Chi tiết đơn hàng')}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderId}>Đơn hàng số {item.id}</Text>
                            <Text style={styles.orderName}>{item.name}</Text>
                            <Text style={styles.orderItems}>{item.items} món</Text>
                            <Text style={styles.orderAddress}>{item.address}</Text>
                        </View>
                        <View style={styles.orderTimeContainer}>
                            <Text style={styles.orderTime}>{item.time}</Text>
                        </View>
                    </TouchableOpacity>
                )} />
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
    orderTimeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    orderTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
    },
});

export default OrderManagementScreen;