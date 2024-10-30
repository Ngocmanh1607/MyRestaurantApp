// src/components/FoodCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import ToggleSwitch from './ToggleSwitch';
import { useNavigation } from '@react-navigation/native';

const FoodCard = ({ food }) => {
    const navigation = useNavigation()
    const [isEnabled, setIsEnabled] = useState(true);
    console.log(food.image)
    const handleToggle = () => {
        setIsEnabled(previousState => !previousState);
    };
    return (
        <TouchableOpacity style={[styles.foodItem, { opacity: isEnabled ? 1 : 0.5 }]} onPress={() => { navigation.navigate('Chỉnh sửa món ăn', { food }) }}>
            <Image style={styles.foodImage} source={{ uri: food.image }} />
            <View style={styles.foodDetails}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDes}>{food.descriptions}</Text>
                <Text style={styles.foodPrice}>{food.price}</Text>
            </View>
            <ToggleSwitch isEnabled={isEnabled} onToggle={handleToggle} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
    },
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    foodDetails: {
        flex: 1,
        marginLeft: 16,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    foodDes: {
        fontSize: 14,
        color: '#666',
    },
    foodPrice: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
});

export default FoodCard;