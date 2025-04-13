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
import { addCoupon, getCoupon, editCoupon } from '../../api/restaurantApi';
import formatTime from '../../utils/formatTime';
import formatPrice from '../../utils/formatPrice';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PromotionManagementScreen() {
  const [promotions, setPromotions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('ONE_TIME'); // 'ONE_TIME', 'ONE_TIME_EVERY_DAY', or 'FOOD_DISCOUNT'
  const [restaurantId, setRestaurantId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);
  const [foodItemsModalVisible, setFoodItemsModalVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

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
    appliedItems: '',
    food_items: [],
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

  useEffect(() => {
    fetchCoupons(restaurantId);
    fetchMenuItems(restaurantId);
  }, [restaurantId]);

  const fetchMenuItems = async (restaurantID) => {
    try {
      if (restaurantID) {
        // Giả định API lấy danh sách món ăn
        // const items = await getMenuItems(restaurantID);
        // Tạm thời dùng dữ liệu mẫu
        const items = [
          { id: '1', name: 'Cơm gà', price: 50000 },
          { id: '2', name: 'Phở bò', price: 60000 },
          { id: '3', name: 'Bún chả', price: 45000 },
          { id: '4', name: 'Bánh mì', price: 25000 },
          { id: '5', name: 'Cà phê', price: 30000 },
        ];
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách món ăn:', error);
    }
  };

  const fetchCoupons = async (restaurantID) => {
    try {
      if (restaurantID) {
        const coupons = await getCoupon(restaurantID);
        if (coupons && Array.isArray(coupons)) {
          setPromotions(coupons);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
    }
  };

  const filteredPromotions = promotions.filter((item) => {
    const matchesSearch =
      item.coupon_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.coupon_code.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
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
      appliedItems: '',
      food_items: [],
    });
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormType(item.coupon_type);
    setSelectedFoodItems(item.food_items || []);
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
      appliedItems: item.appliedItems || '',
      food_items: item.food_items || [],
    });
    setModalVisible(true);
  };

  const openFoodItemsModal = () => {
    setModalVisible(false); // Tạm ẩn modal khuyến mãi
    setFoodItemsModalVisible(true);
  };

  const handleSelectFoodItem = (item) => {
    const isSelected = selectedFoodItems.some(
      (selectedItem) => selectedItem.id === item.id
    );

    if (isSelected) {
      setSelectedFoodItems(
        selectedFoodItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedFoodItems([...selectedFoodItems, item]);
    }
  };

  const handleConfirmFoodItems = () => {
    setFormData({
      ...formData,
      food_items: selectedFoodItems,
      appliedItems: selectedFoodItems.map((item) => item.name).join(', '),
    });
    setFoodItemsModalVisible(false);
    setModalVisible(true);
  };

  const handleAddPromotion = async () => {
    // Validation
    if (
      !formData.coupon_name ||
      !formData.coupon_code ||
      !formData.start_date ||
      !formData.end_date
    ) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!formData.discount_value) {
      Alert.alert('Thông báo', 'Vui lòng nhập giá trị giảm giá');
      return;
    }

    if (
      formData.coupon_type === 'FOOD_DISCOUNT' &&
      selectedFoodItems.length === 0
    ) {
      Alert.alert(
        'Thông báo',
        'Vui lòng chọn ít nhất một món ăn để áp dụng khuyến mãi'
      );
      return;
    }

    if (
      formData.coupon_type === 'ONE_TIME_EVERY_DAY' &&
      !formData.appliedItems
    ) {
      Alert.alert('Thông báo', 'Vui lòng nhập món áp dụng');
      return;
    }

    // Định dạng lại ngày tháng thành năm-tháng-ngày
    if (formData.start_date) {
      const [day, month, year] = formData.start_date.split('/');
      formData.start_date = `${year}-${month}-${day}`;
    }

    if (formData.end_date) {
      const [day, month, year] = formData.end_date.split('/');
      formData.end_date = `${year}-${month}-${day}`;
    }

    try {
      const couponData = {
        ...formData,
        food_items: selectedFoodItems,
      };

      if (restaurantId) {
        let result;
        if (isEditing) {
          result = await editCoupon(restaurantId, {
            ...couponData,
            coupon_id: editingId,
          });
          if (result) {
            setPromotions(
              promotions.map((item) =>
                item.id === editingId
                  ? { ...couponData, coupon_id: editingId }
                  : item
              )
            );
            Alert.alert('Thành công', 'Đã cập nhật thành công');
          }
        } else {
          result = await addCoupon(restaurantId, couponData);
          if (result) {
            fetchCoupons(restaurantId);
            Alert.alert('Thành công', 'Đã thêm mới thành công');
          }
        }

        if (result) {
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
            appliedItems: '',
            food_items: [],
          });
          setSelectedFoodItems([]);
          setModalVisible(false);
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin nhà hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi thêm khuyến mãi');
    }
  };

  // Delete promotion
  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setPromotions(promotions.filter((item) => item.id !== id));
          Alert.alert('Thành công', 'Đã xóa thành công');
        },
      },
    ]);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData({ ...formData, start_date: formattedDate });
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData({ ...formData, end_date: formattedDate });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.coupon_name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.is_active ? '#dcfce7' : '#fef9c3',
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              { color: item.is_active ? '#166534' : '#854d0e' },
            ]}>
            {item.is_active ? 'Đang hoạt động' : 'Sắp tới'}
          </Text>
        </View>
      </View>
      <View style={styles.itemDetail}>
        <Text>
          {item.coupon_type === 'ONE_TIME'
            ? '🏷️ Mã giảm giá'
            : item.coupon_type === 'ONE_TIME_EVERY_DAY'
            ? '🍽️ Khuyến mãi hàng ngày'
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

        {(item.coupon_type === 'ONE_TIME_EVERY_DAY' ||
          item.coupon_type === 'FOOD_DISCOUNT') && (
          <Text style={styles.itemApplied}>Áp dụng: {item.appliedItems}</Text>
        )}

        <Text style={styles.itemDate}>
          Thời gian: {formatTime(item.start_date)} - {formatTime(item.end_date)}
        </Text>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.foodItemContainer,
        selectedFoodItems.some((selectedItem) => selectedItem.id === item.id) &&
          styles.selectedFoodItem,
      ]}
      onPress={() => handleSelectFoodItem(item)}>
      <Text style={styles.foodItemName}>{item.name}</Text>
      <Text style={styles.foodItemPrice}>{formatPrice(item.price)}</Text>
      {selectedFoodItems.some(
        (selectedItem) => selectedItem.id === item.id
      ) && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
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
                  : formType === 'ONE_TIME_EVERY_DAY'
                  ? 'Sửa khuyến mãi hàng ngày'
                  : 'Sửa khuyến mãi món ăn'
                : formType === 'ONE_TIME'
                ? 'Thêm mã giảm giá mới'
                : formType === 'ONE_TIME_EVERY_DAY'
                ? 'Thêm khuyến mãi hàng ngày mới'
                : 'Thêm khuyến mãi món ăn mới'}
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
                        <View key={item.id} style={styles.selectedFoodTag}>
                          <Text style={styles.selectedFoodTagText}>
                            {item.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}

              <Text style={styles.inputLabel}>Ngày bắt đầu</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}>
                <Text>{formData.start_date || 'Chọn ngày bắt đầu'}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={
                    formData.start_date
                      ? new Date(
                          formData.start_date.split('/').reverse().join('-')
                        )
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}

              <Text style={styles.inputLabel}>Ngày kết thúc</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}>
                <Text>{formData.end_date || 'Chọn ngày kết thúc'}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={
                    formData.end_date
                      ? new Date(
                          formData.end_date.split('/').reverse().join('-')
                        )
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
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
              keyExtractor={(item) => item.id}
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
    </SafeAreaView>
  );
}
