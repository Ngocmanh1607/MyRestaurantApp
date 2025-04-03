import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';

import FoodCard from '../../components/FoodCard';
import { getFoodRes } from '../../api/restaurantApi';
const FoodManagementScreen = () => {
  const navigation = useNavigation();
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useFocusEffect(
    useCallback(() => {
      const fetchFoodRes = async () => {
        try {
          const data = await getFoodRes(navigation);
          if (!data || !Array.isArray(data)) {
            throw new Error('Dữ liệu món ăn không hợp lệ');
          }
          setFoodItems(
            data.map((item) => ({
              id: item.id,
              name: item.name,
              image: item.image,
              descriptions: item.descriptions,
              price: item.price,
            }))
          );
        } catch (error) {
          Snackbar.show({
            text: error.message || 'Lỗi lấy dữ liệu món ăn',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      };

      fetchFoodRes();
    }, [])
  );
  const handlePress = () => {
    navigation.navigate('Thêm món ăn');
  };
  const filterFoodItems = foodItems.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}>
        {filterFoodItems.length > 0 ? (
          filterFoodItems.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onPress={() => console.log(`Add ${food.name}`)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="coffee" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Không có món ăn nào</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editPricesButton}
          onPress={() => {
            navigation.navigate('EditPrices');
          }}>
          <Feather name="edit-2" size={18} color="#555" />
          <Text style={styles.editPricesText}>Chỉnh sửa giá món ăn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handlePress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100, // Extra space for the buttons at bottom
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  editPricesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  editPricesText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6347', // Tomato red
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FoodManagementScreen;
