import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const StatisticScreen = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

    // Data mẫu - Thay thế bằng data thực từ API
    const statistics = {
        totalOrders: 150,
        completedOrders: 142,
        cancelledOrders: 8,
        totalEarnings: 15000000,
        averageRating: 4.8,
        weeklyData: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            earnings: [500000, 700000, 600000, 800000, 1000000, 1200000, 900000],
            orders: [5, 7, 6, 8, 10, 12, 9],
        },
    };

    const formatMoney = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
    };

    const renderChart = () => {
        const chartConfig = {
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
        };

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Biểu đồ thu nhập</Text>
                <LineChart
                    data={{
                        labels: statistics.weeklyData.labels,
                        datasets: [
                            {
                                data: statistics.weeklyData.earnings.map(val => val / 100000), // Chia để hiển thị đẹp hơn
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>
        );
    };

    const StatisticCard = ({ title, value, icon, color }) => (
        <View style={styles.cardContainer}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardValue}>{value}</Text>
            </View>
        </View>
    );

    const PeriodSelector = () => (
        <View style={styles.periodContainer}>
            <TouchableOpacity
                style={[
                    styles.periodButton,
                    selectedPeriod === 'week' && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod('week')}
            >
                <Text
                    style={[
                        styles.periodButtonText,
                        selectedPeriod === 'week' && styles.periodButtonTextActive,
                    ]}
                >
                    Tuần
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.periodButton,
                    selectedPeriod === 'month' && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod('month')}
            >
                <Text
                    style={[
                        styles.periodButtonText,
                        selectedPeriod === 'month' && styles.periodButtonTextActive,
                    ]}
                >
                    Tháng
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.periodButton,
                    selectedPeriod === 'year' && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod('year')}
            >
                <Text
                    style={[
                        styles.periodButtonText,
                        selectedPeriod === 'year' && styles.periodButtonTextActive,
                    ]}
                >
                    Năm
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <PeriodSelector />
                </View>

                <View style={styles.statsGrid}>
                    <StatisticCard
                        title="Tổng thu nhập"
                        value={formatMoney(statistics.totalEarnings)}
                        icon="account-balance-wallet"
                        color="#5196F4"
                    />
                    <StatisticCard
                        title="Tổng đơn hàng"
                        value={statistics.totalOrders}
                        icon="shopping-bag"
                        color="#2ECC71"
                    />
                    <StatisticCard
                        title="Đơn hoàn thành"
                        value={statistics.completedOrders}
                        icon="check-circle"
                        color="#27AE60"
                    />
                    <StatisticCard
                        title="Đơn hủy"
                        value={statistics.cancelledOrders}
                        icon="cancel"
                        color="#E74C3C"
                    />
                </View>

                {renderChart()}

                <View style={styles.orderStatsContainer}>
                    <Text style={styles.orderStatsTitle}>Chi tiết đơn hàng</Text>
                    <View style={styles.orderStats}>
                        <View style={styles.orderStatItem}>
                            <Text style={styles.orderStatLabel}>Tỷ lệ hoàn thành</Text>
                            <Text style={styles.orderStatValue}>
                                {((statistics.completedOrders / statistics.totalOrders) * 100).toFixed(1)}%
                            </Text>
                        </View>
                        <View style={styles.orderStatItem}>
                            <Text style={styles.orderStatLabel}>Đánh giá trung bình</Text>
                            <View style={styles.ratingContainer}>
                                <Icon name="star" size={20} color="#FFC107" />
                                <Text style={styles.orderStatValue}>{statistics.averageRating}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    periodContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodButtonActive: {
        backgroundColor: '#5196F4',
    },
    periodButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: '#fff',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
    },
    cardContainer: {
        width: '50%',
        padding: 10,
    },
    cardContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        position: 'absolute',
        top: 20,
        right: 25,
        zIndex: 1,
        padding: 8,
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chartContainer: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    chart: {
        borderRadius: 10,
        marginVertical: 8,
    },
    orderStatsContainer: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderStatsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    orderStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderStatItem: {
        flex: 1,
    },
    orderStatLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    orderStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default StatisticScreen;