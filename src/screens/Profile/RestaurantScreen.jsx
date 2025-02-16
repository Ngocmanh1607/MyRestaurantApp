import React, { useEffect, useState } from 'react';
import {  Text, View, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../access/css/RestaurantStyle';
import { selectImage, uploadImage } from '../utils/utilsRestaurant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getInformationRes } from '../../api/restaurantApi';


const RestaurantProfileScreen = () => {
    const navigation = useNavigation();
    const [restaurant, setRestaurant] = useState(
        {
            name: '',
            image: '',
            address: '',
            opening_hours: [],
            phone_number: '',
            description: '',
            address_x: '',
            address_y: '',
        }
    );
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    const [imageChange, setImageChange] = useState(false);
    const [orginalImage, setOriginalImage] = useState('');
    const route = useRoute();
    const location = route.params?.location;
    //Lấy thông tin nhà hàng
    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            try {
                setLoading(true);
                const response = await getInformationRes(navigation);
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
            } catch (error) {
                Snackbar.show({
                    text: error.message,
                    duration: Snackbar.LENGTH_SHORT
                })
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchRestaurantInfo();
    }, []);
    //Lấy thông tin userId
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId);
        };

        fetchUserId();
    }, []);
    useEffect(() => {
        if (location) {
            setRestaurant({ ...restaurant, address: location.address, address_x: location.latitude, address_y: location.longitude })
        }
    }, [location]);
    const handelSelectImage = async () => {
        if (isEditing) {
            try {
                const uri = await selectImage();
                setRestaurant({ ...restaurant, image: uri });
                setImageChange(true);
            }
            catch (error) {
                console.error('Lỗi chọn ảnh:', error);
            }
        }
    };

    // Function để upload ảnh lên Firebase và lưu URL xuống Firestore
    const handelUploadImage = async () => {
        try {
            const UrlImage = await uploadImage(userId, restaurant.image)
            if (UrlImage) {
                setRestaurant(prev => ({ ...prev, image: UrlImage }));
                return UrlImage
            }
        } catch (error) {
            Snackbar.show({
                text: 'Không thể tải ảnh lên, vui lòng thử lại.',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };
    const updateRestaurantInfo = async (imageUrl = null) => {
        try {
            let updatedOpeningHours = restaurant.opening_hours;
            if (typeof restaurant.opening_hours === 'object') {
                updatedOpeningHours = JSON.stringify(restaurant.opening_hours);
            }

            const updatedData = {
                ...restaurant,
                image: imageUrl || restaurant.image,
                opening_hours: updatedOpeningHours
            };

            const response = await updateRestaurantInfo(updatedData);
            if (response) {
                Snackbar.show({
                    text: 'Thông tin nhà hàng đã được cập nhật!',
                    duration: Snackbar.LENGTH_SHORT,
                });
                setImageChange(false);
                setOriginalImage(updatedData.image);
            }
            return true;
        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            Snackbar.show({
                text: 'Có lỗi xảy ra khi cập nhật thông tin.',
                duration: Snackbar.LENGTH_SHORT,
            });
            return false;
        }
    };
    const validateRestaurantData = () => {
        // Kiểm tra tên nhà hàng
        if (!restaurant.name.trim()) {
            Snackbar.show({
                text: 'Tên nhà hàng không được để trống.',
                duration: Snackbar.LENGTH_SHORT,
            });
            return false;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(restaurant.phone_number)) {
            Snackbar.show({
                text: 'Số điện thoại không hợp lệ (chỉ chứa số, từ 10-15 ký tự).',
                duration: Snackbar.LENGTH_SHORT,
            });
            return false;
        }
        // Kiểm tra mô tả
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
            // Kiểm tra dữ liệu
            if (!validateRestaurantData()) {
                return;
            }
            // Hiển thị thông báo xác nhận
            Alert.alert(
                'Xác nhận',
                'Bạn có chắc chắn muốn lưu thay đổi?',
                [
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
                                    setRestaurant(prev => ({ ...prev, image: orginalImage }));
                                }
                            } catch (error) {
                                console.error('Lỗi:', error);
                                Snackbar.show({
                                    text: 'Có lỗi xảy ra, vui lòng thử lại.',
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } else {
            setIsEditing(!isEditing);
        }
    };
    // // Hàm cập nhật giờ mở và đóng cửa
    const updateWorkingHours = (day, field, value) => {
        const updatedHours = restaurant.opening_hours.map(item =>
            item.day === day ? { ...item, [field]: value } : item
        );
        setRestaurant({ ...restaurant, opening_hours: updatedHours });
    };
    const handleUpdateAddress = () => {
        navigation.navigate('Địa chỉ', {
            targetScreen: 'Hồ Sơ'
        });
    }
    return (
        <View style={styles.container}>
            {loading ? (<View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF0000" />
            </View>) :
                <>
                    <ScrollView>
                        {/* Hồ sơ nhà hàng */}
                        <View style={styles.profileSection}>
                            {/* Food Image */}
                            <TouchableOpacity onPress={handelSelectImage} style={styles.imagePicker}>
                                {restaurant.image ? (
                                    <Image source={{ uri: restaurant.image }} style={styles.image} />
                                ) : (
                                    <Text style={styles.imagePlaceholderText}>Chọn ảnh nhà hàng</Text>
                                )}
                            </TouchableOpacity>
                            {/* Food Name */}
                            <View style={styles.profileInfo}>
                                <Text style={styles.label}>Tên nhà hàng:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={restaurant.name}
                                    editable={isEditing}
                                    onChangeText={(text) => setRestaurant({ ...restaurant, name: text })}
                                />
                            </View>
                            {/* Food address */}
                            <View style={styles.profileInfo}>
                                <Text style={styles.label}>Địa chỉ:</Text>
                                <TouchableOpacity style={styles.addressContainer} onPress={() => {
                                    if (isEditing)
                                        handleUpdateAddress()
                                }}>
                                    <Text style={styles.input}>
                                        {restaurant.address}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Food Phone */}
                            <View style={styles.profileInfo}>
                                <Text style={styles.label}>Số điện thoại:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={restaurant.phone_number}
                                    editable={isEditing}
                                    onChangeText={(text) => setRestaurant({ ...restaurant, phone_number: text })}
                                />
                            </View>
                            {/* Food Description */}
                            <View style={styles.profileInfo}>
                                <Text style={styles.label}>Mô tả:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={restaurant.description}
                                    editable={isEditing}
                                    onChangeText={(text) => setRestaurant({ ...restaurant, description: text })}
                                    multiline
                                />
                            </View>
                            {/* Giờ hoạt động */}
                            <View style={styles.workingHoursSection}>
                                <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
                                {restaurant.opening_hours.map((item) => (
                                    <View key={item.day} style={styles.workingHoursRow}>
                                        <Text style={styles.workingHoursDay}>{item.day}:</Text>
                                        <TextInput
                                            style={styles.workingHoursInput}
                                            value={item.open}
                                            onChangeText={(value) => updateWorkingHours(item.day, 'open', value)}
                                            editable={isEditing}
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.workingHoursText}> - </Text>
                                        <TextInput
                                            style={styles.workingHoursInput}
                                            value={item.close}
                                            onChangeText={(value) => updateWorkingHours(item.day, 'close', value)}
                                            editable={isEditing}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                        <Text style={styles.editButtonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
                    </TouchableOpacity>
                </>
            }
        </View>
    );
};

export default RestaurantProfileScreen;