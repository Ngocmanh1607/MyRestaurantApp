import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { feedbackApi } from '../../api/feedbackApi';

import { useFocusEffect } from '@react-navigation/native';
import CardFeedback from '../../components/CardFeedback';

const FeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState();
  const [groupedFeedbacks, setGroupedFeedbacks] = useState({});

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const restaurant_id = await AsyncStorage.getItem('restaurantId');
      setRestaurantId(restaurant_id);
      const response = await feedbackApi.getFeedbacks(restaurant_id);

      if (response.success) {
        const grouped = response.data.reduce((acc, feedback) => {
          const orderId = feedback.order_id;
          if (!acc[orderId]) {
            acc[orderId] = {
              userFeedback: null,
              restaurantResponse: null,
            };
          }

          if (feedback.restaurant_res) {
            acc[orderId].restaurantResponse = feedback;
          } else {
            acc[orderId].userFeedback = feedback;
          }

          return acc;
        }, {});

        setGroupedFeedbacks(grouped);
        const userFeedbacks = response.data.filter(
          (item) => !item.restaurant_res
        );
        setFeedbacks(userFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeedbacks();
    }, [])
  );
  const handleCall = async (phoneNumber) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Quyền thực hiện cuộc gọi',
            message: 'Ứng dụng cần quyền để thực hiện cuộc gọi điện thoại',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await Linking.openURL(`tel:${phoneNumber}`);
        } else {
          Alert.alert('Lỗi', 'Vui lòng cấp quyền thực hiện cuộc gọi');
        }
      } else {
        // iOS handling
        const supported = await Linking.canOpenURL(`tel:${phoneNumber}`);
        if (supported) {
          await Linking.openURL(`tel:${phoneNumber}`);
        } else {
          Alert.alert('Lỗi', 'Thiết bị không hỗ trợ cuộc gọi điện thoại');
        }
      }
    } catch (error) {
      console.log('Error making call:', error.message);

      Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi');
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const renderFeedbackItem = ({ item }) => {
    const orderGroup = groupedFeedbacks[item.order_id];
    const responseInfo = orderGroup?.restaurantResponse;
    return (
      <CardFeedback
        item={item}
        handleCall={handleCall}
        restaurantId={restaurantId}
        responseInfo={responseInfo}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedbacks}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Chưa có phản hồi nào từ khách hàng
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default FeedbackScreen;
