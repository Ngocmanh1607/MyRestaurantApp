import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import CheckBox from '@react-native-community/checkbox'
import { launchImageLibrary } from 'react-native-image-picker'
import Snackbar from 'react-native-snackbar'

const EditFoodScreen = ({ route }) => {
    const { food } = route.params
    const [imageUri, setImageUri] = useState(null);
    const [image, setImage] = useState(food.image);
    const [name, setName] = useState(food.name);
    const [price, setPrice] = useState(food.price);
    const [discountPrice, setDiscountPrice] = useState(food.discountPrice);
    const [category, setCategory] = useState(food.categoryId);
    const [description, setDescription] = useState(food.description);

    // Danh sách các topping
    const [toppings, setToppings] = useState([
        { id: 1, name: 'Topping 1', price: 5000, discountPrice: 0, selected: true },
        { id: 2, name: 'Topping 2', price: 7000, discountPrice: 0, selected: false },
        { id: 3, name: 'Topping 3', price: 8000, discountPrice: 0, selected: true },
    ]);
    // State để lưu danh sách topping mới do người dùng thêm
    const [newToppings, setNewToppings] = useState([]);

    // Tạo ref cho từng ô input
    const newToppingRefs = useRef([]);

    // State kiểm soát chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);

    // Hàm chọn ảnh (ví dụ với thư viện image-picker)
    const chooseImage = () => {
        const options = {
            mediaType: 'photo', // chỉ chọn ảnh
        };
        const showError = (message) => {
            Snackbar.show({
                text: message,
                duration: Snackbar.LENGTH_SHORT,
            });
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                showError('Bạn đã huỷ chọn ảnh');
            } else if (response.errorCode) {
                showError('Đã xảy ra lỗi: ' + response.errorMessage);
            } else {
                const uri = response.assets[0].uri;
                setImageUri(uri);
            }
        });
    };

    // Hàm thêm một ô mới để nhập topping
    const addNewTopping = () => {
        const newTopping = { id: newToppings.length + 1, name: '', price: '', selected: true };
        setNewToppings([...newToppings, newTopping]);
    };

    // useEffect để focus vào input sau khi thêm topping
    useEffect(() => {
        if (newToppingRefs.current.length > 0) {
            newToppingRefs.current[newToppingRefs.current.length - 1].focus();
        }
    }, [newToppings]);

    // Hàm cập nhật giá trị topping mới khi người dùng nhập
    const updateNewTopping = (id, field, value) => {
        const updatedNewToppings = newToppings.map(topping =>
            topping.id === id ? { ...topping, [field]: value } : topping
        );
        setNewToppings(updatedNewToppings);
    };

    // Hàm cập nhật topping đã tồn tại
    const updateTopping = (id, field, value) => {
        const updatedToppings = toppings.map(topping =>
            topping.id === id ? { ...topping, [field]: value } : topping
        );
        setToppings(updatedToppings);
    };

    // Hàm kích hoạt chế độ chỉnh sửa
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Hàm toggle chọn topping
    const toggleTopping = (id) => {
        const updatedToppings = toppings.map((topping) =>
            topping.id === id ? { ...topping, selected: !topping.selected } : topping
        );
        setToppings(updatedToppings);
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <SafeAreaView style={styles.container}>
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
                                    source={imageUri ? { uri: imageUri } : food.image}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* Tên món */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Tên món</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={name} onChangeText={setName} editable={isEditing} />
                        </View>
                        {/* Giá món ăn */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Giá</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={price} onChangeText={setPrice} editable={isEditing} keyboardType='numeric' />
                        </View>
                        {/* Giá món ăn */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Giá giảm</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={discountPrice} onChangeText={setDiscountPrice} editable={isEditing} keyboardType='numeric' />
                        </View>
                        {/* Category */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Nhóm</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={category} onChangeText={setCategory} editable={isEditing} />
                        </View>
                        {/* Mô tả */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Mô tả</Text>
                            <TextInput style={[styles.textRight, styles.descriptionInput]} value={description} onChangeText={setDescription} editable={isEditing} multiline={true} />
                        </View>

                        {/* Topping */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Options</Text>
                        </View>
                        {toppings.map((topping) => (
                            <View key={topping.id} style={styles.toppingContainer}>
                                <CheckBox
                                    disabled={!isEditing}
                                    value={topping.selected}
                                    onValueChange={() => toggleTopping(topping.id)}
                                />
                                <TextInput style={styles.toppingName} value={topping.name}
                                    onChangeText={(value) => updateTopping(topping.id, 'name', value)}
                                    editable={isEditing} />
                                <TextInput style={styles.toppingPrice} value={topping.price.toString()}
                                    onChangeText={(value) => updateTopping(topping.id, 'price', value)}
                                    editable={isEditing}
                                    keyboardType="numeric" />
                                <Text>đ</Text>
                            </View>
                        ))}

                        {/* Thêm topping mới */}
                        {newToppings.map((topping, index) => (
                            <View key={topping.id} style={styles.toppingContainer}>
                                <CheckBox
                                    disabled={!isEditing}
                                    value={topping.selected}
                                    onValueChange={() => toggleTopping(topping.id)}
                                />
                                <TextInput
                                    style={styles.toppingName}
                                    placeholder="Tên topping"
                                    value={topping.name}
                                    ref={(input) => newToppingRefs.current[index] = input}  // Gán ref cho TextInput
                                    editable={isEditing}
                                    onChangeText={(value) => updateNewTopping(topping.id, 'name', value)}
                                />
                                <TextInput
                                    style={styles.toppingPrice}
                                    placeholder="Giá topping"
                                    value={topping.price}
                                    onChangeText={(value) => updateNewTopping(topping.id, 'price', value)}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                                <Text>đ</Text>
                            </View>
                        ))}
                        {/* Add Option Button */}
                        <TouchableOpacity onPress={() => { isEditing ? addNewTopping() : null }} style={styles.addButton}>
                            <Text style={[styles.addButtonText, { color: isEditing ? '#007bff' : '#666' }]}>+ Thêm lựa chọn</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>

                {/* Nút chỉnh sửa ở dưới cùng */}
                <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                    <Text style={styles.editButtonText}>
                        {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        paddingTop: 5,
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
        paddingVertical: 5
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
        margin: 10,
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