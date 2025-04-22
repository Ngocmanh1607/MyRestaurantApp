import { View, Text, FlatList, SafeAreaView, Alert } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import styles from '../../assets/css/ReviewStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import ReviewItem from '../../components/ReviewItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReview, getInformationRes } from '../../api/restaurantApi';
import { ActivityIndicator } from 'react-native-paper';
const ReviewScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setIsLoading(true);
        const res = await getInformationRes();
        if (res.success) {
          setRestaurantId(res.metadata.id);
        } else {
          if (res.message === 'jwt expired') {
            Alert.alert('Lỗi', 'Hết phiên làm việc. Vui lòng đăng nhập lại', [
              {
                text: 'OK',
                onPress: async () => {
                  await AsyncStorage.clear();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                  });
                },
              },
            ]);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantId();
  }, []);
  useEffect(() => {
    if (restaurantId) {
      const fetchReviews = async () => {
        const response = await getReview(restaurantId);
        if (response.success) setReviews(response.data);
        else Alert.alert('Lỗi', response.message);
      };
      fetchReviews();
    }
  }, [restaurantId]);
  const { ratingsData, totalReviews, averageRating } = useMemo(() => {
    const ratings = [0, 0, 0, 0, 0];
    let total = 0;
    let sumRatings = 0;
    if (reviews) {
      total = reviews.length;

      reviews.forEach(({ res_rating }) => {
        ratings[res_rating - 1]++;
        sumRatings += res_rating;
      });
    }
    return {
      ratingsData: ratings
        .map((count, index) => ({
          stars: index + 1,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .reverse(), // Đảo ngược để hiển thị từ 5→1
      totalReviews: total,
      averageRating: (sumRatings / total).toFixed(1),
    };
  }, [reviews]);

  const renderRatingSummary = () => (
    <View style={styles.ratingCard}>
      <View style={styles.ratingOverview}>
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingValue}>{averageRating}</Text>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={16}
                color={
                  index < Math.round(parseFloat(averageRating))
                    ? '#FFD700'
                    : '#DDDDDD'
                }
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.totalReviewsText}>{totalReviews} đánh giá</Text>
        </View>

        <View style={styles.ratingBreakdown}>
          {ratingsData.map((item) => (
            <View key={item.stars} style={styles.ratingRow}>
              <View style={styles.starsLabel}>
                <Text style={styles.starText}>{item.stars}</Text>
                <FontAwesome
                  name="star"
                  size={12}
                  color="#FFD700"
                  style={styles.starIconSmall}
                />
              </View>

              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={item.count / totalReviews || 0}
                  width={null}
                  height={8}
                  color="#FFD700"
                  unfilledColor="#EEEEEE"
                  borderWidth={0}
                  style={styles.progressBar}
                />
              </View>

              <View style={styles.countContainer}>
                <Text style={styles.countText}>{item.count}</Text>
                <Text style={styles.percentageText}>
                  {totalReviews > 0 ? Math.round(item.percentage) : 0}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có đánh giá nào</Text>
    </View>
  );

  const renderReviewsList = () => (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.reviewsList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderRatingSummary}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
        </View>
      ) : reviews?.length > 0 ? (
        renderReviewsList()
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};
export default ReviewScreen;
