import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import FoodCard from '../../components/FoodCard';
import { getFoodRes } from '../../api/restaurantApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
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
    <>
      <ScrollView style={styles.mainContainer}>
        {filterFoodItems.length > 0 ? (
          filterFoodItems.map((food) => (
            <FoodCard key={food.id} food={food} onPress={() => console.log(`Add ${food.name}`)} />
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có món ăn nào</Text>
        )}
      </ScrollView>
      <View style={styles.addContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}
        onPress={() => {
          navigation.navigate('EditPrices');
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#555',
          }}>
          + Chính sửa giá món ăn
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  addContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  addText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#f00',
  },
});

export default FoodManagementScreen;
