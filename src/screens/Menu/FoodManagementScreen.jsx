import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import FoodCard from '../../components/FoodCard';
import { getFoodRes } from '../../api/restaurantApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';

const FoodManagementScreen = () => {
    const navigation = useNavigation();
    const [foodItems, setFoodItems] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    useFocusEffect(
        useCallback(() => {
            const fetchFoodRes = async () => {
                try {
                    const data = await getFoodRes(navigation);
                    const setData = data.map(item => ({
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        descriptions: item.descriptions,
                        price: item.price,
                    }));
                    setFoodItems(setData);
                } catch (error) {
                    Snackbar.show({text:error,duration:Snackbar.LENGTH_SHORT});
                }
            };

            fetchFoodRes();
        }, [])
    );
    const handlePress = ()=>{
        navigation.navigate('Thêm món ăn');
    }
    const filterFoodItems = foodItems.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
        <>
        <ScrollView style={styles.mainContainer}>
            {/* <TextInput
                style={styles.searchBar}
                placeholder="Search for a food item..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            /> */}
            {filterFoodItems.map((food) => (
                <FoodCard
                    key={food.id}
                    food={food}
                    onPress={() => console.log(`Add ${food.name}`)}
                />
            ))}
        </ScrollView>
        <View style={styles.addContainer}>
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
    </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 15,
        marginVertical: 10
    },
    searchBar: {
        backgroundColor: '#fff',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    addContainer:{
            width: 50,
            height: 50,
            backgroundColor: "#fff",
            position: 'absolute',
            zIndex: 1,
            right: 10,
            bottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 5,
    },
    addText:{
        fontSize:30,
        fontWeight:'500',
        color:'#f00'
    }
});

export default FoodManagementScreen;