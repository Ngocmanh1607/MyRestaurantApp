import React, { useCallback, useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  SectionList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
import { getInformationRes } from '../../api/restaurantApi';
import FoodCard from '../../components/FoodCard';
import { getFoodRes } from '../../api/restaurantApi';
const FoodManagementScreen = () => {
  const navigation = useNavigation();
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
  useFocusEffect(
    useCallback(() => {
      const fetchFoodRes = async () => {
        try {
          if (!restaurantId) {
            console.log();
            ('Restaurant ID không hợp lệ');
          }
          const data = await getFoodRes(restaurantId, navigation);
          console.log('Dữ liệu món ăn:', data);
          if (!data || !Array.isArray(data)) {
            throw new Error('Dữ liệu món ăn không hợp lệ');
          }
          const sections = data.map((category) => ({
            title: category.category_name,
            data: category.products.map((product) => ({
              id: product.product_id,
              name: product.product_name,
              price: product.product_price,
              image: product.image,
              descriptions: product.product_description,
              quantity: product.product_quantity,
            })),
          }));
          setFoodItems(sections);
        } catch (error) {
          Snackbar.show({
            text: error.message || 'Lỗi lấy dữ liệu món ăn',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      };

      fetchFoodRes();
    }, [restaurantId])
  );
  const handlePress = () => {
    navigation.navigate('Thêm món ăn');
  };
  // const filterFoodItems = foodItems.filter((food) =>
  //   food.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <View style={styles.container}>
      {foodItems.length > 0 ? (
        <SectionList
          sections={foodItems}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <FoodCard
              key={item.id}
              food={item}
              onPress={() => console.log(`Add ${food.name}`)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.foodListContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="alert-circle" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy món ăn nào</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="coffee" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Không có món ăn nào</Text>
        </View>
      )}

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
          <Feather name="edit-2" size={18} color="#555" />
          <Text style={styles.editPricesText}>Thêm món</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  foodListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  sectionHeaderContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    marginTop: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  editPricesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  editPricesText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButtonText: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '600',
  },
});

export default FoodManagementScreen;
