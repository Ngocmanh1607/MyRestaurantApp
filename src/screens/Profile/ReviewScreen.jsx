import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
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
            console.log(response);
            setReviews(response);
        };
        fetchReviews();
    }, [restaurantId]);
    const { ratingsData, totalReviews, averageRating } = useMemo(() => {
        const ratings = [0, 0, 0, 0, 0];
        let total = 0;
        let sumRatings = 0;
        if (reviews) {
            total = reviews.length;

            reviews.forEach(({ rating }) => {
                ratings[rating - 1]++;
                sumRatings += rating;
            });
        }
        return {
            ratingsData: ratings.map((count, index) => ({
                stars: index + 1,
                count,
            })).reverse(), // Đảo ngược để hiển thị từ 5→1
            totalReviews: total,
            averageRating: (sumRatings / total).toFixed(1),
        };
    }, [reviews]);

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator size='large' color='red' />}
            {
                reviews?.length > 0 ? (< View style={styles.headerContainer}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.averageRating}>{averageRating}</Text>
                        <View style={styles.starsRow}>
                            {[...Array(5)].map((_, index) => (
                                <FontAwesome key={index} name="star" size={20} color="gold" />
                            ))}
                        </View>
                        <Text style={styles.totalReviews}>{totalReviews} đánh giá</Text>
                    </View>

                    {/* Biểu đồ đánh giá */}
                    <View style={styles.ratingList}>
                        {ratingsData.map((item) => (
                            <View key={item.stars} style={styles.ratingRow}>
                                <Text style={styles.starText}>{item.stars} <FontAwesome name="star" size={14} color="gold" /></Text>
                                <Progress.Bar
                                    progress={item.count / totalReviews}
                                    width={150}
                                    height={8}
                                    color="gold"
                                    unfilledColor="#ddd"
                                    borderWidth={0}
                                />
                                <Text style={styles.countText}>{item.count}</Text>
                            </View>
                        ))}
                    </View>
                    <FlatList
                        data={reviews}
                        renderItem={({ item }) => <ReviewItem review={item} />}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View >) : (
                    <View style={styles.noReviewsContainer}>
                        <Text style={styles.noReviewsText}>Không có đánh giá nào</Text>
                    </View>
                )
            }
        </View>
    );
};
export default ReviewScreen;