import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Snackbar from 'react-native-snackbar';

const screenWidth = Dimensions.get("window").width;

const RestaurantProfileScreen = () => {
    const [restaurant, setRestaurant] = useState({
        name: 'Nhà hàng ABC',
        address: '123 Đường Thành Công, TP.HCM',
        phone: '0901234567',
        description: 'Chuyên phục vụ các món ăn ngon và chất lượng.',
        type: 'Đồ uống'
    });

    const [isEditing, setIsEditing] = useState(false);

    const [dailySales, setDailySales] = useState([150000, 200000, 180000, 250000, 120000]);
    const [weeklySales, setWeeklySales] = useState([800000, 900000, 850000, 700000, 950000]);

    // Giờ hoạt động theo tuần
    const [workingHours, setWorkingHours] = useState([
        { day: 'Thứ 2', open: '08:00', close: '22:00' },
        { day: 'Thứ 3', open: '08:00', close: '22:00' },
        { day: 'Thứ 4', open: '08:00', close: '22:00' },
        { day: 'Thứ 5', open: '08:00', close: '22:00' },
        { day: 'Thứ 6', open: '08:00', close: '22:00' },
        { day: 'Thứ 7', open: '08:00', close: '23:00' },
        { day: 'Chủ nhật', open: '09:00', close: '23:00' },
    ]);


    // Hàm xử lý khi nhấn nút chỉnh sửa/lưu
    const toggleEditMode = () => {
        if (isEditing) {
            Snackbar.show({
                text: 'Hồ sơ đã được cập nhật!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        setIsEditing(!isEditing);
    };

    // Hàm cập nhật giờ mở và đóng cửa
    const updateWorkingHours = (day, field, value) => {
        const updatedHours = workingHours.map(item =>
            item.day === day ? { ...item, [field]: value } : item
        );
        setWorkingHours(updatedHours);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Hồ sơ nhà hàng */}
                <View style={styles.profileSection}>
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Tên nhà hàng:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.name}
                            editable={isEditing}
                            onChangeText={(text) => setRestaurant({ ...restaurant, name: text })}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Địa chỉ:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.address}
                            editable={isEditing}
                            onChangeText={(text) => setRestaurant({ ...restaurant, address: text })}
                        />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Số điện thoại:</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.phone}
                            editable={isEditing}
                            onChangeText={(text) => setRestaurant({ ...restaurant, phone: text })}
                        />
                    </View>

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
                    <View style={styles.profileInfo}>
                        <Text style={styles.label}>Loại nhà hàng</Text>
                        <TextInput
                            style={styles.input}
                            value={restaurant.type}
                            editable={isEditing}
                            onChangeText={(text) => setRestaurant({ ...restaurant, type: text })}
                        />
                    </View>
                    {/* Giờ hoạt động */}
                    <View style={styles.workingHoursSection}>
                        <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
                        {workingHours.map((item) => (
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
            {/* Nút chỉnh sửa */}
            <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                <Text style={styles.editButtonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default RestaurantProfileScreen;

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
});
