import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const StatisticScreen = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalFoodSold: 0,
        revenueData: [],
    });

    useEffect(() => {
        // Giả lập dữ liệu thống kê từ API
        const fetchStats = async () => {
            try {
                // Giả lập dữ liệu doanh thu theo ngày
                const revenueData = [
                    { date: '2025-02-01', revenue: 500 },
                    { date: '2025-02-02', revenue: 1000 },
                    { date: '2025-02-03', revenue: 750 },
                    { date: '2025-02-04', revenue: 1200 },
                    { date: '2025-02-05', revenue: 900 },
                ];

                setStats({
                    totalOrders: 150,
                    totalRevenue: 25000,
                    totalFoodSold: 320,
                    revenueData: revenueData,
                });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thống kê:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Thống kê nhà hàng</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Tổng số đơn hàng</Text>
                <Text style={styles.cardValue}>{stats.totalOrders}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Doanh thu hôm nay</Text>
                <Text style={styles.cardValue}>{stats.totalRevenue.toLocaleString()} VND</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Tổng món ăn đã bán</Text>
                <Text style={styles.cardValue}>{stats.totalFoodSold}</Text>
            </View>

            {/* Biểu đồ doanh thu */}
            <Text style={styles.chartTitle}>Biểu đồ doanh thu theo ngày</Text>
            <LineChart
                data={{
                    labels: stats.revenueData.map(item => moment(item.date).format('DD/MM')),
                    datasets: [
                        {
                            data: stats.revenueData.map(item => item.revenue),
                        },
                    ],
                }}
                width={screenWidth - 20}
                height={220}
                yAxisLabel="VND "
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                        r: '5',
                        strokeWidth: '2',
                        stroke: '#f00',
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    alignSelf: 'center',
                }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        color: '#555',
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ff0000',
        marginTop: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default StatisticScreen;