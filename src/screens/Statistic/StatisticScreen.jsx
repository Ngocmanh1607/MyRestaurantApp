import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import StatisticCard from '../../components/StatisticCard';
import formatPrice from '../../utils/formatPrice';
import {
  getReview,
  getInformationRes,
  getOrders,
} from '../../api/restaurantApi';
import {
  checkDateInCurrentWeek,
  checkDateInMonth,
  getWeekOfMonth,
} from '../../utils/utilsTime';
import { styles } from '../../assets/css/StatisticStyle';
const StatisticScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [restaurantId, setRestaurantId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalEarnings: 0,
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
      labels: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'T11',
        'T12',
      ],
      earnings: Array(12).fill(0),
      orders: Array(12).fill(0),
    },
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
        labels: [
          'T1',
          'T2',
          'T3',
          'T4',
          'T5',
          'T6',
          'T7',
          'T8',
          'T9',
          'T10',
          'T11',
          'T12',
        ],
        earnings: Array(12).fill(0),
        orders: Array(12).fill(0),
      },
    };
    if (selectedPeriod === 'day') {
      const day = new Date().getDate();
      orders.forEach((order) => {
        const orderDate = new Date(order.order_date).getDate();
        if (orderDate === day) {
          if (order.order_status === 'ORDER_CONFIRMED') {
            stats.totalEarnings += parseFloat(order.price.toString());
            stats.completedOrders++;
          } else if (order.order_status === 'ORDER_CANCELED') {
            stats.cancelledOrders++;
          }
          stats.totalOrders++;
        }
        if (checkDateInCurrentWeek(order.order_date)) {
          if (order.order_status === 'ORDER_CONFIRMED') {
            const dayOrder = new Date(order.order_date).getDay();
            stats.dailyData.earnings[dayOrder - 1] += parseFloat(
              order.price.toString()
            );
            stats.dailyData.orders[dayOrder - 1]++;
          }
        }
      });
      return stats;
    } else if (selectedPeriod === 'week') {
      orders.forEach((order) => {
        if (checkDateInCurrentWeek(order.order_date)) {
          if (order.order_status === 'ORDER_CONFIRMED') {
            stats.totalEarnings += parseFloat(order.price.toString());
            stats.completedOrders++;
          } else if (order.order_status === 'ORDER_CANCELED') {
            stats.cancelledOrders++;
          }
          stats.totalOrders++;
        }
        if (checkDateInMonth(order.order_date)) {
          if (order.order_status === 'ORDER_CONFIRMED') {
            const dayOfWeek = getWeekOfMonth(order.order_date);
            stats.weeklyData.earnings[dayOfWeek] += parseFloat(
              order.price.toString()
            );
            stats.weeklyData.orders[dayOfWeek]++;
          }
        }
      });
      return stats;
    } else if (selectedPeriod === 'month') {
      orders.forEach((order) => {
        if (checkDateInMonth(order.order_date)) {
          if (order.order_status === 'ORDER_CONFIRMED') {
            stats.totalEarnings += parseFloat(order.price.toString());
            stats.completedOrders++;
          } else if (order.order_status === 'ORDER_CANCELED') {
            stats.cancelledOrders++;
          }
          stats.totalOrders++;
        }
        const orderDate = new Date(order.order_date);
        const currentYear = new Date().getFullYear();
        const month = orderDate.getMonth(); // Lấy tháng (0 - 11)
        if (
          order.order_status === 'ORDER_CONFIRMED' &&
          orderDate.getFullYear() === currentYear
        ) {
          stats.monthlyData.earnings[month] += parseFloat(
            order.price.toString()
          );
          stats.monthlyData.orders[month]++;
        }
      });
      return stats;
    }
  };
  useEffect(() => {
    const getOrdersHistory = async () => {
      const response = await getOrders();
      if (response.success) {
        console.log('order', response);
        setOrders(response.data);
      }
    };
    getOrdersHistory();
    const newStats = calculateStatistics();
    setStatistics(newStats);
  }, []);

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setIsLoading(true);
        const res = await getInformationRes();
        if (res.success) setRestaurantId(res.metadata.id);
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
      const averageRating =
        response.reduce((sum, review) => sum + review.res_rating, 0) /
        response.length;
      setAverageRating(averageRating);
    };
    fetchReviews();
  }, [restaurantId]);
  useEffect(() => {
    const newStats = calculateStatistics();
    setStatistics(newStats);
  }, [orders, selectedPeriod]);
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
                data: data.earnings.map((val) => val / 1000),
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
  };
  const rating = () =>
    ((statistics.completedOrders / statistics.totalOrders) * 100).toFixed(1);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'day' && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange('day')}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'day' && styles.periodButtonTextActive,
                ]}>
                Ngày
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange('week')}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive,
                ]}>
                Tuần
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange('month')}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'month' && styles.periodButtonTextActive,
                ]}>
                Tháng
              </Text>
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
                {statistics.totalOrders > 0 ? `${rating()}%` : '100%'}
              </Text>
            </View>
            <View style={styles.orderStatItem}>
              <Text style={styles.orderStatLabel}>Đánh giá trung bình</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="#FFC107" />
                <Text style={styles.orderStatValue}>
                  {averageRating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default StatisticScreen;
