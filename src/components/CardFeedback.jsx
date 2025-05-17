import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { feedbackApi } from '../api/feedbackApi';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
const CardFeedback = ({
  item,
  handleCall,
  restaurantId,
  responseInfo,
  fetchFeedBack,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState('');
  const handleResponse = async () => {
    if (response.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung phản hồi');
      return;
    }
    const formatOrderId = (orderId) => {
      if (!orderId) return '';
      const firstChar = orderId.charAt(3);
      const length = firstChar === '0' ? 2 : 3;
      return orderId.slice(-length);
    };

    const orderId = formatOrderId(item.order_id);
    const feedback = {
      restaurant_id: restaurantId,
      customer_id: item.user.id,
      order_id: orderId,
      driver_id: item.driver_id,
      content: response,
      restaurant_res: true,
    };
    try {
      const response = await feedbackApi.createFeedback(feedback);
      if (response.success) {
        setModalVisible(false);
        setResponse('');
        fetchFeedBack();
      }
    } catch {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi vui lòng thử lại sau');
    }
  };
  return (
    <View style={styles.feedbackItem}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleCall(item.user.phone)}>
          <View style={styles.contactInfo}>
            <Ionicons name="call-outline" size={14} color="#2ecc71" />
            <Text style={styles.phone}>{item.user.phone}</Text>
            <Text style={styles.callText}>Nhấn để gọi</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.orderLabel}>Đơn hàng: </Text>
        <Text style={styles.orderId}>#{item.order_id}</Text>
      </View>
      <View style={styles.actionContainer}>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: responseInfo ? '#e8f5e9' : '#ffebee' },
          ]}>
          <Text
            style={[
              styles.status,
              { color: responseInfo ? '#2e7d32' : '#c62828' },
            ]}>
            {responseInfo ? 'Đã xử lý' : 'Chưa xử lý'}
          </Text>
        </View>
        {!responseInfo && (
          <TouchableOpacity
            style={styles.responseButton}
            onPress={() => setModalVisible(true)}>
            <Ionicons name="chatbubble-outline" size={16} color="#1976d2" />
            <Text style={styles.responseButtonText}>Phản hồi</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.responseSection}>
        {responseInfo && (
          <View style={styles.responseContent}>
            <Text style={styles.responseLabel}>Phản hồi của nhà hàng:</Text>
            <Text style={styles.responseText}>{responseInfo.content}</Text>
            <Text style={styles.responseDate}>
              {formatDate(responseInfo.created_at)}
            </Text>
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {item.response ? 'Phản hồi của bạn' : 'Viết phản hồi'}
            </Text>

            <TextInput
              style={styles.responseInput}
              placeholder="Nhập nội dung phản hồi..."
              multiline
              value={response}
              onChangeText={setResponse}
              editable={!item.response}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              {!item.response && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleResponse}>
                  <Text style={styles.buttonText}>Gửi</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CardFeedback;

const styles = StyleSheet.create({
  feedbackItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  contactButton: {
    marginTop: 4,
    marginBottom: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  phone: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 4,
    fontWeight: '500',
  },
  callText: {
    fontSize: 12,
    color: '#2ecc71',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9c4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    fontSize: 14,
    color: '#34495e',
    marginVertical: 8,
    lineHeight: 20,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  orderLabel: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  orderId: {
    fontSize: 13,
    color: '#2980b9',
    fontWeight: '500',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    elevation: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  responseButtonText: {
    marginLeft: 4,
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
  esponseSection: {
    marginTop: 12,
    padding: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  responseSection: {
    marginTop: 12,
    padding: 8,
  },
  responseContent: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  responseDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  replyButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});
