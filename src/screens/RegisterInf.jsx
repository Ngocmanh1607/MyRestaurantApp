import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { uploadRestaurantImage } from '../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateRestaurantApi } from '../api/restaurantApi';
import { useNavigation } from '@react-navigation/native';
import { selectImage, uploadImage } from '../utils/utilsRestaurant';

const RegisterInf = () => {
    const navigation = useNavigation()
    const [restaurant, setRestaurant] = useState({
        name: '',
        image: '',
        address: '',
        opening_hours: '',
        phone_number: '',
        description: '',
    });

    const [userId, setUserId] = useState(null);
    //Lấy thông tin userID
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId);  // Now the userId is available to use
        };

        fetchUserId();
    }, []);

    const [workingHours, setWorkingHours] = useState([
        { day: 'Thứ 2', open: '08:00', close: '22:00' },
        { day: 'Thứ 3', open: '08:00', close: '22:00' },
        { day: 'Thứ 4', open: '08:00', close: '22:00' },
        { day: 'Thứ 5', open: '08:00', close: '22:00' },
        { day: 'Thứ 6', open: '08:00', close: '22:00' },
        { day: 'Thứ 7', open: '08:00', close: '23:00' },
        { day: 'Chủ nhật', open: '09:00', close: '23:00' },
    ]);

    const handelSelectImage = async () => {
        try {
            const uri = await selectImage();
            setRestaurant({ ...restaurant, image: uri })
        }
        catch (error) {
            console.error('Lỗi chọn ảnh:', error);
        }
    };
    const handelUploadImage = async () => {
        try {
            const UrlImage = await uploadImage(userId, restaurant.image)
            if (UrlImage) { // Kiểm tra nếu có kết quả URL
                return UrlImage
            }
        } catch (error) {

        }
    };

    const toggleEditMode = async () => {
        const workingHoursString = JSON.stringify(workingHours);
        const imageUrl = await handelUploadImage();
        if (imageUrl) {
            const updatedRestaurant = {
                ...restaurant,
                image: imageUrl,
                opening_hours: workingHoursString,
            };
            try {
                const response = await updateRestaurantApi(updatedRestaurant);
                if (response) {
                    Snackbar.show({
                        text: 'Thông tin nhà hàng đã được cập nhật!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    navigation.navigate('Trang chủ')
                } else {
                    Snackbar.show({
                        text: 'Cập nhật thất bại, vui lòng thử lại.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            } catch (error) {
                console.error('API update failed: ', error);
                Snackbar.show({
                    text: 'Có lỗi xảy ra, vui lòng thử lại.',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }
    };

    const updateWorkingHours = (day, field, value) => {
        const updatedHours = workingHours.map(item =>
            item.day === day ? { ...item, [field]: value } : item
        );
        setWorkingHours(updatedHours);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={handelSelectImage} style={styles.imagePicker}>
                        {restaurant.image ? (
                            <Image source={{ uri: restaurant.image }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholderText}>Chọn ảnh nhà hàng</Text>
                        )}
                    </TouchableOpacity>
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Tên nhà hàng:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.name}
                            onChangeText={(text) => setRestaurant({ ...restaurant, name: text })}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Địa chỉ:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.address}
                            onChangeText={(text) => setRestaurant({ ...restaurant, address: text })}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Số điện thoại:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.phone_number}
                            onChangeText={(text) => setRestaurant({ ...restaurant, phone_number: text })}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Mô tả:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.description}
                            onChangeText={(text) => setRestaurant({ ...restaurant, description: text })}
                            multiline
                        />
                    </View>

                    <View style={styles.workingHoursSection}>
                        <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
                        {workingHours.map((item) => (
                            <View key={item.day} style={styles.workingHoursRow}>
                                <Text style={styles.workingHoursDay}>{item.day}:</Text>
                                <TextInput
                                    style={styles.workingHoursInput}
                                    value={item.open}
                                    onChangeText={(value) => updateWorkingHours(item.day, 'open', value)}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.workingHoursText}> - </Text>
                                <TextInput
                                    style={styles.workingHoursInput}
                                    value={item.close}
                                    onChangeText={(value) => updateWorkingHours(item.day, 'close', value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                <Text style={styles.editButtonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterInf;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
