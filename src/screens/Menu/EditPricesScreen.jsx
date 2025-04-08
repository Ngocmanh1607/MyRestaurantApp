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
import { getFoodRes } from '../../api/restaurantApi';
import { getInformationRes } from '../../api/restaurantApi';
// // Giả lập API để lấy dữ liệu và cập nhật
// const fetchFoodItems = () => {
//   // Trong ứng dụng thực tế, đây sẽ là một API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: '1', name: 'Phở bò', price: 65000, category: 'Món chính' },
//         { id: '2', name: 'Bún chả', price: 60000, category: 'Món chính' },
//         { id: '3', name: 'Bánh mì thịt', price: 35000, category: 'Ăn nhẹ' },
//         { id: '4', name: 'Cơm tấm', price: 55000, category: 'Món chính' },
//         { id: '5', name: 'Chả giò', price: 40000, category: 'Khai vị' },
//         { id: '6', name: 'Gỏi cuốn', price: 45000, category: 'Khai vị' },
//         { id: '7', name: 'Cà phê sữa đá', price: 30000, category: 'Đồ uống' },
//         { id: '8', name: 'Sinh tố xoài', price: 35000, category: 'Đồ uống' },
//         { id: '9', name: 'Chè ba màu', price: 25000, category: 'Tráng miệng' },
//         { id: '10', name: 'Bánh flan', price: 20000, category: 'Tráng miệng' },
//       ]);
//     }, 500);
//   });
// };

// const updateFoodPrices = (updatedItems) => {
//   // Trong ứng dụng thực tế, đây sẽ là một API call để cập nhật giá
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ success: true });
//     }, 1000);
//   });
// };

const EditPriceScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [editedItems, setEditedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState([]);
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
          console.log();
          ('Restaurant ID không hợp lệ');
        }
        const data = await getFoodRes(restaurantId, navigation);
        const cate = [];
        console.log('Dữ liệu món ăn:', data);
        if (!data || !Array.isArray(data)) {
          throw new Error('Dữ liệu món ăn không hợp lệ');
        }
        const sections = data.map((category) => {
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
      } catch (error) {
        Snackbar.show({
          text: error.message || 'Lỗi lấy dữ liệu món ăn',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    };

    fetchFoodRes();
  }, [restaurantId]);

  const handlePriceChange = (id, value) => {
    // Chỉ lưu trữ các giá trị đã chỉnh sửa
    const newValue = value.replace(/[^0-9]/g, '');

    setEditedItems((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const applyPercentageChange = (percentage) => {
    const updatedItems = {};

    foodItems.forEach((item) => {
      const newPrice = Math.round(item.price * (1 + percentage / 100));
      updatedItems[item.id] = newPrice.toString();
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
      // Tạo mảng các mục cần cập nhật
      const itemsToUpdate = Object.keys(editedItems).map((id) => ({
        id,
        price: parseInt(editedItems[id], 10),
      }));

      const result = await updateFoodPrices(itemsToUpdate);

      if (result.success) {
        // Cập nhật state với giá mới
        const updatedFoodItems = foodItems.map((item) => {
          if (editedItems[item.id]) {
            return {
              ...item,
              price: parseInt(editedItems[item.id], 10),
            };
          }
          return item;
        });

        setFoodItems(updatedFoodItems);
        setEditedItems({});
        Alert.alert('Thành công', 'Đã cập nhật giá thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật giá món ăn');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems =
    selectedCategory === 'Tất cả'
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.toolbarContainer}>
        <Text style={styles.toolbarTitle}>Thay đổi hàng loạt:</Text>
        <View style={styles.percentageButtons}>
          <TouchableOpacity
            style={styles.percentageButton}
            onPress={() => applyPercentageChange(5)}>
            <Text style={styles.percentageButtonText}>+5%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.percentageButton}
            onPress={() => applyPercentageChange(10)}>
            <Text style={styles.percentageButtonText}>+10%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.percentageButton}
            onPress={() => applyPercentageChange(-5)}>
            <Text style={styles.percentageButtonText}>-5%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.percentageButton}
            onPress={() => applyPercentageChange(-10)}>
            <Text style={styles.percentageButtonText}>-10%</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Lọc theo danh mục:</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item)}>
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item &&
                    styles.selectedCategoryButtonText,
                ]}>
                {item.category_name}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
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
    </SafeAreaView>
  );
};

export default EditPriceScreen;
