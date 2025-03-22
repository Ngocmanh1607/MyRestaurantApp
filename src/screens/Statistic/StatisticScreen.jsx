import React, { useState, useEffect } from 'react';
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
import StatisticCard from '../../components/StatisticCard';
import formatPrice from '../../utils/formatPrice';
import { getReview, getInformationRes } from '../../api/restaurantApi';
import { checkDateInCurrentWeek } from '../../utils/utilsTime';
const StatisticScreen = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('day');
    const [reviews, setReviews] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [statistics, setStatistics] = useState({
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalEarnings: 0,
        averageRating: 0,
        dailyData: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            earnings: Array(7).fill(0),
            orders: Array(7).fill(0),
        },
        weeklyData: {
            labels: ['T1', 'T2', 'T3', 'T4', ''],
            earnings: Array(5).fill(0),
            orders: Array(5).fill(0),
        },
        monthlyData: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            earnings: Array(12).fill(0),
            orders: Array(12).fill(0),
        }
    });
    const calculateStatistics = () => {
        const stats = {
            totalEarnings: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            dailyData: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                earnings: Array(7).fill(0),
                orders: Array(7).fill(0),
            },
            weeklyData: {
                labels: ['T1', 'T2', 'T3', 'T4', ''],
                earnings: Array(5).fill(0),
                orders: Array(5).fill(0),
            },
            monthlyData: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                earnings: Array(12).fill(0),
                orders: Array(12).fill(0),
            }
        };
        if (selectedPeriod === 'day') {
            const day = new Date().getDate();
            orders.forEach(order => {
                const orderDate = new Date(order.order_date).getDate();
                if (orderDate === day) {
                    if (order.order_status === 'ORDER_CONFIRMED') {
                        stats.totalEarnings += order.price;
                        stats.completedOrders++;
                    } else if (order.order_status === 'ORDER_CANCELLED') {
                        stats.cancelledOrders++;
                    }
                    stats.totalOrders++;
                }
                if (checkDateInCurrentWeek(order.order_date)) {
                    if (order.order_status === 'ORDER_CONFIRMED') {
                        const day = new Date(order.order_date).getDay();
                        stats.dailyData.earnings[day - 1] += order.price;
                        stats.dailyData.orders[day - 1]++;
                    }
                }
            });

            return stats;
        }
        else if (selectedPeriod === 'week') {
            console.log('week');
            const day = Math.floor(new Date().getDate() / 7);
            orders.forEach(order => {
                const orderDate = Math.floor(new Date(order.order_date).getDate() / 7);
                if (orderDate === day) {
                    if (order.order_status === 'ORDER_CONFIRMED') {
                        stats.totalEarnings += order.price;
                        stats.completedOrders++;
                    } else if (order.order_status === 'ORDER_CANCELLED') {
                        stats.cancelledOrders++;
                    }
                    stats.totalOrders++;
                }

            });
            return stats;
        }
        else if (selectedPeriod === 'month') {
            console.log('month');
            const month = new Date().getMonth();
            console.log('month', month);
            orders.forEach(order => {
                const orderDate = new Date(order.order_date).getMonth();
                console.log('order month', orderDate);
                console.log('month', month);
                if (orderDate === month) {
                    if (order.order_status === 'ORDER_CONFIRMED') {
                        stats.totalEarnings += order.price;
                        stats.completedOrders++;
                    } else if (order.order_status === 'ORDER_CANCELLED') {
                        stats.cancelledOrders++;
                    }
                    stats.totalOrders++;
                }
            });
            return stats;
        }
    }
    useEffect(() => {
        // Giả lập dữ liệu đơn hàng mẫu
        const sampleOrders = [
            {
                id: 31,
                price: 100000,
                order_status: 'ORDER_CONFIRMED',
                order_date: '2025-03-14 14:33:53',
                delivery_fee: 10500,
                order_pay: 'ZALOPAY'
            },
            {
                id: 32,
                price: 60000,
                order_status: 'ORDER_CONFIRMED',
                order_date: '2025-03-17 14:33:53',
                delivery_fee: 10500,
                order_pay: 'ZALOPAY'
            }, {
                id: 33,
                price: 100000,
                order_status: 'ORDER_CANCELLED',
                order_date: '2025-03-22 14:33:53',
                delivery_fee: 10500,
                order_pay: 'ZALOPAY'
            },
            {
                id: 34,
                price: 200000,
                order_status: 'ORDER_CONFIRMED',
                order_date: '2025-03-22 14:33:53',
                delivery_fee: 10500,
                order_pay: 'ZALOPAY'
            }];
        setOrders(sampleOrders);
        const newStats = calculateStatistics();
        setStatistics(newStats);
    }, []);
    useEffect(() => {
        const fetchRestaurantId = async () => {
            try {
                setIsLoading(true);
                const res = await getInformationRes();
                setRestaurantId(res.id);
            } catch (error) {
                console.error('Error fetching restaurant ID:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurantId();
    }, []);
    useEffect(() => {
        const fetchReviews = async () => {
            const response = await getReview(restaurantId);
            const averageRating = response.reduce((sum, review) => sum + review.res_rating, 0) / response.length;
            setStatistics(prevStats => ({
                ...prevStats,
                averageRating: averageRating.toFixed(1)
            }));
        };
        fetchReviews();
    }, [restaurantId]);
    const renderChart = () => {
        let data, labels;
        const chartConfig = {
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
        };
        switch (selectedPeriod) {
            case 'day':
                data = statistics.dailyData;
                labels = statistics.dailyData.labels;
                break;
            case 'week':
                data = statistics.weeklyData;
                labels = statistics.weeklyData.labels;
                break;
            case 'month':
                data = statistics.monthlyData;
                labels = statistics.monthlyData.labels;
                break;
            default:
                data = statistics.dailyData;
                labels = statistics.dailyData.labels;
                break;
        }
        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Biểu đồ thu nhập</Text>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: data.earnings.map(val => val / 100000),
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
    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        const newStats = calculateStatistics();
        setStatistics(newStats);
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.periodContainer}>
                        <TouchableOpacity
                            style={[styles.periodButton, selectedPeriod === 'day' && styles.periodButtonActive]}
                            onPress={() => handlePeriodChange('day')}>
                            <Text style={[styles.periodButtonText, selectedPeriod === 'day' && styles.periodButtonTextActive,]}>Ngày</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
                            onPress={() => handlePeriodChange('week')}>
                            <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>Tuần</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
                            onPress={() => handlePeriodChange('month')}>
                            <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>Tháng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.statsGrid}>
                    <StatisticCard
                        title="Tổng thu nhập"
                        value={formatPrice(statistics.totalEarnings)}
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
        marginTop: 10,
        marginHorizontal: 10,
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
    chartContainer: {
        backgroundColor: '#fff',
        margin: 10,
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
        margin: 10,
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