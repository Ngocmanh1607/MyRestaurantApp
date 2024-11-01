import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import CheckBox from '@react-native-community/checkbox'
import Snackbar from 'react-native-snackbar'
import { getCategoryFood, getToppingFood } from '../api/foodApi'
import { uploadFoodImage } from '../utils/firebaseUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { selectImage } from '../utils/utilsRestaurant'

const EditFoodScreen = ({ route }) => {
    const { food } = route.params
    console.log(food)
    const [foodData, setFoodData] = useState({
        id: food.id,
        name: food.name,
        descriptions: food.descriptions,
        categories: [],
        price: food.price,
        image: food.image,
        toppings: [{ topping_name: '', price: '' }],
    });
    const [originalFoodData, setOriginalFoodData] = useState({});
    const [toppings, setToppings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId);
        };
        fetchUserId()
    }, [])
    useEffect(() => {
        const fetchDataFood = async () => {
            setIsLoading(true);
            try {
                const toppingData = await getToppingFood(foodData.id)
                const categoryData = await getCategoryFood(foodData.id)
                setToppings(toppingData)
                setCategories(categoryData)
                setFoodData(prevData => ({
                    ...prevData,
                    categories: categoryData,
                    toppings: toppingData
                }));
            } catch (error) {
                console.error("Error fetching toppings or categories: ", error);
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchDataFood()
    }, [])
    const chooseImage = async () => {
        try {
            const imageUri = await selectImage();
            if (imageUri) {
                setFoodData((prev) => ({ ...prev, image: imageUri }));
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };
    const handleChange = (field, value) => {
        setFoodData({ ...foodData, [field]: value })
    }
    const handleToppingChange = (index, field, value) => {
        const updateToppings = [...toppings];
        updateToppings[index][field] = value;
        setToppings(updateToppings)
        console.log(toppings)
    }
    const addNewTopping = () => {
        const newTopping = { id: toppings.length + 1, topping_name: '', price: '' };
        setToppings([...toppings, newTopping]);
    };
    const toggleEditMode = () => {
        if (isEditing) {
            updateFoodData();
        } else {
            setOriginalFoodData({ ...foodData });
            setIsEditing(true);
        }
    };
    const uploadFirebase = async (name, imageUrl) => {
        try {
            const foodImage = await uploadFoodImage(userId, name, imageUrl);
            return foodImage;
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên Firebase:", error);
            Snackbar.show({ text: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.', duration: Snackbar.LENGTH_SHORT });
            return null;
        }
        finally {
            setIsLoading(false)
        }
    }
    const updateFoodData = async () => {
        setIsLoading(true)
        try {
            // await yourUpdateFoodApi(foodData); // Gọi API cập nhật
            setIsEditing(false);
            Snackbar.show({ text: 'Cập nhật thành công!', duration: Snackbar.LENGTH_SHORT });
        } catch (error) {
            console.error("Error updating food data: ", error);
            setFoodData({ ...originalFoodData }); // Khôi phục dữ liệu cũ nếu cập nhật thất bại
            setIsEditing(false);
            Snackbar.show({ text: 'Cập nhật thất bại, dữ liệu cũ được khôi phục.', duration: Snackbar.LENGTH_SHORT });
        } finally {
            setIsLoading(false)
        }
    };
    return (
        <View style={{ flex: 1 }}>
            {
                isLoading ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF0000" />
                </View>) : (
                    <KeyboardAvoidingView style={styles.container}>
                        <View style={styles.container}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                                <ScrollView style={styles.mainContainer}>
                                    {/* Ảnh món ăn */}
                                    <View style={styles.infContainer}>
                                        <Text style={styles.textLeft}>Ảnh món ăn</Text>
                                        <TouchableOpacity
                                            onPress={isEditing ? chooseImage : null}
                                            disabled={!isEditing}
                                            style={{ marginBottom: 10, marginEnd: 5 }}
                                        >
                                            <Image
                                                style={styles.foodImage}
                                                source={{ uri: foodData.image }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {/* Tên món */}
                                    <View style={styles.infContainer}>
                                        <Text style={styles.textLeft}>Tên món</Text>
                                        <TextInput
                                            style={[styles.textRight, styles.smallInput]}
                                            value={foodData.name}
                                            onChangeText={(value) => handleChange('name', value)}
                                            editable={isEditing}
                                        />
                                    </View>
                                    {/* Giá món ăn */}
                                    <View style={styles.infContainer}>
                                        <Text style={styles.textLeft}>Giá</Text>
                                        <TextInput
                                            style={[styles.textRight, styles.smallInput]}
                                            value={foodData.price.toString()}
                                            onChangeText={(value) => handleChange('price', value)}
                                            editable={isEditing}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    {/* Mô tả */}
                                    <View style={styles.infContainer}>
                                        <Text style={styles.textLeft}>Mô tả</Text>
                                        <TextInput
                                            style={[styles.textRight, styles.descriptionInput]}
                                            value={foodData.descriptions}
                                            onChangeText={(value) => handleChange('descriptions', value)}
                                            editable={isEditing}
                                            multiline={true}
                                        />
                                    </View>
                                    {/* Nhóm món ăn */}
                                    <View style={styles.infContainer}>
                                        <Text style={styles.textLeft}>Nhóm</Text>
                                        <TextInput
                                            style={[styles.textRight, styles.smallInput]}
                                            value={foodData.categories.join(', ')}
                                            onChangeText={(value) => handleChange('categories', value)}
                                            editable={isEditing}
                                        />
                                    </View>
                                    {/* Topping */}
                                    <View>
                                        <Text style={styles.textLeft}>Toppings</Text>
                                        {toppings.map((topping, index) => (
                                            <View key={topping.id} style={styles.toppingContainer}>
                                                <TextInput
                                                    style={styles.toppingName}
                                                    value={topping.topping_name}
                                                    placeholder="Tên topping"
                                                    onChangeText={(value) => handleToppingChange(index, 'topping_name', value)}
                                                    editable={isEditing}
                                                />
                                                <TextInput
                                                    style={styles.toppingPrice}
                                                    value={topping.price.toString()}
                                                    placeholder="Giá"
                                                    editable={isEditing}
                                                    onChangeText={(value) => handleToppingChange(index, 'price', value)}
                                                    keyboardType='numeric'
                                                />
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity onPress={() => { isEditing ? addNewTopping() : null }} style={styles.addButton}>
                                        <Text style={[styles.addButtonText, { color: isEditing ? '#007bff' : '#666' }]}>+ Thêm lựa chọn</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </TouchableWithoutFeedback>

                            <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                                <Text style={styles.editButtonText}>
                                    {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                )
            }
        </View>
    )
}

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
    }
});