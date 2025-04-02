import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { styles } from '../../assets/css/PromotionManagementStyle';
// Dữ liệu mẫu
const initialPromotions = [
  {
    id: '1',
    type: 'discount',
    name: 'WELCOME10',
    discount: '10%',
    startDate: '01/04/2025',
    endDate: '30/04/2025',
    status: 'active',
  },
  {
    id: '2',
    type: 'discount',
    name: 'WEEKEND20',
    discount: '20%',
    startDate: '05/04/2025',
    endDate: '07/04/2025',
    status: 'active',
  },
  {
    id: '3',
    type: 'discount',
    name: 'LUNCH15',
    discount: '15%',
    startDate: '10/04/2025',
    endDate: '10/05/2025',
    status: 'upcoming',
  },
  {
    id: '4',
    type: 'promotion',
    name: 'Mua 1 tặng 1 món tráng miệng',
    appliedItems: 'Các món tráng miệng',
    startDate: '01/04/2025',
    endDate: '15/04/2025',
    status: 'active',
  },
  {
    id: '5',
    type: 'promotion',
    name: 'Combo tiết kiệm',
    appliedItems: 'Món chính + Nước uống',
    startDate: '01/04/2025',
    endDate: '30/04/2025',
    status: 'active',
  },
  {
    id: '6',
    type: 'promotion',
    name: 'Giảm 30% món mới',
    appliedItems: 'Các món mới',
    startDate: '15/04/2025',
    endDate: '30/04/2025',
    status: 'upcoming',
  },
];

export default function PromotionManagementScreen() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'discount', 'promotion'
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState('discount'); // 'discount' or 'promotion'
  // Form state
  const [formData, setFormData] = useState({
    type: 'discount',
    name: '',
    discount: '',
    appliedItems: '',
    startDate: '',
    endDate: '',
  });

  const filteredPromotions = promotions.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = (type) => {
    setFormType(type);
    setFormData({
      ...formData,
      type: type,
    });
    setModalVisible(true);
  };

  const handleAddPromotion = () => {
    // Validation
    if (!formData.name || !formData.startDate || !formData.endDate) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.type === 'discount' && !formData.discount) {
      Alert.alert('Thông báo', 'Vui lòng nhập mức giảm giá');
      return;
    }

    if (formData.type === 'promotion' && !formData.appliedItems) {
      Alert.alert('Thông báo', 'Vui lòng nhập món áp dụng');
      return;
    }
    const newPromotion = {
      id: Date.now().toString(),
      ...formData,
      status: 'upcoming',
    };
    setPromotions([...promotions, newPromotion]);
    setFormData({
      type: 'discount',
      name: '',
      discount: '',
      appliedItems: '',
      startDate: '',
      endDate: '',
    });
    setModalVisible(false);
    Alert.alert('Thành công', 'Đã thêm mới thành công');
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === 'active' ? '#dcfce7' : '#fef9c3',
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'active' ? '#166534' : '#854d0e' },
            ]}>
            {item.status === 'active' ? 'Đang hoạt động' : 'Sắp tới'}
          </Text>
        </View>
      </View>
      <View style={styles.itemDetail}>
        <Text>
          {item.type === 'discount' ? '🏷️ Mã giảm giá' : '🍽️ Khuyến mãi món ăn'}
        </Text>
        {item.type === 'discount' && (
          <Text style={styles.itemDiscount}>Mức giảm: {item.discount}</Text>
        )}

        {item.type === 'promotion' && (
          <Text style={styles.itemApplied}>Áp dụng: {item.appliedItems}</Text>
        )}

        <Text style={styles.itemDate}>
          Thời gian: {item.startDate} - {item.endDate}
        </Text>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.actionButton}>
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'discount' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('discount')}>
          <Text
            style={[
              styles.filterText,
              filter === 'discount' && styles.activeFilterText,
            ]}>
            Mã giảm giá
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'promotion' && styles.activeFilterButton,
          ]}
          onPress={() => setFilter('promotion')}>
          <Text
            style={[
              styles.filterText,
              filter === 'promotion' && styles.activeFilterText,
            ]}>
            Khuyến mãi món
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm khuyến mãi ..."
          value={searchText}
          onChangeText={setSearchText}></TextInput>
      </View>
      <View style={styles.addContainer}>
        <TouchableOpacity
          style={[styles.addButton, styles.discountButton]}
          onPress={() => openAddModal('discount')}>
          <Text style={styles.addButtonText}> + Thêm mã giảm giá</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.promotionButton]}
          onPress={() => openAddModal('promotion')}>
          <Text style={styles.addButtonText}>+ Thêm khuyến mãi món</Text>
        </TouchableOpacity>
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
      {/* Modal để thêm mới */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {formType === 'discount'
                ? 'Thêm mã giảm giá mới'
                : 'Thêm khuyến mãi món ăn mới'}
            </Text>
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>
                {formType === 'discount' ? 'Mã giảm giá' : 'Tên chương trình'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  formType === 'discount'
                    ? 'Ví dụ: WELCOME10'
                    : 'Ví dụ: Mua 1 tặng 1'
                }
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              {formType === 'discount' && (
                <>
                  <Text style={styles.inputLabel}>Mức giảm giá</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: 10%"
                    value={formData.discount}
                    onChangeText={(text) =>
                      setFormData({ ...formData, discount: text })
                    }
                    keyboardType="numeric"
                  />
                </>
              )}

              {formType === 'promotion' && (
                <>
                  <Text style={styles.inputLabel}>Áp dụng cho</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: Các món tráng miệng"
                    value={formData.appliedItems}
                    onChangeText={(text) =>
                      setFormData({ ...formData, appliedItems: text })
                    }
                  />
                </>
              )}

              <Text style={styles.inputLabel}>Ngày bắt đầu</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={formData.startDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, startDate: text })
                }
              />

              <Text style={styles.inputLabel}>Ngày kết thúc</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={formData.endDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, endDate: text })
                }
              />
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
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
