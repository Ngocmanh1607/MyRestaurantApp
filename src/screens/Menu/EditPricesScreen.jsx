import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles } from '../../assets/css/EditPricesStyle';
import {
  editListProduct,
  getFoodRes,
  getInformationRes,
} from '../../api/restaurantApi';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native-paper';

const EditPriceScreen = () => {
  const [editedItems, setEditedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setLoading(true);
        const res = await getInformationRes();
        setRestaurantId(res.id);
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantId();
  }, []);

  useEffect(() => {
    const fetchFoodRes = async () => {
      try {
        if (!restaurantId) {
          console.log('Restaurant ID không hợp lệ');
          return;
        }

        const data = await getFoodRes(restaurantId, navigation);
        console.log('Dữ liệu món ăn:', data);

        if (!data || !Array.isArray(data)) {
          throw new Error('Dữ liệu món ăn không hợp lệ');
        }

        // Prepare categories with "Tất cả" as first option
        const categoryList = [{ id: 'all', name: 'Tất cả' }];
        const allProductsList = [];

        // Process the data
        data.forEach((category) => {
          categoryList.push({
            id: category.category_id,
            name: category.category_name,
          });

          // Add all products to a flat list with category info
          category.products.forEach((product) => {
            allProductsList.push({
              id: product.product_id,
              name: product.product_name,
              price: product.product_price,
              image: product.image,
              descriptions: product.product_description,
              quantity: product.product_quantity,
              toppings: product.toppings,
              category: category.category_name,
              categoryId: category.category_id,
            });
          });
        });

        setCategories(categoryList);
        setAllProducts(allProductsList);
      } catch (error) {
        Alert.alert('Lỗi', error.message || 'Lỗi lấy dữ liệu món ăn');
      }
    };

    if (restaurantId) {
      fetchFoodRes();
    }
  }, [restaurantId, navigation]);

  const handlePriceChange = (id, value) => {
    // Chỉ lưu trữ các giá trị đã chỉnh sửa
    const newValue = value.replace(/[^0-9]/g, '');

    setEditedItems((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const applyPercentageChange = (percentage) => {
    const updatedItems = { ...editedItems };

    allProducts.forEach((product) => {
      const currentPrice =
        editedItems[product.id] !== undefined
          ? parseInt(editedItems[product.id], 10)
          : product.price;

      const newPrice = Math.round(currentPrice * (1 + percentage / 100));
      updatedItems[product.id] = newPrice.toString();
    });

    setEditedItems(updatedItems);
  };

  const saveChanges = async () => {
    if (Object.keys(editedItems).length === 0) {
      Alert.alert('Thông báo', 'Không có thay đổi nào để lưu');
      return;
    }

    setSaving(true);
    try {
      setLoading(true);
      // Tạo mảng các mục cần cập nhật
      const itemsToUpdate = Object.keys(editedItems).map((id) => ({
        product_id: id,
        new_price: parseInt(editedItems[id], 10),
      }));
      console.log('Items to update:', itemsToUpdate);
      await editListProduct(restaurantId, itemsToUpdate);
      // Update allProducts with new prices
      const updatedProducts = allProducts.map((product) => {
        if (editedItems[product.id] !== undefined) {
          return {
            ...product,
            price: parseInt(editedItems[product.id], 10),
          };
        }
        return product;
      });

      setAllProducts(updatedProducts);
      setEditedItems({});
      Alert.alert('Thành công', 'Đã cập nhật giá thành công');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật giá món ăn');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'Tất cả'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  const renderItem = ({ item }) => {
    const currentValue =
      editedItems[item.id] !== undefined
        ? editedItems[item.id]
        : item.price.toString();

    const hasChanged =
      editedItems[item.id] !== undefined &&
      parseInt(editedItems[item.id], 10) !== item.price;

    return (
      <View style={[styles.itemContainer, hasChanged && styles.changedItem]}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <View style={styles.priceContainer}>
          {hasChanged && (
            <Text style={styles.oldPrice}>
              {item.price.toLocaleString('vi-VN')} đ
            </Text>
          )}
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={currentValue}
            onChangeText={(value) => handlePriceChange(item.id, value)}
            maxLength={10}
          />
          <Text style={styles.currency}>đ</Text>
        </View>
      </View>
    );
  };

  const renderPercentageButton = (percentage) => {
    return (
      <TouchableOpacity
        style={styles.percentageButton}
        onPress={() => applyPercentageChange(percentage)}>
        <Text style={styles.percentageButtonText}>{`${percentage}%`}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.toolbarContainer}>
        <Text style={styles.toolbarTitle}>Thay đổi hàng loạt:</Text>
        <View style={styles.percentageButtons}>
          {renderPercentageButton(5)}
          {renderPercentageButton(10)}
          {renderPercentageButton(-5)}
          {renderPercentageButton(-10)}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Lọc theo danh mục:</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item.name)}>
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.name &&
                    styles.selectedCategoryButtonText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setEditedItems({});
            Alert.alert('Đã hủy', 'Đã hủy tất cả các thay đổi');
          }}
          disabled={Object.keys(editedItems).length === 0 || saving}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (Object.keys(editedItems).length === 0 || saving) &&
              styles.disabledButton,
          ]}
          onPress={saveChanges}
          disabled={Object.keys(editedItems).length === 0 || saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              Lưu ({Object.keys(editedItems).length} thay đổi)
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal style={styles.centerContainer} visible={loading}>
        <ActivityIndicator size="large" color="#F00" />
      </Modal>
    </SafeAreaView>
  );
};

export default EditPriceScreen;
