import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import FoodCard from '../components/FoodCard';

const FoodManagementScreen = ({ navigation }) => {
    const foodItems = [
        {
            name: 'Trà trái cây nhiệt đới',
            description: 'Trà trái cây nhiệt đới là tổng các loại trái cây',
            price: '32.000đ',
            image: require('../Images/image.png'),
            categoryId: 1
        },
        {
            name: 'Ly trà xoài chanh dây 700ml',
            description: 'Trà trái cây nhiệt đới là tổng các loại trái cây',
            price: '32.000đ',
            image: require('../Images/image.png'),
            categoryId: 1
        },
        {
            name: 'Sữa đậu xanh + óc chó',
            description: 'Sữa đậu xanh kết hợp với óc chó',
            price: '25.000đ',
            image: require('../Images/image.png'),
            categoryId: 2
        },
        {
            name: 'Sữa hạt đậu đỏ + hạt sen',
            description: 'Sữa hạt đậu đỏ kết hợp hạt sen',
            price: '25.000đ',
            image: require('../Images/image.png'),
            categoryId: 2
        }
    ];

    // Hàm để lọc món ăn theo category
    const filterByCategory = (categoryId) => {
        return foodItems.filter(food => food.categoryId === categoryId);
    };

    return (
        <ScrollView style={styles.container}>

            {/* Category 1: Trà Trái Cây */}
            <View style={styles.mainContainer}>
                <Text style={styles.categoryTitle}>Trà Trái Cây</Text>
                {filterByCategory(1).map((food, index) => (
                    <FoodCard
                        key={index}
                        food={food}
                        onAdd={() => console.log(`Add ${food.name}`)}
                    />
                ))}
            </View>

            {/* Category 2: Sữa Hạt */}
            <View style={styles.mainContainer}>
                <Text style={styles.categoryTitle}>Sữa Hạt</Text>
                {filterByCategory(2).map((food, index) => (
                    <FoodCard
                        key={index}
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