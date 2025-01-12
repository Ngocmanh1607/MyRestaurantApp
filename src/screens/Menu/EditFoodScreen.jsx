import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import CheckBox from '@react-native-community/checkbox'
import Snackbar from 'react-native-snackbar'
import { getCategoryFood, getToppingFood,updateFoodInApi } from '../api/foodApi'
import { uploadFoodImage } from '../../utils/firebaseUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { selectImage } from '../../utils/utilsRestaurant'
import { getCategories } from '../../api/restaurantApi'
import formatPrice from '../../utils/formatPrice'
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
    const [isLoading, setIsLoading] = useState(false);
    const [allCategories, setAllCategories] = useState([]);

    // Fetch initial data
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) throw new Error('User không tồn tại');
            setUserId(storedUserId);

            // Fetch all data in parallel
            const [categoriesData, toppingData, foodCategories] = await Promise.all([
                getCategories(),
                getToppingFood(foodData.id),
                getCategoryFood(foodData.id)
            ]);

            setAllCategories(categoriesData);
            setToppings(toppingData);
            const currentCats = categoriesData.filter(cat =>
                foodCategories.includes(cat.id)
            );
            setCurrentCategories(currentCats);
            const selectedCategoriesId = foodCategories.map(category => category.id);

            setSelectedCategories(selectedCategoriesId);

            setFoodData(prev => ({
                ...prev,
                categories: foodCategories,
                toppings: toppingData
            }));

            setOriginalFoodData({
                ...foodData,
                categories: foodCategories,
                toppings: toppingData
            });
        } catch (error) {
            console.error("Lấy dữ liệu lỗi :", error);
            showError("Lấy dữ liệu lỗi");
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
            console.error("Lỗi :", error);
            throw error;
        }
    };

    const chooseImage = async () => {
        try {
            const imageUri = await selectImage();
            if (imageUri) {
                setIsLoading(true);
                const uploadedImageUrl = await handleImageUpload(imageUri);
                setFoodData(prev => ({ ...prev, image: uploadedImageUrl }));
            }
        } catch (error) {
            showError('Cập nhật ảnh thất bại. Thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFoodData(prev => ({ ...prev, [field]: value }));
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
            food_id: foodData.id
        };
        setToppings([...toppings, newTopping]);
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];

            const newCurrentCategories = allCategories.filter(cat =>
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
                toppings: toppings.map(topping => ({
                    ...topping,
                    price: parseFloat(topping.price)
                }))
            };

            await updateFoodInApi(updateData);

            setIsEditing(false);
            showSuccess('Food updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error("Error updating food:", error);
            setFoodData(originalFoodData);
            setSelectedCategories(originalFoodData.categories);
            setToppings(originalFoodData.toppings);
            showError('Failed to update food. Changes reverted.');
        } finally {
            setIsLoading(false);
        }
    };

    // Utility functions
    const showError = (message) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#ff0000'
        });
    };

    const showSuccess = (message) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#28a745'
        });
    };

    const toggleEditMode = () => {
        if (isEditing) {
            Alert.alert(
                'Lưu thay đổi',
                'Bạn có chắc lưu thay đổi không ?',
                [
                    {
                        text: 'Huỷ',
                        style: 'cancel',
                    },
                    {
                        text: 'Lưu',
                        onPress: updateFoodData
                    },
                ]
            );
        } else {
            setOriginalFoodData({ ...foodData });
            setIsEditing(true);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF0000" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView style={styles.mainContainer}>
                            {/* Image Section */}
                            <View style={styles.infContainer}>
                                <Text style={styles.textLeft}>Ảnh món ăn</Text>
                                <TouchableOpacity
                                    onPress={isEditing ? chooseImage : null}
                                    disabled={!isEditing || isLoading.uploadingImage}
                                    style={styles.imageContainer}
                                >
                                    {isLoading.uploadingImage ? (
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <ActivityIndicator size="small" color="#FF0000" />
                                        </View>
                                    ) : (
                                        <Image
                                            style={styles.foodImage}
                                            source={{ uri: foodData.image }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Name Input */}
                            <View style={styles.infContainer}>
                                <Text style={styles.textLeft}>Tên sản phẩm *</Text>
                                <TextInput
                                    style={[styles.textRight, styles.smallInput]}
                                    value={foodData.name}
                                    onChangeText={(value) => handleChange('name', value)}
                                    editable={isEditing}
                                    placeholder="Enter food name"
                                />
                            </View>

                            {/* Price Input */}
                            <View style={styles.infContainer}>
                                <Text style={styles.textLeft}>Giá *</Text>
                                <TextInput
                                    style={[styles.textRight, styles.smallInput]}
                                    value={formatPrice(foodData.price)}
                                    onChangeText={(value) => handleChange('price', value)}
                                    editable={isEditing}
                                    keyboardType='numeric'
                                    placeholder="Enter price"
                                />
                            </View>

                            {/* Description Input */}
                            <View style={styles.infContainer}>
                                <Text style={styles.textLeft}>Mô tả *</Text>
                                <TextInput
                                    style={[styles.textRight, styles.descriptionInput]}
                                    value={foodData.descriptions}
                                    onChangeText={(value) => handleChange('descriptions', value)}
                                    editable={isEditing}
                                    multiline={true}
                                    placeholder="Enter description"
                                />
                            </View>

                            {/* Categories Section */}
                            <Text style={[styles.sectionTitle, { marginLeft: 15, fontSize: 15, marginTop: 10 }]}>Categories *</Text>
                            {allCategories.map(category => (
                                <View key={category.id} style={styles.checkboxContainer}>
                                    <CheckBox
                                        style={styles.checkbox}
                                        disabled={!isEditing}
                                        value={foodData.categories.some(cate => cate.id === category.id)}
                                        onValueChange={() => toggleCategory(category.id)}
                                    />
                                    <Text style={styles.categoryText}>{category.name}</Text>
                                </View>
                            ))}

                            {/* Toppings Section */}
                            <View style={styles.toppingsSection}>
                                <Text style={{ marginLeft: 15, fontSize: 15, marginTop: 10 }}>Toppings</Text>
                                {toppings.map((topping, index) => (
                                    <View key={topping.id} style={styles.toppingContainer}>
                                        <TextInput
                                            style={styles.toppingName}
                                            value={topping.topping_name}
                                            placeholder="Topping name"
                                            onChangeText={(value) => handleToppingChange(index, 'topping_name', value)}
                                            editable={isEditing}
                                        />
                                        <TextInput
                                            style={styles.toppingPrice}
                                            value={formatPrice(topping.price)}
                                            placeholder="Price"
                                            editable={isEditing}
                                            onChangeText={(value) => handleToppingChange(index, 'price', value)}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                ))}

                                {isEditing && (
                                    <TouchableOpacity
                                        onPress={addNewTopping}
                                        style={styles.addButton}
                                    >
                                        <Text style={styles.addButtonText}>+ Thêm topping</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>

                    <TouchableOpacity
                        style={[
                            styles.editButton,
                            isLoading && styles.editButtonDisabled
                        ]}
                        onPress={toggleEditMode}
                        disabled={isLoading}
                    >
                        <Text style={styles.editButtonText}>
                            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditFoodScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 5,
    },
    mainContainer: {
        backgroundColor: '#FFF'
    },
    infContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        padding: 10,
        margin: 10
    },
    foodImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    textLeft: {
        color: '#A0A0A0',
        fontSize: 16,
    },
    textRight: {
        fontSize: 16,
        textAlign: 'right',
    },
    smallInput: {
        borderColor: '#F0F0F0',
    },
    descriptionInput: {
        width: '70%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    toppingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 10
    },
    toppingName: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flex: 1,
        marginRight: 10,
    },
    toppingPrice: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        width: 80,
        textAlign: 'right',
        marginRight: 5,
    },
    addButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        fontSize: 16,
    },
    editButton: {
        margin: 20,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#FF0000',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
    }
});