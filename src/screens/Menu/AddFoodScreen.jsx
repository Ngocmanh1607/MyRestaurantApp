import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import Snackbar from 'react-native-snackbar';
import { uploadFoodImage } from '../../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFoodInApi } from '../../api/foodApi';
import { getCategories } from '../../api/restaurantApi';
import styles from '../../assets/css/AddFoodStyle';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
const AddFoodScreen = () => {
  const navigation = useNavigation();
  const [foodData, setFoodData] = useState({
    name: '',
    descriptions: '',
    categories: [],
    price: '',
    number: '',
    image: null,
    options: [{ topping_name: '', price: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setFoodData({ ...foodData, image: response.assets[0].uri });
      }
    });
  };
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        if (categories.success) setAllCategories(categories.data);
        else {
          Alert.alert('Lỗi', categories.message);
          return;
        }
      } catch (error) {
        Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
        setAllCategories([]);
      }
    };
    fetchUserId();
    fetchCategories();
  }, []);
  const uploadImage = async (name, imageUrl) => {
    try {
      const foodImage = await uploadFoodImage(userId, name, imageUrl);
      return foodImage;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Firebase:', error);
      Snackbar.show({
        text: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return null;
    }
  };
  const handleChange = (field, value) => {
    setFoodData({ ...foodData, [field]: value });
  };

  const toggleCategory = (categoryId) => {
    setFoodData((prevData) => {
      const updatedCategories = prevData.categories.includes(categoryId)
        ? prevData.categories.filter((id) => id !== categoryId)
        : [...prevData.categories, categoryId];
      return { ...prevData, categories: updatedCategories };
    });
  };

  const addOption = () => {
    setFoodData({
      ...foodData,
      options: [...foodData.options, { name: '', price: '' }],
    });
  };

  const handleSave = async () => {
    validateInputs();
    try {
      setIsLoading(true);
      const uploadedImageUrl = await uploadImage(foodData.name, foodData.image);
      if (uploadedImageUrl) {
        const updatedFoodData = { ...foodData, image: uploadedImageUrl };
        const response = await createFoodInApi(updatedFoodData);
        if (response.success) {
          Snackbar.show({
            text: 'Lưu thành công!',
            duration: Snackbar.LENGTH_SHORT,
          });
          setFoodData({
            name: '',
            descriptions: '',
            categories: [],
            price: '',
            number: '',
            image: null,
            options: [{ topping_name: '', price: '' }],
          });
        } else {
          if (response.message === 500) {
            Alert.alert(
              'Đã xảy ra lỗi',
              'Hết phiên làm việc, vui lòng đăng nhập lại',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Auth' }],
                    }),
                },
              ]
            );
          } else {
            Alert.alert('Đã xảy ra lỗi', response.message);
            return;
          }
        }
      }
    } catch (error) {
      Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!foodData.image) {
      Snackbar.show({
        text: 'Vui lòng thêm ảnh món ăn.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!foodData.name.trim()) {
      Snackbar.show({
        text: 'Vui lòng nhập tên món ăn.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!foodData.price.trim() || isNaN(foodData.price)) {
      Snackbar.show({
        text: 'Vui lòng nhập giá hợp lệ.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!foodData.descriptions.trim()) {
      Snackbar.show({
        text: 'Vui lòng nhập mô tả món ăn.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (foodData.categories.length === 0) {
      Snackbar.show({
        text: 'Vui lòng chọn ít nhất một danh mục.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    return true;
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = foodData.options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    setFoodData({ ...foodData, options: newOptions });
  };

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Image Picker */}
          <TouchableOpacity
            onPress={handleSelectImage}
            style={styles.imagePicker}>
            {foodData.image ? (
              <Image source={{ uri: foodData.image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Chọn ảnh món ăn</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <TextInput
              mode="outlined"
              label="Tên món"
              activeOutlineColor="#FF6347"
              textColor="#333"
              style={styles.input}
              value={foodData.name}
              onChangeText={(value) => handleChange('name', value)}
              outlineStyle={styles.inputOutline}
            />

            <TextInput
              mode="outlined"
              label="Mô tả"
              activeOutlineColor="#FF6347"
              textColor="#333"
              style={styles.textArea}
              value={foodData.descriptions}
              onChangeText={(value) => handleChange('descriptions', value)}
              multiline
              numberOfLines={4}
              outlineStyle={styles.inputOutline}
            />

            <View style={styles.priceRow}>
              <TextInput
                mode="outlined"
                label="Giá gốc"
                textColor="#333"
                activeOutlineColor="#FF6347"
                style={[styles.input, styles.halfInput]}
                value={foodData.price}
                onChangeText={(value) => handleChange('price', value)}
                keyboardType="numeric"
                outlineStyle={styles.inputOutline}
                left={<TextInput.Affix text="₫" />}
              />
              <TextInput
                mode="outlined"
                label="Số lượng"
                textColor="#333"
                activeOutlineColor="#FF6347"
                style={[styles.input, styles.halfInput]}
                value={foodData.number}
                onChangeText={(value) => handleChange('number', value)}
                keyboardType="number"
                outlineStyle={styles.inputOutline}
              />
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn danh mục *</Text>
            <View style={styles.categoriesContainer}>
              {allCategories.map((category) => (
                <View key={category.id} style={styles.checkboxContainer}>
                  <CheckBox
                    value={foodData.categories.includes(category.id)}
                    onValueChange={() => toggleCategory(category.id)}
                    style={styles.checkbox}
                    tintColors={{ true: '#FF6347', false: '#666' }}
                  />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Options Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Các lựa chọn khác</Text>
            {foodData.options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  mode="outlined"
                  label="Tên lựa chọn"
                  textColor="#333"
                  activeOutlineColor="#FF6347"
                  style={styles.optionName}
                  value={option.topping_name}
                  onChangeText={(value) =>
                    handleOptionChange(index, 'topping_name', value)
                  }
                  outlineStyle={styles.inputOutline}
                />
                <TextInput
                  mode="outlined"
                  label="Giá"
                  textColor="#333"
                  activeOutlineColor="#FF6347"
                  style={styles.optionPrice}
                  value={option.price}
                  onChangeText={(value) =>
                    handleOptionChange(index, 'price', value)
                  }
                  keyboardType="numeric"
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Affix text="₫" />}
                />
              </View>
            ))}

            <TouchableOpacity onPress={addOption} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Thêm lựa chọn</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Lưu</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};
export default AddFoodScreen;
