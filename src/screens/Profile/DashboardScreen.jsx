import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DashboardScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Quản lý Nhà Hàng</Text>

            {/* Thông tin tổng quan */}
            <View style={styles.overviewContainer}>
                <View style={styles.overviewCard}>
                    <Text style={styles.label}>Đơn hàng hôm nay</Text>
                    <Text style={styles.value}>25</Text>
                </View>
                <View style={styles.overviewCard}>
                    <Text style={styles.label}>Doanh thu hôm nay</Text>
                    <Text style={styles.value}>10,000,000 VND</Text>
                </View>
                <View style={styles.overviewCard}>
                    <Text style={styles.label}>Món bán chạy nhất</Text>
                    <Text style={styles.value}>Phở bò</Text>
                </View>
            </View>

            {/* Nút chức năng */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FoodManagement')}>
                    <Text style={styles.buttonText}>Quản lý món ăn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderManagement')}>
                    <Text style={styles.buttonText}>Quản lý đơn hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RevenueReport')}>
                    <Text style={styles.buttonText}>Xem báo cáo doanh thu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFood')}>
                    <Text style={styles.buttonText}>Thêm món mới</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa', // Màu nền nhẹ nhàng
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        marginBottom: 20,
        color: '#333', // Màu chữ đậm vừa
        textAlign: 'center',
    },
    overviewContainer: {
        marginBottom: 20,
    },
    overviewCard: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eaeaea', // Sử dụng border để tạo cảm giác sạch sẽ
    },
    label: {
        fontSize: 16,
        color: '#666', // Màu chữ xám nhẹ
        marginBottom: 5,
    },
    value: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#e0e0e0', // Màu xám nhạt
        paddingVertical: 14,
        borderRadius: 6,
        marginBottom: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#333', // Màu chữ đậm nhưng vẫn tối giản
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DashboardScreen;