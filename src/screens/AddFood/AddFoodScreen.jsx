import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import Snackbar from 'react-native-snackbar'
import CheckBox from '@react-native-community/checkbox';
import { uploadFoodImage } from '../../utils/firebaseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFoodInApi } from '../../api/foodApi';
import { getCategories } from '../../api/restaurantApi';
import styles from '../../access/css/AddFoodStyle';
import { useNavigation } from '@react-navigation/native';
const AddFoodScreen = () => {
    const navigation= useNavigation();
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
                Snackbar.show({text:error,duration:Snackbar.LENGTH_SHORT});
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
        validateInputs();
        try {
            setIsLoading(true)
            const uploadedImageUrl = await uploadFirebase(foodData.name, foodData.image);
            if (uploadedImageUrl) {
                const updatedFoodData = { ...foodData, image: uploadedImageUrl };
                await createFoodInApi(updatedFoodData,navigation);
                Snackbar.show({ text: 'Lưu thành công!', duration: Snackbar.LENGTH_SHORT });
                setFoodData({
                    name: '',
                    descriptions: '',
                    categories: [],
                    price: '',
                    image: null,
                    options: [{ topping_name: '', price: '' }],
                });
        }} catch (error) {
            Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
            setIsLoading(false);
        }
        finally{
            setIsLoading(false);
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
        if (!foodData.descriptions.trim()) {
            Snackbar.show({ text: 'Vui lòng nhập mô tả món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (foodData.categories.length === 0) {
            Snackbar.show({ text: 'Vui lòng chọn ít nhất một danh mục.', duration: Snackbar.LENGTH_SHORT });
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
export default AddFoodScreen;