import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  SectionList,
  Alert,
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
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const sectionListRef = useRef();
  const itemLayouts = useRef({});
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setIsLoading(true);
        const res = await getInformationRes();
        setRestaurantId(res.metadata.id);
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
          if (data.success) {
            const cate = [];
            console.log('Dữ liệu món ăn:', data.data);
            if (!data.data || !Array.isArray(data.data)) {
              throw new Error('Dữ liệu món ăn không hợp lệ');
            }
            const sections = data.data.map((category) => {
              cate.push({
                id: category.category_id,
                name: category.category_name,
              });
              return {
                title: category.category_name,
                data: category.products.map((product) => ({
                  id: product.product_id,
                  name: product.product_name,
                  price: product.product_price,
                  image: product.image,
                  descriptions: product.product_description,
                  quantity: product.product_quantity,
                  toppings: product.toppings,
                })),
              };
            });
            setFoodItems(sections);
            setCategories(cate);
          } else {
            Alert.alert('Đã xảy ra lỗi', data.message);
            return;
          }
        } catch (error) {
          Snackbar.show({
            text: error.message || 'Lỗi lấy dữ liệu món ăn',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      };
      if (restaurantId) {
        fetchFoodRes();
      }
    }, [restaurantId])
  );
  const handleLayout = (event, index) => {
    const { x } = event.nativeEvent.layout;
    itemLayouts.current[index] = { x };
  };
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].section) {
      const sectionIndex = foodItems.findIndex(
        (section) => section.title === viewableItems[0].section.title
      );
      if (sectionIndex !== -1) {
        setActiveCategory(sectionIndex);
        const layout = itemLayouts.current[sectionIndex];
        if (layout) {
          scrollRef.current?.scrollTo({
            x: layout.x - 20,
            animated: true,
          });
        }
      }
    }
  };
  const handlePress = () => {
    navigation.navigate('Thêm món ăn');
  };

  const handleCategoryPress = (index) => {
    if (index !== activeCategory) {
      // setActiveCategory(index);
      const layout = itemLayouts.current[index];
      if (layout) {
        scrollRef.current?.scrollTo({
          x: layout.x - 20, // scroll hơi lệch trái cho đẹp
          animated: true,
        });
      }
      if (sectionListRef.current) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: true,
          viewPosition: 0,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      {foodItems.length > 0 ? (
        <View style={styles.mainContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryListContainer}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={item.id.toString()}
                onLayout={(event) => handleLayout(event, index)}
                style={[
                  styles.categoryItem,
                  activeCategory === index && styles.activeCategoryItem,
                ]}
                onPress={() => handleCategoryPress(index)}>
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === index && styles.activeCategoryText,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <SectionList
            ref={sectionListRef}
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
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="alert-circle" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Không tìm thấy món ăn nào</Text>
              </View>
            }
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  categoryListContainer: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // marginRight: 12,
    height: 40,
    margin: 8,
  },
  activeCategoryItem: {
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6347',
  },
  activeCategoryText: {
    fontWeight: 'bold',
    color: '#FF6347',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
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
