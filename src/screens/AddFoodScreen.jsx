import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import Snackbar from 'react-native-snackbar'
import CheckBox from '@react-native-community/checkbox';
import { uploadFoodImage } from '../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFoodInApi } from '../api/foodApi';
import { getCategories } from '../api/restaurantApi';
const AddFoodScreen = () => {
    const [foodData, setFoodData] = useState({
        name: '',
        descriptions: '',
        categories: [],
        price: '',
        image: null,
        options: [{ topping_name: '', price: '' }],
    });
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState('')
    const [allCategories, setAllCategories] = useState([])
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
                setAllCategories(categories)
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
                setAllCategories([]);
            }
        };
        fetchUserId();
        fetchCategories();
    }, []);
    const uploadFirebase = async (name, imageUrl) => {
        try {
            const foodImage = await uploadFoodImage(userId, name, imageUrl);
            return foodImage;
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên Firebase:", error);
            Snackbar.show({ text: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.', duration: Snackbar.LENGTH_SHORT });
            return null;
        }
    }
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
        setFoodData({ ...foodData, options: [...foodData.options, { name: '', price: '' }] });
    };

    const handleSave = async () => {
        if (validateInputs()) {
            setIsLoading(true)
            const uploadedImageUrl = await uploadFirebase(foodData.name, foodData.image);
            if (uploadedImageUrl) {
                const updatedFoodData = { ...foodData, image: uploadedImageUrl };
                await createFoodInApi(updatedFoodData);

                Snackbar.show({ text: 'Lưu thành công!', duration: Snackbar.LENGTH_SHORT });
                console.log(updatedFoodData);

                setFoodData({
                    name: '',
                    descriptions: '',
                    categories: [],
                    price: '',
                    image: null,
                    options: [{ topping_name: '', price: '' }],
                });
            } else {
                Snackbar.show({ text: 'Không thể lưu món ăn do lỗi tải ảnh.', duration: Snackbar.LENGTH_SHORT });
            }
            setIsLoading(false)
        }
    };

    const validateInputs = () => {
        if (!foodData.image) {
            Snackbar.show({ text: 'Vui lòng thêm ảnh món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (!foodData.name.trim()) {
            Snackbar.show({ text: 'Vui lòng nhập tên món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (!foodData.price.trim() || isNaN(foodData.price)) {
            Snackbar.show({ text: 'Vui lòng nhập giá hợp lệ.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        // if (!foodData.descriptions.trim()) {
        //     Snackbar.show({ text: 'Vui lòng nhập mô tả món ăn.', duration: Snackbar.LENGTH_SHORT });
        //     return false;
        // }
        // if (foodData.categories.length === 0) {
        //     Snackbar.show({ text: 'Vui lòng chọn ít nhất một danh mục.', duration: Snackbar.LENGTH_SHORT });
        //     return false;
        // }
        return true;
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = foodData.options.map((option, i) =>
            i === index ? { ...option, [field]: value } : option
        );
        setFoodData({ ...foodData, options: newOptions });
    };

    return (
        <View style={{ flex: 1 }}>
            {isLoading ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF0000" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
                        {foodData.image ? (
                            <Image source={{ uri: foodData.image }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholderText}>Chọn ảnh món ăn</Text>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên món *"
                        value={foodData.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />

                    <TextInput
                        style={styles.textArea}
                        placeholder="Mô tả món ăn *"
                        value={foodData.descriptions}
                        onChangeText={(value) => handleChange('descriptions', value)}
                        multiline
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Giá gốc *"
                        value={foodData.price}
                        onChangeText={(value) => handleChange('price', value)}
                        keyboardType="numeric"
                    />

                    <Text style={styles.sectionTitle}>Chọn danh mục *</Text>
                    {allCategories.map(category => (
                        <View key={category.id} style={styles.checkboxContainer}>
                            <CheckBox
                                value={foodData.categories.includes(category.id)}
                                onValueChange={() => toggleCategory(category.id)}
                                style={styles.checkbox}
                            />
                            <Text>{category.name}</Text>
                        </View>
                    ))}

                    <Text style={styles.sectionTitle}>Các lựa chọn khác</Text>
                    {foodData.options.map((option, index) => (
                        <View key={index} style={styles.optionContainer}>
                            <TextInput
                                style={styles.optionName}
                                placeholder="Tên lựa chọn"
                                value={option.topping_name}
                                onChangeText={(value) => handleOptionChange(index, 'topping_name', value)}
                            />
                            <TextInput
                                style={styles.optionPrice}
                                placeholder="Giá"
                                value={option.price}
                                onChangeText={(value) => handleOptionChange(index, 'price', value)}
                                keyboardType="numeric"
                            />
                        </View>
                    ))}

                    <TouchableOpacity onPress={addOption} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Thêm lựa chọn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                        <Text style={styles.submitButtonText}>Lưu</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        height: 100,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    createCategoryButton: {
        backgroundColor: 'transparent',
        padding: 10,
        marginBottom: 20,
    },
    createCategoryButtonText: {
        color: '#007bff',
        fontSize: 16,
        textAlign: 'left',
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    optionName: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginRight: 10,
    },
    optionPrice: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    addButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
    }
});

export default AddFoodScreen;