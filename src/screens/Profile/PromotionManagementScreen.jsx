import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { styles } from '../../assets/css/PromotionManagementStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

import {
  addCoupon,
  getCoupon,
  editCoupon,
  getFoodRes,
  addDiscountForFood,
  addDiscountForListFood,
  getDiscount,
  editDiscounts,
} from '../../api/restaurantApi';
import formatPrice from '../../utils/formatPrice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import {
  formatDateTimeForAPI,
  formatDateTimeForDisplay,
} from '../../utils/utilsTime';
const parseDateTime = (dateTimeString) => {
  if (!dateTimeString) return new Date();

  try {
    // Parse "DD/MM/YYYY HH:MM" format
    if (dateTimeString.includes('/')) {
      const [datePart, timePart = '00:00'] = dateTimeString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');

      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hours, 10),
        parseInt(minutes, 10)
      );
    }
    // Parse ISO format
    else if (dateTimeString.includes('-')) {
      return new Date(dateTimeString);
    }
  } catch (error) {
    console.error('Error parsing date time:', error);
  }

  return new Date();
};
import { getPromotionStatus } from '../../utils/getPromotionStatus';
import { ActivityIndicator } from 'react-native-paper';
export default function PromotionManagementScreen() {
  const [promotions, setPromotions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('ONE_TIME'); // 'ONE_TIME', or 'FOOD_DISCOUNT'
  const [restaurantId, setRestaurantId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);
  const [foodItemsModalVisible, setFoodItemsModalVisible] = useState(false);
  const [flashSaleId, setFlashsaleID] = useState();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addProduct, setAddProduct] = useState([]);
  const [removeProduct, setRemoveProduct] = useState([]);
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  // Form state
  const [formData, setFormData] = useState({
    coupon_type: 'ONE_TIME',
    coupon_name: '',
    coupon_code: '',
    discount_value: '',
    discount_type: 'PERCENTAGE',
    max_discount_amount: '',
    min_order_value: '',
    max_uses_per_user: '1',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    const getRestaurantId = async () => {
      try {
        const id = await AsyncStorage.getItem('restaurantId');
        if (id) {
          setRestaurantId(id);
        }
      } catch (error) {
        console.error('Lỗi khi lấy restaurant ID:', error);
      }
    };

    getRestaurantId();
  }, []);

  const fetchAllData = async (restaurantID) => {
    try {
      setLoading(true);
      if (restaurantID) {
        // Fetch menu items
        const foodData = await getFoodRes(restaurantID, navigation);
        if (foodData.success) {
          const itemMap = new Map();
          foodData.data.forEach((category) => {
            category.products.forEach((product) => {
              itemMap.set(product.product_id, {
                product_id: product.product_id,
                product_name: product.product_name,
                product_price: product.product_price,
              });
            });
          });
          setMenuItems(Array.from(itemMap.values()));
        } else {
          Alert.alert('Lỗi', foodData.message);
          return;
        }

        // Fetch coupons
        const coupons = await getCoupon(restaurantID);

        // Fetch discounts
        const discounts = await getDiscount(restaurantID);
        if (coupons.success && discounts.success) {
          const formattedDiscounts =
            discounts.data?.map((discount) => ({
              id: discount.id,
              flash_sale_id: discount.flash_sale_id,
              coupon_type: 'FOOD_DISCOUNT',
              coupon_name: discount.coupon_name,
              coupon_code: discount.coupon_code,
              discount_value: discount.discount_value,
              discount_type: discount.discount_type,
              max_discount_amount: discount.max_discount_amount,
              min_order_value: discount.min_order_value,
              max_uses_per_user: discount.max_uses_per_user,
              start_date: discount.start_date,
              end_date: discount.end_date,
              is_active: discount.is_active,
              food_items: discount.food_items || [],
            })) || [];

          // Set all promotions at once
          setPromotions([...(coupons.data || []), ...formattedDiscounts]);
        } else {
          if (coupons.success === false) {
            Alert.alert('Lỗi', coupons.message);
            return;
          }
          if (discounts.success === false) {
            Alert.alert('Lỗi', discounts.message);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (restaurantId) {
      fetchAllData(restaurantId);
    }
  }, [restaurantId]);
  const filteredPromotions = promotions.filter((item) => {
    const matchesSearch =
      item.coupon_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.coupon_code?.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilter =
      activeFilter === 'Tất cả' ||
      (activeFilter === 'ONE_TIME' &&
        (item.coupon_type === 'ONE_TIME' ||
          item.coupon_type === 'ONE_TIME_EVERY_DAY')) ||
      (activeFilter === 'FOOD_DISCOUNT' &&
        item.coupon_type === 'FOOD_DISCOUNT');

    return matchesSearch && matchesFilter;
  });

  const openAddModal = (type) => {
    setIsEditing(false);
    setEditingId(null);
    setFormType(type);
    setSelectedFoodItems([]);
    setFormData({
      coupon_type: type,
      coupon_name: '',
      coupon_code: '',
      discount_value: '',
      discount_type: 'PERCENTAGE',
      max_discount_amount: '',
      min_order_value: '',
      max_uses_per_user: '1',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormType(item.coupon_type);
    setSelectedFoodItems(item.food_items || []);
    setFlashsaleID(item.flash_sale_id);
    setFormData({
      coupon_type: item.coupon_type,
      coupon_name: item.coupon_name,
      coupon_code: item.coupon_code,
      discount_value: item.discount_value.toString(),
      discount_type: item.discount_type,
      max_discount_amount: item.max_discount_amount
        ? item.max_discount_amount.toString()
        : '',
      min_order_value: item.min_order_value
        ? item.min_order_value.toString()
        : '',
      max_uses_per_user: item.max_uses_per_user
        ? item.max_uses_per_user.toString()
        : '1',
      start_date: item.start_date,
      end_date: item.end_date,
      is_active: item.is_active,
    });
    setModalVisible(true);
  };

  const openFoodItemsModal = () => {
    setModalVisible(false); // Tạm ẩn modal khuyến mãi
    setFoodItemsModalVisible(true);
  };

  const handleSelectFoodItem = (item) => {
    const isSelected = selectedFoodItems.some(
      (selectedItem) => selectedItem.product_id === item.product_id
    );

    if (isSelected) {
      setSelectedFoodItems(
        selectedFoodItems.filter(
          (selectedItem) => selectedItem.product_id !== item.product_id
        )
      );
      setRemoveProduct([...removeProduct, item.product_id]);
    } else {
      setSelectedFoodItems([...selectedFoodItems, item]);
      setAddProduct([...addProduct, item.product_id]);
    }
  };

  const handleConfirmFoodItems = () => {
    setFormData({
      ...formData,
    });
    setFoodItemsModalVisible(false);
    setModalVisible(true);
  };

  const handleAddPromotion = async () => {
    try {
      setLoading(true);

      const validationErrors = validateFormData();
      if (validationErrors) {
        Alert.alert('Thông báo', validationErrors);
        return;
      }
      const couponData = formatCouponData();
      const result = await submitPromotion(couponData);

      if (result) {
        // Show success message
        Alert.alert(
          'Thành công',
          isEditing ? 'Đã cập nhật thành công' : 'Đã thêm mới thành công'
        );
        // Reset form and refresh data
        resetForm();
        await fetchAllData(restaurantId);
        // Close modal
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi xử lý khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = () => {
    // Kiểm tra bắt buộc
    if (
      !formData.coupon_name ||
      !formData.coupon_code ||
      !formData.start_date ||
      !formData.end_date
    ) {
      return 'Vui lòng điền đầy đủ thông tin';
    }

    // Không cho phép ký tự đặc biệt trong mã khuyến mãi
    if (!/^[A-Za-z0-9_]+$/.test(formData.coupon_code)) {
      return 'Mã khuyến mãi chỉ được chứa chữ, số hoặc dấu gạch dưới';
    }

    // Giá trị giảm giá phải là số dương
    if (
      !formData.discount_value ||
      isNaN(Number(formData.discount_value)) ||
      Number(formData.discount_value) <= 0
    ) {
      return 'Vui lòng nhập giá trị giảm giá là số lớn hơn 0';
    }

    // Nếu giảm giá phần trăm thì không vượt quá 100%
    if (
      formData.discount_type === 'PERCENTAGE' &&
      Number(formData.discount_value) > 100
    ) {
      return 'Giá trị giảm phần trăm không được vượt quá 100%';
    }

    // Giảm tối đa (nếu nhập) phải là số dương
    if (
      formData.max_discount_amount &&
      (isNaN(Number(formData.max_discount_amount)) ||
        Number(formData.max_discount_amount) < 0)
    ) {
      return 'Giảm tối đa phải là số không âm';
    }

    // Giá trị đơn hàng tối thiểu (nếu nhập) phải là số dương
    if (
      formData.min_order_value &&
      (isNaN(Number(formData.min_order_value)) ||
        Number(formData.min_order_value) < 0)
    ) {
      return 'Giá trị đơn hàng tối thiểu phải là số không âm';
    }

    // Số lượng phải là số nguyên dương
    if (
      !formData.max_uses_per_user ||
      isNaN(Number(formData.max_uses_per_user)) ||
      Number(formData.max_uses_per_user) <= 0 ||
      !Number.isInteger(Number(formData.max_uses_per_user))
    ) {
      return 'Số lượng phải là số nguyên dương';
    }

    // Ngày bắt đầu phải trước ngày kết thúc
    const start = parseDateTime(formData.start_date);
    const end = parseDateTime(formData.end_date);
    if (start >= end) {
      return 'Ngày bắt đầu phải trước ngày kết thúc';
    }

    // Nếu là giảm giá món ăn thì phải chọn ít nhất 1 món
    if (
      formData.coupon_type === 'FOOD_DISCOUNT' &&
      (!selectedFoodItems || selectedFoodItems.length === 0)
    ) {
      return 'Vui lòng chọn ít nhất một món ăn để áp dụng khuyến mãi';
    }

    return null;
  };

  const formatCouponData = () => {
    return {
      ...formData,
      start_date: formatDateTimeForAPI(formData.start_date),
      end_date: formatDateTimeForAPI(formData.end_date),
      is_active: true,
    };
  };

  const submitPromotion = async (couponData) => {
    if (!restaurantId) throw new Error('Không tìm thấy thông tin nhà hàng');

    if (formType === 'ONE_TIME' || formType === 'ONE_TIME_EVERY_DAY') {
      return await handleOnetime(couponData);
    } else if (formType === 'FOOD_DISCOUNT') {
      return await handleFoodDiscount(couponData);
    }
  };

  const handleOnetime = async (couponData) => {
    if (isEditing) {
      return await editCoupon(restaurantId, {
        ...couponData,
        coupon_id: editingId,
      });
    }
    return await addCoupon(restaurantId, couponData);
  };

  const handleFoodDiscount = async (couponData) => {
    if (isEditing) {
      return await editDiscounts(
        restaurantId,
        {
          ...couponData,
          flash_sale_id: flashSaleId,
          coupon_id: editingId,
        },
        addProduct,
        removeProduct
      );
    }

    if (selectedFoodItems.length === 1) {
      return await addDiscountForFood(
        restaurantId,
        couponData,
        selectedFoodItems[0].product_id
      );
    }

    return await addDiscountForListFood(
      restaurantId,
      couponData,
      selectedFoodItems
    );
  };

  const resetForm = () => {
    setFormData({
      coupon_type: 'ONE_TIME',
      coupon_name: '',
      coupon_code: '',
      discount_value: '',
      discount_type: 'PERCENTAGE',
      max_discount_amount: '',
      min_order_value: '',
      max_uses_per_user: '1',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setSelectedFoodItems([]);
    setAddProduct([]);
    setRemoveProduct([]);
  };

  const onStartDateTimeChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
      setFormData({ ...formData, start_date: formattedDateTime });
    }
  };

  const onEndDateTimeChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
      setFormData({ ...formData, end_date: formattedDateTime });
    }
  };

  const renderItem = ({ item }) => {
    const status = getPromotionStatus(item.start_date, item.end_date);

    const getStatusStyle = (status) => {
      switch (status) {
        case 'UPCOMING':
          return {
            backgroundColor: '#fef9c3',
            textColor: '#854d0e',
          };
        case 'ACTIVE':
          return {
            backgroundColor: '#dcfce7',
            textColor: '#166534',
          };
        case 'EXPIRED':
          return {
            backgroundColor: '#fee2e2',
            textColor: '#991b1b',
          };
        default:
          return {
            backgroundColor: '#f3f4f6',
            textColor: '#374151',
          };
      }
    };
    const statusStyle = getStatusStyle(status);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.coupon_name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {status === 'UPCOMING'
                ? 'Sắp tới'
                : status === 'ACTIVE'
                ? 'Đang hoạt động'
                : 'Đã hết hạn'}
            </Text>
          </View>
        </View>
        <View style={styles.itemDetail}>
          <Text>
            {item.coupon_type === 'ONE_TIME' ||
            item.coupon_type === 'ONE_TIME_EVERY_DAY'
              ? '🏷️ Mã giảm giá'
              : '🍲 Khuyến mãi món ăn'}
          </Text>
          <Text style={styles.itemCode}>Mã: {item.coupon_code}</Text>
          <Text style={styles.itemDiscount}>
            Giảm: {item.discount_value}
            {item.discount_type === 'PERCENTAGE' ? '%' : 'đ'}
          </Text>

          {item.min_order_value > 0 && (
            <Text style={styles.itemMinOrder}>
              Đơn tối thiểu: {formatPrice(item.min_order_value)}
            </Text>
          )}
          <Text style={styles.itemCount}>
            Số lượng :{item.max_uses_per_user}
          </Text>
          <Text style={styles.itemCountUse}>
            Số lượng đã dùng :{item.current_uses}
          </Text>

          {item.coupon_type === 'FOOD_DISCOUNT' && item.food_items && (
            <Text style={styles.itemApplied}>
              Áp dụng cho: {item.food_items.length} món ăn
            </Text>
          )}

          <Text style={styles.itemDate}>
            Thời gian: {formatDateTimeForDisplay(item.start_date)} -{' '}
            {formatDateTimeForDisplay(item.end_date)}
          </Text>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}>
            <Text style={styles.deleteText}>Sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.foodItemContainer,
        selectedFoodItems.some(
          (selectedItem) => selectedItem.product_id === item.product_id
        ) && styles.selectedFoodItem,
      ]}
      onPress={() => handleSelectFoodItem(item)}>
      <Text style={styles.foodItemName}>{item.product_name}</Text>
      <Text style={styles.foodItemPrice}>
        {formatPrice(item.product_price)}
      </Text>
      {selectedFoodItems.some(
        (selectedItem) => selectedItem.product_id === item.product_id
      ) && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  const renderCategory = (category, text) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === category && styles.activeFilterButton,
      ]}
      onPress={() => setActiveFilter(category)}>
      <Text
        style={[
          styles.filterText,
          activeFilter === category && styles.activeFilterText,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm khuyến mãi ..."
          value={searchText}
          onChangeText={setSearchText}></TextInput>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}>
          {renderCategory('Tất cả', 'Tất cả')}
          {renderCategory('ONE_TIME', 'Mã giảm giá')}
          {renderCategory('FOOD_DISCOUNT', 'Giảm giá món')}
        </ScrollView>
      </View>
      <FlatList
        data={filteredPromotions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu khuyến mãi</Text>
          </View>
        }
      />

      {/* Modal thêm/sửa khuyến mãi */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing
                ? formType === 'ONE_TIME'
                  ? 'Sửa mã giảm giá'
                  : 'Sửa khuyến mãi món ăn'
                : formType === 'ONE_TIME'
                ? 'Thêm mã giảm giá mới'
                : 'Thêm giảm giá món ăn mới'}
            </Text>
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Tên khuyến mãi</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Khuyến mãi chào mừng"
                value={formData.coupon_name}
                onChangeText={(text) =>
                  setFormData({ ...formData, coupon_name: text })
                }
              />

              <Text style={styles.inputLabel}>Mã khuyến mãi</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: WELCOME10"
                value={formData.coupon_code}
                onChangeText={(text) =>
                  setFormData({ ...formData, coupon_code: text })
                }
              />
              <Text style={styles.inputLabel}>Loại giảm giá</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.discount_type === 'PERCENTAGE' &&
                      styles.radioButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, discount_type: 'PERCENTAGE' })
                  }>
                  <Text
                    style={[
                      styles.radioText,
                      formData.discount_type === 'PERCENTAGE' &&
                        styles.activeFilterText,
                    ]}>
                    Phần trăm (%)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.discount_type === 'FIXED_AMOUNT' &&
                      styles.radioButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, discount_type: 'FIXED_AMOUNT' })
                  }>
                  <Text
                    style={[
                      styles.radioText,
                      formData.discount_type === 'FIXED_AMOUNT' &&
                        styles.activeFilterText,
                    ]}>
                    Số tiền cố định (đ)
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>Giá trị giảm</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 10"
                value={formData.discount_value}
                onChangeText={(text) =>
                  setFormData({ ...formData, discount_value: text })
                }
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Giảm tối đa (đ)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 50000"
                value={formData.max_discount_amount}
                onChangeText={(text) =>
                  setFormData({ ...formData, max_discount_amount: text })
                }
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>
                Giá trị đơn hàng tối thiểu (đ)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 100000"
                value={formData.min_order_value}
                onChangeText={(text) =>
                  setFormData({ ...formData, min_order_value: text })
                }
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Số lượng</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 1"
                value={formData.max_uses_per_user}
                onChangeText={(text) =>
                  setFormData({ ...formData, max_uses_per_user: text })
                }
                keyboardType="numeric"
              />
              {formType === 'FOOD_DISCOUNT' && (
                <>
                  <Text style={styles.inputLabel}>Món ăn áp dụng</Text>
                  <TouchableOpacity
                    style={styles.selectFoodButton}
                    onPress={openFoodItemsModal}>
                    <Text style={styles.selectFoodButtonText}>
                      {selectedFoodItems.length > 0
                        ? `Đã chọn ${selectedFoodItems.length} món`
                        : 'Chọn món ăn'}
                    </Text>
                  </TouchableOpacity>
                  {selectedFoodItems.length > 0 && (
                    <View style={styles.selectedFoodList}>
                      {selectedFoodItems.map((item) => (
                        <View
                          key={item.product_id}
                          style={styles.selectedFoodTag}>
                          <Text style={styles.selectedFoodTagText}>
                            {item.product_name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
              <View style={styles.checkboxRow}>
                <CheckBox
                  value={formData.coupon_type === 'ONE_TIME' ? false : true}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      coupon_type: 'ONE_TIME_EVERY_DAY',
                    })
                  }
                  tintColors={{ true: '#FF6347', false: '#666' }}
                />
                <Text style={styles.checkboxLabel}>
                  Cho phép người dùng sử dụng nhiều lần
                </Text>
              </View>

              <Text style={styles.inputLabel}>Ngày bắt đầu</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}>
                <Text>
                  {formatDateTimeForDisplay(formData.start_date) ||
                    'Chọn ngày bắt đầu'}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <View style={styles.dateTimeContainer}>
                  <DateTimePicker
                    value={
                      formData.start_date
                        ? parseDateTime(formData.start_date)
                        : new Date()
                    }
                    mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                    display="default"
                    onChange={onStartDateTimeChange}
                  />
                  {Platform.OS === 'android' && (
                    <TouchableOpacity
                      style={styles.timePickerButton}
                      onPress={() => {
                        setShowStartTimePicker(true);
                      }}>
                      <Text>Chọn giờ</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {Platform.OS === 'android' && showStartTimePicker && (
                <DateTimePicker
                  value={
                    formData.start_date
                      ? parseDateTime(formData.start_date)
                      : new Date()
                  }
                  mode="time"
                  display="default"
                  onChange={onStartDateTimeChange}
                />
              )}

              <Text style={styles.inputLabel}>Ngày kết thúc</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}>
                <Text>
                  {formatDateTimeForDisplay(formData.end_date) ||
                    'Chọn ngày kết thúc'}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <View style={styles.dateTimeContainer}>
                  <DateTimePicker
                    value={
                      formData.end_date
                        ? parseDateTime(formData.end_date)
                        : new Date()
                    }
                    mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                    display="default"
                    onChange={onEndDateTimeChange}
                  />
                  {Platform.OS === 'android' && (
                    <TouchableOpacity
                      style={styles.timePickerButton}
                      onPress={() => {
                        setShowEndTimePicker(true);
                      }}>
                      <Text>Chọn giờ</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {Platform.OS === 'android' && showEndTimePicker && (
                <DateTimePicker
                  value={
                    formData.end_date
                      ? parseDateTime(formData.end_date)
                      : new Date()
                  }
                  mode="time"
                  display="default"
                  onChange={onEndDateTimeChange}
                />
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddPromotion}>
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Cập nhật' : 'Lưu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal chọn món ăn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={foodItemsModalVisible}
        onRequestClose={() => setFoodItemsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Chọn món ăn áp dụng khuyến mãi
            </Text>
            <FlatList
              data={menuItems}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.product_id}
              contentContainerStyle={styles.foodListContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không có món ăn</Text>
                </View>
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setFoodItemsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleConfirmFoodItems}>
                <Text style={styles.saveButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.addContainer}>
        <TouchableOpacity
          style={[styles.addButton, styles.discountButton]}
          onPress={() => openAddModal('ONE_TIME')}>
          <Text style={styles.addButtonText}> + Thêm mã giảm giá</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.discountButton]}
          onPress={() => openAddModal('FOOD_DISCOUNT')}>
          <Text style={styles.addButtonText}> + Giảm giá món ăn</Text>
        </TouchableOpacity>
      </View>
      {/* modal loading */}
      <Modal visible={loading} animationType="none" transparent={true}>
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="small" color="#f00" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
