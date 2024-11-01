import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { uploadRestaurantImage } from '../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInformationRes, updateRestaurantApi } from '../api/restaurantApi';
import { selectImage, uploadImage } from '../utils/utilsRestaurant';


const RestaurantProfileScreen = () => {
    const [restaurant, setRestaurant] = useState(
        {
            name: '',
            image: '',
            address: '',
            opening_hours: [],
            phone_number: '',
            description: '',
        }
    );
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    const [imageChange, setImageChange] = useState(false);
    const [orginalImage, setOriginalImage] = useState('');
    //Lấy thông tin nhà hàng
    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            try {
                setLoading(true)
                const response = await getInformationRes();
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
                    text: 'Lỗi khi tải thông tin nhà hàng',
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

            const response = await updateRestaurantApi(updatedData);
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
    const toggleEditMode = async () => {
        if (isEditing) {
            setLoading(true)
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
        }
        setIsEditing(!isEditing);
    };
    // // Hàm cập nhật giờ mở và đóng cửa
    const updateWorkingHours = (day, field, value) => {
        const updatedHours = restaurant.opening_hours.map(item =>
            item.day === day ? { ...item, [field]: value } : item
        );
        setRestaurant({ ...restaurant, opening_hours: updatedHours });
    };
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
                                <TextInput
                                    style={styles.input}
                                    value={restaurant.address}
                                    editable={isEditing}
                                    onChangeText={(text) => setRestaurant({ ...restaurant, address: text })}
                                />
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
                            {/* <View style={styles.profileInfo}>
                                <Text style={styles.label}>Loại nhà hàng</Text>
                                <TextInput
                                    style={styles.input}
                                    value={restaurant.type}
                                    editable={isEditing}
                                    onChangeText={(text) => setRestaurant({ ...restaurant, type: text })}
                                />
                            </View> */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        marginBottom: 30,
    },
    workingHoursSection: {
        marginBottom: 30,
    },
    salesSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    profileInfo: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    workingHoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    workingHoursDay: {
        flex: 1,
        fontSize: 16,
    },
    workingHoursInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        fontSize: 16,
        textAlign: 'center',
    },
    workingHoursText: {
        fontSize: 16,
    },
    imagePicker: {
        width: 120,
        height: 120,
        backgroundColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    imagePlaceholderText: {
        color: '#888',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});
