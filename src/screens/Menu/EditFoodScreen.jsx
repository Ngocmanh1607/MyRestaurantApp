import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import {
  getCategoryFood,
  getToppingFood,
  updateFoodInApi,
} from '../../api/foodApi';
import { uploadFoodImage } from '../../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectImage } from '../../utils/utilsRestaurant';
import { getCategories } from '../../api/restaurantApi';
import formatPrice from '../../utils/formatPrice';
import styles from '../../assets/css/EditFoodStyle';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EditFoodScreen = ({ route, navigation }) => {
  const { food } = route.params;

  const [foodData, setFoodData] = useState({
    id: food.id,
    name: food.name,
    descriptions: food.descriptions,
    categories: [],
    price: food.price,
    image: food.image,
    toppings: [],
  });
  const [originalFoodData, setOriginalFoodData] = useState({});
  const [toppings, setToppings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [userId, setUserId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) throw new Error('User không tồn tại');
      setUserId(storedUserId);
      const [categoriesData, toppingData, foodCategories] = await Promise.all([
        getCategories(),
        getToppingFood(foodData.id),
        getCategoryFood(foodData.id),
      ]);
      setAllCategories(categoriesData.data);
      setToppings(toppingData);
      const currentCats = categoriesData.data.filter((cat) =>
        foodCategories.includes(cat.id)
      );
      setCurrentCategories(currentCats);
      const selectedCategoriesId = foodCategories.map(
        (category) => category.id
      );

      setSelectedCategories(selectedCategoriesId);

      setFoodData((prev) => ({
        ...prev,
        categories: foodCategories,
        toppings: toppingData,
      }));

      setOriginalFoodData({
        ...foodData,
        categories: foodCategories,
        toppings: toppingData,
      });
    } catch (error) {
      console.error('Lấy dữ liệu lỗi :', error.message);
      showError('Lấy dữ liệu lỗi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Image handling
  const handleImageUpload = async (imageUri) => {
    try {
      const foodImage = await uploadFoodImage(userId, foodData.name, imageUri);
      if (!foodImage) throw new Error('Cập nhật ảnh thất bại');
      return foodImage;
    } catch (error) {
      console.error('Lỗi :', error);
      throw error;
    }
  };

  const chooseImage = async () => {
    try {
      const imageUri = await selectImage();
      if (imageUri) {
        setIsLoading(true);
        const uploadedImageUrl = await handleImageUpload(imageUri);
        setFoodData((prev) => ({ ...prev, image: uploadedImageUrl }));
      }
    } catch (error) {
      showError('Cập nhật ảnh thất bại. Thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFoodData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToppingChange = (index, field, value) => {
    const updatedToppings = [...toppings];
    updatedToppings[index][field] = value;
    setToppings(updatedToppings);
  };

  const addNewTopping = () => {
    const newTopping = {
      id: Date.now(),
      topping_name: '',
      price: '',
      food_id: foodData.id,
    };
    setToppings([...toppings, newTopping]);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      const newCurrentCategories = allCategories.filter((cat) =>
        newSelection.includes(cat.id)
      );
      setCurrentCategories(newCurrentCategories);

      return newSelection;
    });
  };

  const updateFoodData = async () => {
    setIsLoading(true);
    try {
      if (!foodData.name || !foodData.price) {
        throw new Error('Name and price are required');
      }

      const updateData = {
        id: foodData.id,
        name: foodData.name,
        descriptions: foodData.descriptions,
        price: parseFloat(foodData.price),
        image: foodData.image,
        categories: selectedCategories,
        toppings: toppings.map((topping) => ({
          ...topping,
          price: parseFloat(topping.price),
        })),
      };

      await updateFoodInApi(updateData);

      setIsEditing(false);
      showSuccess('Cập nhật thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating food:', error);
      setFoodData(originalFoodData);
      setSelectedCategories(originalFoodData.categories);
      setToppings(originalFoodData.toppings);
      showError('Có lỗi khi cập nhật');
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const showError = (message) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: '#ff0000',
    });
  };

  const showSuccess = (message) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#28a745',
    });
  };

  const toggleEditMode = () => {
    if (isEditing) {
      Alert.alert('Lưu thay đổi', 'Bạn có chắc lưu thay đổi không ?', [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Lưu',
          onPress: updateFoodData,
        },
      ]);
    } else {
      setOriginalFoodData({ ...foodData });
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.editHeaderButton}
                  onPress={toggleEditMode}>
                  <Icon name="edit" size={18} color="#007AFF" />
                  <Text style={styles.editHeaderText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Image Section */}
            <View style={styles.imageSection}>
              <TouchableOpacity
                onPress={isEditing ? chooseImage : null}
                disabled={!isEditing || isLoading.uploadingImage}
                style={[
                  styles.imageContainer,
                  isEditing && styles.imageContainerEditing,
                ]}>
                {isLoading.uploadingImage ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                  </View>
                ) : (
                  <>
                    <Image
                      style={styles.foodImage}
                      source={{ uri: foodData.image }}
                      resizeMode="cover"
                    />
                    {isEditing && (
                      <View style={styles.imageOverlay}>
                        <Icon name="camera" size={24} color="#FFFFFF" />
                        <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {/* Basic Information */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tên sản phẩm *</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      !isEditing && styles.disabledInput,
                    ]}
                    value={foodData.name}
                    onChangeText={(value) => handleChange('name', value)}
                    editable={isEditing}
                    placeholder="Nhập tên sản phẩm"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Giá *</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      !isEditing && styles.disabledInput,
                    ]}
                    value={formatPrice(foodData.price)}
                    onChangeText={(value) => handleChange('price', value)}
                    editable={isEditing}
                    keyboardType="numeric"
                    placeholder="Nhập giá sản phẩm"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mô tả *</Text>
                  <TextInput
                    style={[
                      styles.textAreaInput,
                      !isEditing && styles.disabledInput,
                    ]}
                    value={foodData.descriptions}
                    onChangeText={(value) =>
                      handleChange('descriptions', value)
                    }
                    editable={isEditing}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholder="Nhập mô tả chi tiết sản phẩm"
                  />
                </View>
              </View>

              {/* Categories Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Danh mục *</Text>
                <View style={styles.categoriesContainer}>
                  {allCategories.map((category) => (
                    <View key={category.id} style={styles.checkboxContainer}>
                      <CheckBox
                        style={styles.checkbox}
                        tintColors={{ true: '#007AFF', false: '#999' }}
                        disabled={!isEditing}
                        value={foodData.categories.some(
                          (cate) => cate.id === category.id
                        )}
                        onValueChange={() => toggleCategory(category.id)}
                      />
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Toppings Section */}
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Các lựa chọn</Text>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={addNewTopping}
                      style={styles.addToppingButton}>
                      <Icon name="plus" size={14} color="#FFFFFF" />
                      <Text style={styles.addToppingText}>Thêm</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {toppings.length > 0 ? (
                  <View style={styles.toppingsContainer}>
                    <View style={styles.toppingHeaderRow}>
                      <Text style={styles.toppingHeaderText}>Tên lựa chọn</Text>
                      <Text style={styles.toppingHeaderText}>Giá</Text>
                    </View>

                    {toppings.map((topping, index) => (
                      <View key={topping.id} style={styles.toppingRow}>
                        <TextInput
                          style={[
                            styles.toppingName,
                            !isEditing && styles.disabledInput,
                          ]}
                          value={topping.topping_name}
                          placeholder="Tên lựa chọn"
                          onChangeText={(value) =>
                            handleToppingChange(index, 'topping_name', value)
                          }
                          editable={isEditing}
                        />
                        <TextInput
                          style={[
                            styles.toppingPrice,
                            !isEditing && styles.disabledInput,
                          ]}
                          value={formatPrice(topping.price)}
                          placeholder="Giá"
                          editable={isEditing}
                          onChangeText={(value) =>
                            handleToppingChange(index, 'price', value)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyToppings}>
                    <Text style={styles.emptyToppingsText}>
                      {isEditing
                        ? "Nhấn 'Thêm' để tạo lựa chọn cho sản phẩm này"
                        : 'Không có lựa chọn nào cho sản phẩm này'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Bottom Action Buttons */}
        {isEditing ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={toggleEditMode}>
              <Icon name="check" size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Lưu thay đổi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}>
              <Icon name="times" size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditFoodScreen;
