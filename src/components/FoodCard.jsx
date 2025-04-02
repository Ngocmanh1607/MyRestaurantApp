// src/components/FoodCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ToggleSwitch from './ToggleSwitch';
import { useNavigation } from '@react-navigation/native';
import { publicProductApi, unPublicProductApi } from '../api/foodApi';
import Snackbar from 'react-native-snackbar';
import formatPrice from '../utils/formatPrice';

const FoodCard = ({ food }) => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleToggle = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const updateStatus = async (foodId) => {
    if (isEnabled) {
      const response = await publicProductApi(foodId);
      if (response == true) {
        Snackbar.show({ text: 'Tắt sản phẩm thành công', duration: Snackbar.LENGTH_SHORT });
        handleToggle();
      } else {
        Snackbar.show({ text: 'Cập nhật thất bại', duration: Snackbar.LENGTH_SHORT });
      }
    } else {
      const response = await unPublicProductApi(foodId);
      console.log(response);
      if (response == true) {
        Snackbar.show({ text: 'Bật sản phẩm thành công', duration: Snackbar.LENGTH_SHORT });
        handleToggle();
      } else {
        Snackbar.show({ text: 'Cập nhật thất bại', duration: Snackbar.LENGTH_SHORT });
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.foodItem, { opacity: isEnabled ? 1 : 0.5 }]}
      onPress={() => {
        navigation.navigate('Chỉnh sửa món ăn', { food });
      }}>
      <Image style={styles.foodImage} source={{ uri: food.image }} />
      <View style={styles.foodDetails}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodDes}>{food.descriptions}</Text>
        <Text style={styles.foodPrice}>{formatPrice(food.price)}</Text>
      </View>
      <ToggleSwitch
        isEnabled={isEnabled}
        onToggle={() => {
          updateStatus(food.id);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  foodImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  foodDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  foodDes: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  foodPrice: {
    fontSize: 16,
    color: '#e65100',
    fontWeight: '700',
  },
});

export default FoodCard;
