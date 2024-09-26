import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker
import Snackbar from 'react-native-snackbar'
const AddFoodScreen = () => {
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [customGroup, setCustomGroup] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [foodImage, setFoodImage] = useState(null); // State to hold selected image

    // Options state: An array where each object holds name and price of the option
    const [options, setOptions] = useState([{ name: '', price: '' }]);

    // Function to handle image selection
    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const selectedImage = response.assets[0];
                setFoodImage(selectedImage.uri); // Set image URI to state
            }
        });
    };

    // Function to handle adding new option
    const addOption = () => {
        setOptions([...options, { name: '', price: '' }]);
    };
    const handleSave = () => {
        if (validateInputs()) {
            Snackbar.show({ text: 'Lưu thành công!', duration: Snackbar.LENGTH_SHORT });
            // Reset các state về giá trị mặc định
            setFoodImage(null);
            setFoodName('');
            setBasePrice('');
            setCategory('');
            setDescription('');
        }
    };
    const validateInputs = () => {
        if (!foodName.trim()) {
            Snackbar.show({ text: 'Vui lòng nhập tên món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (!basePrice.trim() || isNaN(basePrice)) {
            Snackbar.show({ text: 'Vui lòng nhập giá hợp lệ.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (!category.trim()) {
            Snackbar.show({ text: 'Vui lòng nhập nhóm món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        if (!description.trim()) {
            Snackbar.show({ text: 'Vui lòng nhập mô tả món ăn.', duration: Snackbar.LENGTH_SHORT });
            return false;
        }
        return true;
    };
    // Function to handle changing option values
    const handleOptionChange = (index, field, value) => {
        const newOptions = options.map((option, i) =>
            i === index ? { ...option, [field]: value } : option
        );
        setOptions(newOptions);
    };

    const submitForm = () => {
        // Handle form submission
        console.log({
            foodName,
            description,
            category,
            customGroup,
            basePrice,
            discountedPrice,
            foodImage, // Include the image URI in the form data
            options, // Include options in the form data
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Food Image */}
            <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
                {foodImage ? (
                    <Image source={{ uri: foodImage }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholderText}>Chọn ảnh món ăn</Text>
                )}
            </TouchableOpacity>

            {/* Food Name */}
            <TextInput
                style={styles.input}
                placeholder="Tên món *"
                value={foodName}
                onChangeText={setFoodName}
            />

            {/* Food Description */}
            <TextInput
                style={styles.textArea}
                placeholder="Mô tả món ăn"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            {/* Category Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                >
                    <Picker.Item label="Chọn danh mục *" value={null} />
                    <Picker.Item label="Món ăn" value="mon-an" />
                    <Picker.Item label="Đồ uống" value="do-uong" />
                </Picker>
            </View>

            {/* Create Category Button */}
            <TouchableOpacity style={styles.createCategoryButton}>
                <Text style={styles.createCategoryButtonText}>+ Tạo danh mục</Text>
            </TouchableOpacity>

            {/* Base Price */}
            <TextInput
                style={styles.input}
                placeholder="Giá gốc *"
                value={basePrice}
                onChangeText={setBasePrice}
                keyboardType="numeric"
            />

            {/* Discounted Price */}
            <TextInput
                style={styles.input}
                placeholder="Giá khuyến mãi *"
                value={discountedPrice}
                onChangeText={setDiscountedPrice}
                keyboardType="numeric"
            />

            {/* Options */}
            <Text style={styles.sectionTitle}>Các lựa chọn khác</Text>
            {options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                    <TextInput
                        style={styles.optionName}
                        placeholder="Tên lựa chọn"
                        value={option.name}
                        onChangeText={(value) => handleOptionChange(index, 'name', value)}
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

            {/* Add Option Button */}
            <TouchableOpacity onPress={addOption} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Thêm lựa chọn</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
                <Text style={styles.submitButtonText}>Lưu</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

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
        backgroundColor: '#f0ad4e',
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
});

export default AddFoodScreen;