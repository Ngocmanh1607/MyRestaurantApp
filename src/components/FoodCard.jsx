// src/components/FoodCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ToggleSwitch from './ToggleSwitch';
import { useNavigation } from '@react-navigation/native';
import { publicProductApi, unPublicProductApi } from '../api/foodApi';
import Snackbar from 'react-native-snackbar';
import formatPrice from '../utils/formatPrice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const FoodCard = ({ food }) => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(Boolean(food.is_active));

  const hasFlashSale = !food.flash_sale_amount ? false : true;
  const handleToggle = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const updateStatus = async (foodId) => {
    if (isEnabled) {
      const response = await publicProductApi(foodId);
      if (response == true) {
        Snackbar.show({
          text: 'Tắt sản phẩm thành công',
          duration: Snackbar.LENGTH_SHORT,
        });
        handleToggle();
      } else {
        Snackbar.show({
          text: 'Cập nhật thất bại',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      const response = await unPublicProductApi(foodId);
      console.log(response);
      if (response == true) {
        Snackbar.show({
          text: 'Bật sản phẩm thành công',
          duration: Snackbar.LENGTH_SHORT,
        });
        handleToggle();
      } else {
        Snackbar.show({
          text: 'Cập nhật thất bại',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.foodItem, { opacity: isEnabled ? 1 : 0.5 }]}
      onPress={() => {
        navigation.navigate('Chỉnh sửa món ăn', { food });
      }}
      disabled={!isEnabled}>
      <View style={styles.imageContainer}>
        <Image style={styles.foodImage} source={{ uri: food.image }} />
        {hasFlashSale && (
          <View style={styles.flashSaleBadge}>
            <MaterialIcons name="flash-on" size={14} color="#FFF" />
            <Text style={styles.flashSaleText}>Flash Sale</Text>
          </View>
        )}
      </View>
      <View style={styles.foodDetails}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodDes}>{food.descriptions}</Text>
        <View style={styles.priceContainer}>
          <Text style={hasFlashSale ? styles.originalPrice : styles.foodPrice}>
            {formatPrice(food.price)}
          </Text>
          {hasFlashSale && (
            <View style={styles.saleContainer}>
              <Text style={styles.salePrice}>
                {formatPrice(food.flash_sale_amount)}
              </Text>
              <Text style={styles.discountPercent}>
                -
                {Math.round(
                  ((food.price - food.flash_sale_amount) / food.price) * 100
                )}
                %
              </Text>
            </View>
          )}
        </View>
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 16,
    color: '#e65100',
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
  },
  flashSaleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    flexDirection: 'row',
  },
  flashSaleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  saleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountPercent: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default FoodCard;
