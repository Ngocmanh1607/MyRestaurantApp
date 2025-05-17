import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/RestaurantStyle';
import { uploadRestaurantImage } from '../../utils/firebaseUtils';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getInformationRes,
  updateRestaurantApi,
} from '../../api/restaurantApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';

const RestaurantProfileScreen = () => {
  const navigation = useNavigation();
  const [restaurant, setRestaurant] = useState({
    name: '',
    image: '',
    address: '',
    opening_hours: [],
    phone_number: '',
    description: '',
    address_x: '',
    address_y: '',
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [imageChange, setImageChange] = useState(false);
  const [orginalImage, setOriginalImage] = useState('');

  const route = useRoute();
  const location = route.params?.location;
  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      const res = await getInformationRes(navigation);
      if (res.success) {
        const response = res.metadata;
        const cleanedData = {
          id: response.id || null,
          name: response.name || 'Tên nhà hàng chưa xác định',
          address: response.address || 'Địa chỉ chưa có',
          phone_number: response.phone_number || 'Số điện thoại chưa có',
          description: response.description || 'Chưa có mô tả',
          image: response.image || 'https://via.placeholder.com/150',
          opening_hours: JSON.parse(response.opening_hours || '[]'),
        };

        setRestaurant(cleanedData);
        setOriginalImage(cleanedData.image);
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
        Alert.alert('Lỗi', res.message);
      }
    } catch (error) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_SHORT,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRestaurantInfo();
  }, [navigation]);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (location) {
      setRestaurant((prev) => ({
        ...prev,
        address: location.address,
        address_x: location.latitude,
        address_y: location.longitude,
      }));
    }
  }, [location]);

  const openImagePicker = () => {
    if (isEditing) {
      const options = {
        mediaType: 'photo',
      };
      launchImageLibrary(options, (res) => {
        if (res.assets && res.assets.length > 0) {
          setRestaurant((prev) => ({
            ...prev,
            image: res.assets[0].uri,
          }));
          setImageChange(true);
        }
      });
    }
  };

  const handelSelectImage = async () => {
    if (isEditing) {
      try {
        await openImagePicker();
      } catch (error) {
        console.error('Lỗi chọn ảnh:', error);
      }
    }
  };

  const handelUploadImage = async () => {
    try {
      console.log(restaurant.image);
      const UrlImage = await uploadRestaurantImage(userId, restaurant.image);
      if (UrlImage) {
        setRestaurant((prev) => ({
          ...prev,
          image: UrlImage,
        }));
        return UrlImage;
      }
    } catch (error) {
      Snackbar.show({
        text: 'Không thể tải ảnh lên, vui lòng thử lại.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const updateRestaurantInfo = async (imageUrl) => {
    try {
      let updatedOpeningHours = restaurant.opening_hours;
      if (typeof restaurant.opening_hours === 'object') {
        updatedOpeningHours = JSON.stringify(restaurant.opening_hours);
      }

      const updatedData = {
        ...restaurant,
        image: imageUrl || restaurant.image,
        opening_hours: updatedOpeningHours,
      };

      const response = await updateRestaurantApi(updatedData, navigation);
      if (response.success) {
        Snackbar.show({
          text: 'Thông tin nhà hàng đã được cập nhật!',
          duration: Snackbar.LENGTH_SHORT,
        });
        setImageChange(false);
        setOriginalImage(updatedData.image);
        return true;
      } else {
        Alert.alert('Lỗi', response.message);
        return false;
      }
    } catch (error) {
      console.error('Lỗi cập nhật thông tin:', error.message);
      Snackbar.show({
        text: 'Có lỗi xảy ra khi cập nhật thông tin.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
  };

  const validateRestaurantData = () => {
    if (!restaurant.name.trim()) {
      Snackbar.show({
        text: 'Tên nhà hàng không được để trống.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(restaurant.phone_number)) {
      Snackbar.show({
        text: 'Số điện thoại không hợp lệ (chỉ chứa số, từ 10-15 ký tự).',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    if (restaurant.description.length > 500) {
      Snackbar.show({
        text: 'Mô tả không được vượt quá 500 ký tự.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    return true;
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      if (!validateRestaurantData()) {
        return;
      }

      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn lưu thay đổi?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lưu',
          onPress: async () => {
            setLoading(true);
            try {
              let success;
              if (imageChange) {
                const newImageUrl = await handelUploadImage();
                success = await updateRestaurantInfo(newImageUrl);
              } else {
                success = await updateRestaurantInfo();
              }
              if (!success) {
                setRestaurant((prev) => ({
                  ...prev,
                  image: orginalImage,
                }));
              }
            } catch (error) {
              console.error('Lỗi:', error);
              Snackbar.show({
                text: 'Có lỗi xảy ra, vui lòng thử lại.',
              });
            } finally {
              setLoading(false);
              setIsEditing(false);
            }
          },
        },
      ]);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const updateWorkingHours = (day, field, value) => {
    const updatedHours = restaurant.opening_hours.map((item) =>
      item.day === day ? { ...item, [field]: value } : item
    );
    setRestaurant((prev) => ({
      ...prev,
      opening_hours: updatedHours,
    }));
  };

  const handleUpdateAddress = () => {
    navigation.navigate('Địa chỉ', {
      targetScreen: 'Profile',
      restaurantData: restaurant,
    });
  };

  const handleCancel = () => {
    setIsEditing(!isEditing);
    fetchRestaurantInfo();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={styles.profileSection}>
              <TouchableOpacity
                onPress={handelSelectImage}
                style={styles.imagePicker}
                disabled={!isEditing}>
                {restaurant.image ? (
                  <Image
                    source={{ uri: restaurant.image }}
                    style={styles.image}
                  />
                ) : (
                  <Text style={styles.imagePlaceholderText}>
                    Chọn ảnh nhà hàng
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={styles.label}>Tên nhà hàng:</Text>
                <TextInput
                  style={styles.input}
                  value={restaurant.name}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setRestaurant((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <TouchableOpacity
                  style={styles.addressContainer}
                  editable={isEditing}
                  onPress={() => {
                    if (isEditing) handleUpdateAddress();
                  }}>
                  <Text style={styles.input}>{restaurant.address}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <TextInput
                  style={styles.input}
                  value={restaurant.phone_number}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setRestaurant((prev) => ({ ...prev, phone_number: text }))
                  }
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.label}>Mô tả:</Text>
                <TextInput
                  style={styles.input}
                  value={restaurant.description}
                  editable={isEditing}
                  onChangeText={(text) =>
                    setRestaurant((prev) => ({ ...prev, description: text }))
                  }
                  multiline
                />
              </View>

              <View style={styles.workingHoursSection}>
                <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
                {restaurant.opening_hours.map((item) => (
                  <View key={item.day} style={styles.workingHoursRow}>
                    <Text style={styles.workingHoursDay}>{item.day}:</Text>
                    <TextInput
                      style={styles.workingHoursInput}
                      value={item.open}
                      onChangeText={(value) =>
                        updateWorkingHours(item.day, 'open', value)
                      }
                      editable={isEditing}
                      keyboardType="numeric"
                    />
                    <Text style={styles.workingHoursText}> - </Text>
                    <TextInput
                      style={styles.workingHoursInput}
                      value={item.close}
                      onChangeText={(value) =>
                        updateWorkingHours(item.day, 'close', value)
                      }
                      editable={isEditing}
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={toggleEditMode}>
                <Text style={styles.buttonText}>Lưu</Text>
                <Icon
                  name="save"
                  size={18}
                  color="#fff"
                  style={styles.logoutIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}>
                <Text style={styles.buttonText}>Huỷ</Text>
                <Icon
                  name="times"
                  size={18}
                  color="#fff"
                  style={styles.logoutIcon}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={toggleEditMode}>
                <Text style={styles.buttonText}>Chỉnh sửa</Text>
                <Icon
                  name="edit"
                  size={18}
                  color="#fff"
                  style={styles.logoutIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default RestaurantProfileScreen;
