import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import FoodCard from '../components/FoodCard';
import { getFoodRes } from '../api/restaurantApi';

const FoodManagementScreen = ({ navigation }) => {
    const [foodItems, setFoodItems] = useState([])
    useEffect(() => {
        const fetchFoodRes = async () => {
            try {
                const data = await getFoodRes()
                console.log(data)
                const setData = data.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    descriptions: item.descriptions,
                    price: item.price,
                }))
                setFoodItems(setData)
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        }
        fetchFoodRes()
    }, [])
    return (
        <ScrollView style={styles.container}>

            <View style={styles.mainContainer}>
                {foodItems.map((food) => (
                    <FoodCard
                        key={food.id}
                        food={food}
                        onAdd={() => console.log(`Add ${food.name}`)}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        marginVertical: 10
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
        color: '#333',
    },
});

export default FoodManagementScreen;