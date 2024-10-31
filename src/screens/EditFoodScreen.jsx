import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import CheckBox from '@react-native-community/checkbox'
import { launchImageLibrary } from 'react-native-image-picker'
import Snackbar from 'react-native-snackbar'

const EditFoodScreen = ({ route }) => {
    const { food } = route.params
    const [foodData, setFoodData] = useState({
        name: food.name,
        descriptions: food.descriptions,
        categories: [],
        price: food.price,
        image: food.image,
        options: [{ topping_name: '', price: '' }],
    });
    console.log(foodData)
    const [toppings, setToppings] = useState([
    ]);
    const [newToppings, setNewToppings] = useState([]);

    const newToppingRefs = useRef([]);

    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {

    }, [])
    const chooseImage = () => {

    };
    const handleChange = (field, value) => {
        setFoodData({ ...foodData, [field]: value })
    }
    const addNewTopping = () => {
        const newTopping = { id: newToppings.length + 1, name: '', price: '', selected: true };
        setNewToppings([...newToppings, newTopping]);
    };
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
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
                            <TextInput style={[styles.textRight, styles.smallInput]} value={foodData.name}
                                onChangeText={(value) => handleChange('name', value)} editable={isEditing} />
                        </View>
                        {/* Giá món ăn */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Giá</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={foodData.price.toString()} onChangeText={(value) => handleChange('price', value)} editable={isEditing} keyboardType='numeric' />
                        </View>
                        {/* Mô tả */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Mô tả</Text>
                            <TextInput style={[styles.textRight, styles.descriptionInput]} value={foodData.descriptions} onChangeText={(value) => handleChange('descriptions', value)} editable={isEditing} multiline={true} />
                        </View>
                        {/* Category */}
                        <View style={styles.infContainer}>
                            <Text style={styles.textLeft}>Nhóm</Text>
                            <TextInput style={[styles.textRight, styles.smallInput]} value={foodData.categories} onChangeText={(value) => handleChange('categories', value)} editable={isEditing} />
                        </View>

                        {/* Topping */}

                        {/* Add Option Button */}
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